export default class Lecture {
  constructor(title, subtitle, summary, pubDate, duration, url) {
    this.title = title;
    this.subtitle = (subtitle.slice(-1) !== ".") ? subtitle + '.' : subtitle;
    this.summary = summary;
    this.pubDate = pubDate;
    this.duration = duration;
    this.length = this.calcLength(duration);
    this.url = url;
  }

  calcLength = (duration) => {
    let time = duration.split(':');
    if(time.length === 3) {
      time = [(time[0] * 60 + time[1]), time[2]];
    }
    return (time[0] * 60) + time[1];
  };
}