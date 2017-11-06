import React, { Component } from 'react';
import LectureModel from './LectureModel'
import List from './List';
import { getPodcastFeed, parsePodcastXML } from './Helpers';

class App extends Component {
  constructor() {
    super();

    this.state = { 
      lectures: [],
      loading: true,
      error: false
    };    
  }

  componentDidMount() {
    const podcast = getPodcastFeed('https://standrewsiih.github.io/lectures.xml');

    parsePodcastXML(podcast)
      .then(lectures => this.processLectures(lectures))
      .catch(error => {
         this.setState({
          error: true,
          loading: false
        });
        console.error(error.message);
      });
  }

  processLectures = (lectures)  => {
    this.setState({
      lectures: lectures.map((lecture) => {
        return new LectureModel(
          lecture[0].elements[0].text, // title
          lecture[1].elements[0].text, // subtitle
          lecture[2].elements[0].text, // summary
          new Date(lecture[6].elements[0].text), // pubDate
          lecture[7].elements[0].text, // duration
          lecture[5].elements[0].text  // url
        );
      }),
      loading: false
    });

    return this.state.lectures;
  }  

  render() {    
    if(this.state.loading) {
      return (<p>Loading...</p>);
    }
    if(this.state.error) {
      return (<p>Could not load podcast feed. Please try refreshing this page.</p>);
    }

    return (
        <List lectures={this.state.lectures}/>
    );
  }
}

export default App;
