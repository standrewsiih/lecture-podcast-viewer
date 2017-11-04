import { xml2js } from 'xml-js';

export const getPodcastFeed = (url) => {
  return fetch(url)
    .then(response => response.text())
};

export const parsePodcastXML = (dataPromise) => {
  return Promise.resolve(dataPromise)
    .then(data => {
      const xml = xml2js(data);      
      const nodes = xml.elements[0].elements[0].elements;      
      let items = [];
      
      Object.keys(nodes).map((key) => {
        if(nodes[key].name === "item") {
          return items.push(nodes[key].elements);
        }
        return false;
      });

      return items;
    })
};