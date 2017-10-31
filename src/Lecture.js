import React from 'react';
import moment from 'moment';

const Lecture = (props) => {
  return(
    <div className="lecture">
      <div className="content-panel">    
        <h2 className="page-subheading">{props.title}</h2>
        <p className="date">{moment(props.pubDate).format('dddd MMMM Do YYYY')}</p>
        <p>{props.subtitle}</p>
        <p><audio preload="none" controls="controls"><source src={props.url} type="audio/mpeg" /></audio></p>
      </div>
    </div>
  );
};

export default Lecture;