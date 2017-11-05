import React, { Component } from 'react';
import LectureModel from './LectureModel'
import Lecture from './Lecture';
import { getPodcastFeed, parsePodcastXML } from './Helpers';

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
      filter: "all",
      search: undefined
    };    
  }

  componentDidMount() {
    const podcast = getPodcastFeed('https://standrewsiih.github.io/lectures.xml');

    parsePodcastXML(podcast)
      .then(lectures => this.processLectures(lectures))
      .then(processedLectures => this.setYears(processedLectures))
      .catch(error => {
         this.setState({
          error: true,
          loading: false
        });
        console.error(error.message);
      });
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
        <p>Search lectures:&nbsp;
          <input id="searchString" type="search" placeholder="Enter speaker or keyword" onChange={this.search}/>
        </p>
        {this.displayLectures()}
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
      return <button key={index} id={'y' + year} onClick={this.filter}>{year}</button>
    });
  }  

  displayLectures = () => {
    let lecturesToDisplay = this.state.lectures
      .filter((lecture) => { // filter lectures
        if(this.state.filter !== "all") {
          return lecture.year === this.state.filter;
        }
        return true;
      })
      .filter((lecture) => { // search lectures
        return this.searchLecture(lecture);
      })
      .map((lecture, index) => {
        return (
          <div className="lecture" key={index}>
            <Lecture {...lecture} />
          </div>
        )
      });
    
    if(lecturesToDisplay.length > 0) {
      return lecturesToDisplay;      
    }
    else {
      return (<p>No lecture descriptions matched your search terms.</p>);
    }
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
  };

  sort = (e) => {    
    let type = e.target.id;
    let updatedState = {...this.state};   

    updatedState.lectures.sort((a, b) => {
      if(updatedState.sort[type] === "asc") {
        if(a[type] < b[type]) return -1;
        if(a[type] > b[type]) return 1;
        return 0;
      } else {
        if(a[type] > b[type]) return -1;
        if(a[type] < b[type]) return 1;
        return 0;
      }
    });
    
    updatedState.sort[type] = (updatedState.sort[type] === "asc") ? "desc" : "asc";

    this.setState({
      lectures: updatedState.lectures,
      sort: updatedState.sort
    });
  };

  filter = (e) => {
    let filter = e.target.id === 'all' ? e.target.id : e.target.id.substring(1);
    this.setState({
      filter: filter
    });
  };

  search = (e) => {
    let searchTerm = e.target.value.toLowerCase();

    if(searchTerm.length < 3) {
      searchTerm = undefined;
    }

    this.setState({
      search: searchTerm
    });
  }  

  searchLecture = (lecture) => {
    if(this.state.search) {
      if(lecture.title.toLowerCase().includes(this.state.search)) return true;
      if(lecture.subtitle.toLowerCase().includes(this.state.search)) return true;
      return false;
    }

    return true;
  }
  
}

export default App;
