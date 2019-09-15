import { xml2js } from "xml-js";

import LectureModel from "./LectureModel";

export const getPodcastXml = url =>
  new Promise((resolve, reject) => {
    fetch(url).then(response => {
      if (response.status < 300) {
        return resolve(response.text());
      } else {
        reject(new Error(response.statusText));
      }
    });
  });

export const parsePodcastXml = feed => {
  const xml = xml2js(feed);
  const nodes = xml.elements[0].elements[0].elements;
  return nodes.filter(node => node.name === "item").map(node => node.elements);
};

export const processLectures = lectures =>
  lectures.map(
    lecture =>
      new LectureModel(
        lecture[0].name === "title" ? lecture[0].elements[0].text : null, // title
        lecture[11].name === "itunes:subtitle"
          ? lecture[11].elements[0].cdata
          : null, // subtitle
        lecture[5].name === "description" ? lecture[5].elements[0].cdata : null, // summary
        lecture[1].name === "pubDate"
          ? new Date(lecture[1].elements[0].text)
          : null, // pubDate
        lecture[8].name === "itunes:duration"
          ? lecture[8].elements[0].text
          : null, // duration
        lecture[3].name === "link" ? lecture[3].elements[0].cdata : null // url
      )
  );
