import React, { Component } from 'react';
import LectureModel from './LectureModel.js'
import Lecture from './Lecture.js'
import { xml2js } from 'xml-js';

class App extends Component {
  constructor() {
    super();

    this.state = { 
      lectures: [],
      loading: true,
      sort: {
        date: "asc",
        title: "asc",
        duration: "asc"
      }
    }
  }

  componentDidMount() {
    fetch('https://standrewsiih.github.io/lectures.xml')
      .then(response => response.text())
      .then(data => this.getItemsFromXML(data))
      .then(lectures => this.processLectures(lectures))
      .catch(error => console.error(error.message))
  }

  render() {
    if(this.state.loading) {
      return (<p>Loading...</p>);
    } else {
      return (
        <div className="App">
          <p>Sort lectures by:&nbsp; 
          <button onClick={this.sortDate}>Date</button>
          <button onClick={this.sortTitle}>Title</button>
          <button onClick={this.sortDuration}>Duration</button>
          </p>
          {this.state.lectures.map((lecture, index) => {
            return (
              <Lecture key={index} {...lecture} />
            )
          })}
        </div>
      );
    }
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
  }

  processLectures = (lectures)  => {
    this.setState({
      lectures: lectures.map((lecture) => {
        return new LectureModel(
          lecture[0].elements[0].text, // title
          lecture[1].elements[0].text, // subtitle
          lecture[2].elements[0].text, // summary
          lecture[6].elements[0].text, // pubDate
          lecture[7].elements[0].text, // duration
          lecture[5].elements[0].text  // url
        );
      }),
      loading: false
    });
  }

  sortDate = () => {
    let newState = {...this.state};

    newState.lectures.sort((a, b) => {
      if(newState.sort.date === "asc") {
        return new Date(a.pubDate) - new Date(b.pubDate);
      } else {
        return new Date(b.pubDate) - new Date(a.pubDate);        
      }
    });
    
    newState.sort.date = (newState.sort.date === "asc") ? "desc" : "asc";

    this.setState({
      lectures: newState.lectures,
      sort: newState.sort
    })
  };

  sortTitle = () => {
    let newState = {...this.state};

    newState.lectures.sort((a, b) => {
      if(newState.sort.title === "asc") {
        if(a.title < b.title) return -1;
        if(a.title > b.title) return 1;
        return 0;
      } else {
        if(a.title > b.title) return -1;
        if(a.title < b.title) return 1;
        return 0;
      }
    });
    
    newState.sort.title = (newState.sort.title === "asc") ? "desc" : "asc";

    this.setState({
      lectures: newState.lectures,
      sort: newState.sort
    })
  };

  sortDuration = () => {
    let newState = {...this.state};

    newState.lectures.sort((a, b) => {
      if(newState.sort.duration === "asc") {
        if(this.convertTime(a.duration) < this.convertTime(b.duration)) return -1;
        if(this.convertTime(a.duration) > this.convertTime(b.duration)) return 1;
        return 0;
      } else {
        if(this.convertTime(a.duration) > this.convertTime(b.duration)) return -1;
        if(this.convertTime(a.duration) < this.convertTime(b.duration)) return 1;
        return 0;
      }
    });
    
    newState.sort.duration = (newState.sort.duration === "asc") ? "desc" : "asc";

    this.setState({
      lectures: newState.lectures,
      sort: newState.sort
    })
  };

  convertTime = (duration) => {
    let time = duration.split(':');
    if(time.length === 3) {
      time = [(time[0] * 60 + time[1]), time[2]];
    }
    return (time[0] * 60) + time[1];
  };
}

export default App;
