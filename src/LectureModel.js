export default class Lecture {
  constructor(title, subtitle, summary, pubDate, duration, url) {
    this.title = title;
    this.subtitle = (subtitle.slice(-1) !== ".") ? subtitle + '.' : subtitle;
    this.summary = summary;
    this.pubDate = pubDate;
    this.duration = duration;
    this.url = url;
  }
}