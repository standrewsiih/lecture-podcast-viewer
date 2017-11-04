import fetchMock from 'fetch-mock';
import { getPodcastFeed, parsePodcastXML } from './Helpers';
import { xml2js } from 'xml-js';

describe('Helpers', () => {

  describe('getPodcastFeed', () => {

    const mockResponse = { body: '<xml>Some xml</xml>'};    
    fetchMock.get('https://standrewsiih.github.io/lectures.xml', mockResponse);
    
    it('should create an async action to fetch the podcast feed and return it as a string', () => {
      return getPodcastFeed('https://standrewsiih.github.io/lectures.xml').then(response => {
        expect(response).toEqual("<xml>Some xml</xml>");
      })
    });

  });

  describe('parsePodcastXML', () => {

    const xmlString = "<rss><channel><language>en-gb</language><item><title>Cosmology and Ritual Magic in the Late Middle Ages</title></item><item><title>Natural law and casuistic reasoning in Roman jurisprudence</title></item></channel></rss>";

    const expectedResponse = [
      [{"elements": [{"text": "Cosmology and Ritual Magic in the Late Middle Ages", "type": "text"}], "name": "title", "type": "element"}],
      [{"elements": [{"text": "Natural law and casuistic reasoning in Roman jurisprudence", "type": "text"}], "name": "title", "type": "element"}]
    ];
    
    it('should return an array of `items` from the resolved data promise', () => {
      return parsePodcastXML(Promise.resolve(xmlString)).then(response => {
        expect(response).toEqual(expectedResponse);        
      })
    });

  });
  

});