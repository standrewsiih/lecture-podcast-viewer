import React from 'react';
import { shallow, mount } from 'enzyme';
import App from '../App';
import fetchMock from 'fetch-mock';
import { xmlTestString } from '../testConstants';
import Lecture from '../LectureModel';

describe('App', () => {

  const mockResponse = { body: xmlTestString};    
  fetchMock.get('https://standrewsiih.github.io/lectures.xml', mockResponse);

  describe('when the XML feed loads successfully', () => {
    let app = shallow(<App/>);
    
    app.setState({
      loading: false,
      error: false,
      years: ['2015', '2016', '2017'],
      lectures: [ 
        new Lecture (
          'some title',
          'some subtitle',
          'some summary',
          new Date('Tue, 18 Apr 2017 17:15:00 GMT'),
          '56:54',
          'https://www.intellectualhistory.net/some_lecture.mp3'),
        new Lecture (
          'another title',
          'another subtitle',
          'another summary',
          new Date('Tue, 1 Nov 2016 17:15:00 GMT'),
          '50:22',
          'https://www.intellectualhistory.net/another_lecture.mp3'),
        new Lecture (
          'some other title',
          'some other subtitle',
          'some other summary',
          new Date('Tue, 23 Jun 2015 17:15:00 GMT'),
          '52:14',
          'https://www.intellectualhistory.net/some_other_file.mp3'),
        new Lecture (
          'some other other title',
          'some other other subtitle',
          'some other other summary',
          new Date('Tue, 30 Jun 2015 17:15:00 GMT'),
          '55:52')
        ]
    })

    it('should render properly', () => {      
      expect(app).toMatchSnapshot();
    });

    it('should display Lecture components', () => {
      expect(app.find('Lecture')).toHaveLength(4);
    });

    describe('sort function', () => {
      
      it('should sort the Lecture components by date descending', () => {
        app.find('button').find('#pubDate').simulate('click', { target: { id: 'pubDate' }});

        expect(app.find('Lecture').first().props().pubDate.toString()).toEqual('Tue Jun 23 2015 18:15:00 GMT+0100 (BST)');
      });

      it('should sort the Lecture components by date ascending', () => {
        app.find('button').find('#pubDate').simulate('click', { target: { id: 'pubDate' }});

        expect(app.find('Lecture').first().props().pubDate.toString()).toEqual('Tue Apr 18 2017 18:15:00 GMT+0100 (BST)');
      });

      it('should sort the Lecture components by title descending', () => {
        app.find('button').find('#title').simulate('click', { target: { id: 'title' }});

        expect(app.find('Lecture').first().props().title).toEqual('another title');
      });
    });

    describe('search function', () => {

      it('should search the lecture for the specified string', () => {
        app.find('input').find('#searchString').simulate('change', { target: { value: 'some other title' }});

        expect(app.find('Lecture')).toHaveLength(1);
        expect(app.find('Lecture').first().props().title).toEqual('some other title');
      });

      it('should convert the search string to lower case', () => {
        app.find('input').find('#searchString').simulate('change', { target: { value: 'SOME OTHER TITLE' }});

        expect(app.find('Lecture')).toHaveLength(1);
        expect(app.find('Lecture').first().props().title).toEqual('some other title');
      });

      it('should display no lectures when there are no search results', () => {
        app.find('input').find('#searchString').simulate('change', { target: { value: 'szxcxzcxc' }});

        expect(app.find('Lecture')).toHaveLength(0);
      });

      it('should not search if the string is less than 3 characters', () => {
        app.find('input').find('#searchString').simulate('change', { target: { value: 'so' }});

        expect(app.state().search).toBe(undefined);
      });
    });

    describe('filter function', () => {
      it('should display lectures from a specific year', () => {        
        app.find('button').find('#y2015').simulate('click', { target: { id: 'y2015' }});

        expect(app.find('Lecture')).toHaveLength(2);
      });

      it('should display all lectures', () => {        
        app.find('button').find('#all').simulate('click', { target: { id: 'all' }});

        expect(app.find('Lecture')).toHaveLength(4);
      });
    });    

  });

  describe('when loading the XML feed fails', () => {
    let app = shallow(<App/>);
    
    app.setState({ 
      error: true, 
      loading: false
    });

    it('should display an error message', () => {
      expect(app.find('p').text()).toBe("Could not load podcast feed. Please try refreshing this page.");
    });

  });

});