import React, { Component } from "react";

import List from "./List";
import { getPodcastXml, parsePodcastXml, processLectures } from "./Helpers";

class App extends Component {
  state = {
    lectures: [],
    loading: true,
    error: false
  };

  async componentDidMount() {
    try {
      const feed = await getPodcastXml(
        "https://intellectualhistory.libsyn.com/rss"
      );
      const lectures = parsePodcastXml(feed);
      this.setState({
        lectures: processLectures(lectures),
        loading: false,
        error: false
      });
    } catch (e) {
      this.setState({
        loading: false,
        error: true
      });
    }
  }

  render() {
    if (this.state.loading) {
      return <p>Loading...</p>;
    }

    if (this.state.error) {
      return (
        <p>Could not load podcast feed. Please try refreshing this page.</p>
      );
    }

    return <List lectures={this.state.lectures} />;
  }
}

export default App;
