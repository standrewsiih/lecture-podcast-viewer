import { xml2js } from 'xml-js';

export function parsePodcastXML(url) {
  return fetch(url)
    .then(response => response.text())
    .then(data => {
      let nodes = xml2js(data).elements[0].elements[0].elements;
      let keys = Object.keys(nodes);
      let items = [];
      
      keys.map((key) => {
        if(nodes[key].name === "item") {
          return items.push(nodes[key].elements);
        }

        return false;
      });

      return items;
    });
}