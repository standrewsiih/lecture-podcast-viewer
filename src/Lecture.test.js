import React from 'react';
import { shallow } from 'enzyme';
import Lecture from './Lecture.js';
import moment from 'moment';

describe('Lecture', () => {

  const props = {
    title: "some lecture",
    subtitle: "some subtitle",
    summary: "some summary",
    pubDate: new Date(1487076708000),
    duration: "59:59",
    url: "https://www.intellectualhistory.net/some_lecture.mp3"
  }
  
  const lecture = shallow(<Lecture {...props}/>);
  
  it('should render properly', () => {
    expect(lecture).toMatchSnapshot();
  });

  it('should display the title', () => {
    expect(lecture.find('.page-subheading').text()).toBe('some lecture');
  });
  
  it('should display the date of publication', () => {
    expect(lecture.find('.date').text()).toBe('Tuesday February 14th 2017');
  });

  it('should contain an audio component', () => {
    expect(lecture.find('audio').exists()).toBe(true);
    expect(lecture.find('source').props().src).toBe(props.url);
  });

});