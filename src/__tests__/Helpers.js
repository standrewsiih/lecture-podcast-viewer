import fetchMock from 'fetch-mock';
import { getPodcastFeed, parsePodcastXML } from '../Helpers';
import { xml2js } from 'xml-js';
import { xmlTestString, parsedTestFeed } from '../testConstants';

describe('Helpers', () => {

  describe('getPodcastFeed', () => {

    const mockResponse = { body: xmlTestString};    
    fetchMock.get('https://standrewsiih.github.io/lectures.xml', mockResponse);
    
    it('should create an async action to fetch the podcast feed and return it as a string', () => {
      return getPodcastFeed('https://standrewsiih.github.io/lectures.xml').then(response => {
        expect(response).toEqual(xmlTestString);
      })
    });

  });

  describe('parsePodcastXML', () => {
    
    it('should return an array of `items` from the resolved data promise', () => {
      return parsePodcastXML(Promise.resolve(xmlTestString)).then(response => {
        expect(response).toEqual(parsedTestFeed);
      })
    });

  });
  

});