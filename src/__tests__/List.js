import React from 'react';
import { shallow } from 'enzyme';
import List from '../List';
import Lecture from '../LectureModel';

describe('List', () => {

  let props = {
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
  };

  let list = shallow(<List {...props}/>);
  
  it('should render properly', () => {      
    expect(list).toMatchSnapshot();
  });

  it('should display Lecture components', () => {
    expect(list.find('Lecture')).toHaveLength(4);
  });

  describe('sort function', () => {

    it('should sort the Lecture components by title descending', () => {
      list.find('button').find('#title').simulate('click', { target: { id: 'title' }});

      expect(list.state().sort.title).toBe('desc');      
      expect(list.find('Lecture').first().props().title).toEqual('another title');
    });

    it('should sort the Lecture components by title ascending', () => {
      list.find('button').find('#title').simulate('click', { target: { id: 'title' }});

      expect(list.state().sort.title).toBe('asc');
      expect(list.find('Lecture').first().props().title).toEqual('some title');
    });
    
    it('should sort the Lecture components by date descending', () => {
      list.find('button').find('#pubDate').simulate('click', { target: { id: 'pubDate' }});

      expect(list.state().sort.pubDate).toBe('desc');
      expect(list.find('Lecture').first().props().pubDate.toString()).toEqual('Tue Jun 23 2015 18:15:00 GMT+0100 (BST)');
    });

    it('should sort the Lecture components by date ascending', () => {
      list.find('button').find('#pubDate').simulate('click', { target: { id: 'pubDate' }});

      expect(list.state().sort.pubDate).toBe('asc');      
      expect(list.find('Lecture').first().props().pubDate.toString()).toEqual('Tue Apr 18 2017 18:15:00 GMT+0100 (BST)');
    });
    
  });

  describe('search function', () => {

    it('should search the lecture title for the specified string', () => {
      list.find('input').find('#searchString').simulate('change', { target: { value: 'some other title' }});

      expect(list.find('Lecture')).toHaveLength(1);
      expect(list.find('Lecture').first().props().title).toContain('some other title');
    });

    it('should search the lecture subtitle for the specified string', () => {
      list.find('input').find('#searchString').simulate('change', { target: { value: 'some subtitle' }});

      expect(list.find('Lecture')).toHaveLength(1);
      expect(list.find('Lecture').first().props().subtitle).toContain('some subtitle');
    });

    it('should convert the search string to lower case', () => {
      list.find('input').find('#searchString').simulate('change', { target: { value: 'SOME OTHER TITLE' }});

      expect(list.state().search).toEqual('some other title');
    });

    it('should display no lectures when there are no search results', () => {
      list.find('input').find('#searchString').simulate('change', { target: { value: 'szxcxzcxc' }});

      expect(list.find('Lecture')).toHaveLength(0);
    });

    it('should not search if the string is less than 3 characters', () => {
      list.find('input').find('#searchString').simulate('change', { target: { value: 'so' }});

      expect(list.state().search).toBe(undefined);
    });
  });

  describe('filter function', () => {
    it('should display lectures from a specific year', () => {        
      list.find('button').find('#y2015').simulate('click', { target: { id: 'y2015' }});

      expect(list.find('Lecture')).toHaveLength(2);
    });

    it('should display all lectures', () => {        
      list.find('button').find('#all').simulate('click', { target: { id: 'all' }});

      expect(list.find('Lecture')).toHaveLength(4);
    });
  });    

});