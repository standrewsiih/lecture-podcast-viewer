import moment from "moment";

export default class Lecture {
  constructor(title, subtitle, summary, pubDate, duration, url) {
    this.title = title;
    this.subtitle = this.formatSubtitle(subtitle);
    this.summary = summary;
    this.pubDate = pubDate;
    this.year = moment(this.pubDate).format("YYYY");
    this.duration = duration;
    this.length = this.calcLength(duration);
    this.url = url;
  }

  calcLength = duration => {
    let time = duration.split(":").map(Number);

    if (time.length === 3) {
      time = [time[0] * 60 + time[1], time[2]];
    }

    return time[0] * 60 + time[1];
  };

  formatSubtitle = subtitle => {
    return subtitle.slice(-1) !== "." ? subtitle + "." : subtitle;
  };
}
