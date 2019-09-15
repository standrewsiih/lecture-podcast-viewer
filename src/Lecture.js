import React from "react";
import ReactAudioPlayer from "react-audio-player";
import moment from "moment";

const Lecture = props => (
  <div className="content-panel">
    <h2 className="page-subheading">{props.title}</h2>
    <p className="date">{moment(props.pubDate).format("MMMM Do YYYY")}</p>
    <p>{props.subtitle}</p>
    <ReactAudioPlayer preload="none" controls src={props.url} />
  </div>
);

export default Lecture;
