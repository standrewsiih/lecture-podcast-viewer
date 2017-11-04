import React, { Component } from 'react';
import LectureModel from './LectureModel'
import Lecture from './Lecture';
import getPodcastFeed from './getPodcastFeed';
import { xml2js } from 'xml-js';

class App extends Component {
  constructor() {
    super();

    this.state = { 
      lectures: [],
      years: [],
      loading: true,
      error: false,
      sort: {
        pubDate: "asc",
        title: "asc",
        length: "asc"
      },
      filter: "all"
    };    
  }

  componentDidMount() {
    const podcastFeed = getPodcastFeed('https://standrewsiih.github.io/lectures.xml');

    podcastFeed.then(lectures => this.processLectures(lectures))
      .then(processedLectures => this.setYears(processedLectures))
      .catch(error => {
        this.setState({
          error: true,
          loading: false
        });
        console.error(error.message);
      });

    // let response = getPodcastFeed('https://standrewsiih.github.io/lectures.xml');
    // console.log(response);
  }

  render() {
    if(this.state.loading) {
      return (<p>Loading...</p>);
    }
    if(this.state.error) {
      return (<p>Could not load podcast feed. Please try refreshing this page.</p>);
    }

    return (
      <div className="App">
        <p>Sort lectures by:&nbsp;
        <button id="pubDate" onClick={this.sort}>Date</button>
        <button id="title" onClick={this.sort}>Title</button>
        <button id="length" onClick={this.sort}>Duration</button>
        </p>
        <p>Show lectures from:&nbsp;
        <button id="all" onClick={this.filter}>all years</button>
        {this.displayButtons()}        
        </p>
        {this.state.lectures.filter((lecture) => {
          if(this.state.filter !== "all") {
            return lecture.year === this.state.filter
          } else {
            return true;
          }
        }).map((lecture, index) => {
          return (
            <div className="lecture" key={index}>
              <Lecture {...lecture} />
            </div>
          )
        })}
      </div>
    );
  }

  setYears = (lectures) => {
    let years = [];

    lectures.filter((lecture) => {
      if(years.indexOf(lecture.year) === -1) {
        return years.push(lecture.year);
      }
      return false;
    });

    return this.setState({
      years: years.sort()
    });
  }

  displayButtons = () => {    
    return this.state.years.map((year, index) => {
      return <button key={index} id={year} onClick={this.filter}>{year}</button>
    });
  }

  getItemsFromXML = (data) => {
    let rawData = xml2js(data).elements[0].elements[0].elements;
    let items = Object.keys(rawData);
    let lectures = [];
    
    items.map((item) => {
      if(rawData[item].name === "item") {
        return lectures.push(rawData[item].elements);
      }

      return false;
    });

    return lectures;
  };

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
  };

  sort = (e) => {    
    let type = e.target.id;
    let newState = {...this.state};   

    newState.lectures.sort((a, b) => {
      if(newState.sort[type] === "asc") {
        if(a[type] < b[type]) return -1;
        if(a[type] > b[type]) return 1;
        return 0;
      } else {
        if(a[type] > b[type]) return -1;
        if(a[type] < b[type]) return 1;
        return 0;
      }
    });
    
    newState.sort[type] = (newState.sort[type] === "asc") ? "desc" : "asc";

    this.setState({
      lectures: newState.lectures,
      sort: newState.sort
    })
  };

  filter = (e) => {
    this.setState({
      filter: e.target.id
    })
  };
  
}

export default App;
