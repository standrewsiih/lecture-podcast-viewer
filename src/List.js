import React, { Component } from "react";
import Lecture from "./Lecture";

class List extends Component {
  state = {
    sort: {
      pubDate: "asc",
      title: "asc",
      length: "asc"
    },
    filter: "all",
    search: undefined
  };

  render() {
    return (
      <div className="List">
        <p>
          Sort lectures by:&nbsp;
          <button id="pubDate" onClick={this.sort}>
            Date
          </button>
          <button id="title" onClick={this.sort}>
            Title
          </button>
          <button id="length" onClick={this.sort}>
            Duration
          </button>
        </p>
        <p>
          Show lectures from:&nbsp;
          <button id="all" onClick={this.filter}>
            all years
          </button>
          {this.filterButtons()}
        </p>
        <p>
          Search lectures:&nbsp;
          <input
            id="searchString"
            type="search"
            placeholder="Enter speaker or keyword"
            onChange={this.search}
          />
        </p>
        {this.show()}
      </div>
    );
  }

  show = () => {
    const lecturesToShow = this.props.lectures
      .filter(lecture => {
        if (this.state.filter !== "all") {
          return lecture.year === this.state.filter;
        }
        return true;
      })
      .filter(lecture => this.searchLecture(lecture))
      .map((lecture, index) => <Lecture {...lecture} key={index} />);

    return lecturesToShow.length > 0 ? (
      lecturesToShow
    ) : (
      <p>No lecture descriptions matched your search terms.</p>
    );
  };

  filterButtons = () => {
    const years = [];

    this.props.lectures.filter(lecture => {
      if (years.indexOf(lecture.year) === -1) {
        return years.push(lecture.year);
      }
      return false;
    });

    return years.sort().map((year, index) => {
      return (
        <button key={index} id={"y" + year} onClick={this.filter}>
          {year}
        </button>
      );
    });
  };

  sort = e => {
    const type = e.target.id;

    this.props.lectures.sort((a, b) => {
      if (this.state.sort[type] === "asc") {
        if (a[type] < b[type]) return -1;
        if (a[type] > b[type]) return 1;
        return 0;
      } else {
        if (a[type] > b[type]) return -1;
        if (a[type] < b[type]) return 1;
        return 0;
      }
    });

    const sort = { ...this.state.sort };
    sort[type] = sort[type] === "asc" ? "desc" : "asc";

    this.setState({
      sort
    });
  };

  filter = e => {
    const filter =
      e.target.id === "all" ? e.target.id : e.target.id.substring(1);
    this.setState({ filter });
  };

  search = e => {
    let searchTerm = e.target.value.toLowerCase();

    if (searchTerm.length < 3) {
      searchTerm = undefined;
    }

    this.setState({
      search: searchTerm
    });
  };

  searchLecture = lecture => {
    if (this.state.search) {
      return (
        lecture.title.toLowerCase().includes(this.state.search) ||
        lecture.subtitle.toLowerCase().includes(this.state.search)
      );
    }

    return true;
  };
}

export default List;
