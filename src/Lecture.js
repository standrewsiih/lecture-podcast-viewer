import React, { Component } from 'react';
import moment from 'moment';

class Lecture extends Component {  

  render() {
    return (
      <div className="content-panel lecture">    
        <h2 className="page-subheading">{this.props.title}</h2>
        <strong>{moment(this.props.pubDate).format('dddd MMMM Do YYYY')}</strong>
        <p>{this.props.subtitle}</p>
        <p><audio preload="none" controls="controls"><source src={this.props.url} type="audio/mpeg" /></audio></p>
      </div>
    );
  }

}

export default Lecture;
