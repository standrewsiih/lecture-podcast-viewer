import React from 'react';
import moment from 'moment';

const Lecture = (props) => {
  return(
    <div className="content-panel lecture">    
      <h2 className="page-subheading">{props.title}</h2>
      <strong>{moment(props.pubDate).format('dddd MMMM Do YYYY')}</strong>
      <p>{props.subtitle}</p>
      <p><audio preload="none" controls="controls"><source src={props.url} type="audio/mpeg" /></audio></p>
    </div>
  );
};

export default Lecture;