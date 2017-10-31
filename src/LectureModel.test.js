import Lecture from './LectureModel.js';
import moment from 'moment';

describe('Lecture', () => {

  let mockLecture = [
    'some title',
    '', // subtitle
    'some summary',
    '', // pubDate
    '', // duration
    'https://www.intellectualhistory.net/some_lecture.mp3'];

  it('should calculate the total length when the duration is under 1 hour', () => {
    mockLecture[4] = '59:59'
    const underTest = new Lecture(...mockLecture);
    expect(underTest.length).toEqual(3599);
  });

  it('should calculate the total length when the duration is over 1 hour', () => {
    mockLecture[4] = "1:20:21";
    const underTest = new Lecture(...mockLecture);    
    expect(underTest.length).toEqual(4821);
  });

  it('should return the year from the publication date', () => {
    mockLecture[3] = new Date(1487076708000);
    const underTest = new Lecture(...mockLecture);    
    expect(underTest.year).toEqual('2017');
  });

  it('should format the subtitle', () => {
    mockLecture[1] = "some subtitle";
    const underTest = new Lecture(...mockLecture);    
    expect(underTest.subtitle).toEqual('some subtitle.');
  });

  it('should not format a subtitle that is already formatted', () => {
    mockLecture[1] = "some subtitle.";
    const underTest = new Lecture(...mockLecture);    
    expect(underTest.subtitle).not.toEqual('some subtitle..');
  });
    
});