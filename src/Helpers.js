import { xml2js } from 'xml-js';

export function parsePodcastXML(url) {
  return fetch(url)
    .then(response => response.text())
    .then(data => {
      let xml = xml2js(data).elements[0].elements[0].elements;
      let items = [];
      
      Object.keys(xml).map((key) => {
        if(xml[key].name === "item") {
          return items.push(xml[key].elements);
        }
        return false;
      });

      return items;
    });
}