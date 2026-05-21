
import { LitElement, html, css } from 'lit';

export class SmFormatDate extends LitElement {
  static properties = {
    date: { type: String },
    weekday: { type: String },
    era: { type: String },
    year: { type: String },
    month: { type: String },
    day: { type: String },
    hour: { type: String },
    minute: { type: String },
    second: { type: String },
    timeZoneName: { type: String, attribute: 'time-zone-name' },
    timeZone: { type: String, attribute: 'time-zone' },
    hourFormat: { type: String, attribute: 'hour-format' },
    locale: { type: String },
  };

  static styles = css`
    :host {
      display: inline;
    }
  `;

  constructor() {
    super();
    this.hourFormat = 'auto';
  }

  #getDate() {
    if (!this.date) return new Date();
    if (this.date instanceof Date) return this.date;
    return new Date(this.date);
  }

  #format() {
    const d = this.#getDate();
    if (isNaN(d.getTime())) return '';

    const options = {};

    if (this.weekday) options.weekday = this.weekday;
    if (this.era) options.era = this.era;
    if (this.year) options.year = this.year;
    if (this.month) options.month = this.month;
    if (this.day) options.day = this.day;
    if (this.hour) options.hour = this.hour;
    if (this.minute) options.minute = this.minute;
    if (this.second) options.second = this.second;
    if (this.timeZoneName) options.timeZoneName = this.timeZoneName;
    if (this.timeZone) options.timeZone = this.timeZone;

    if (this.hourFormat === '12') options.hour12 = true;
    else if (this.hourFormat === '24') options.hour12 = false;

    try {
      return new Intl.DateTimeFormat(this.locale, options).format(d);
    } catch {
      return d.toLocaleDateString();
    }
  }

  render() {
    const d = this.#getDate();
    const datetime = isNaN(d.getTime()) ? '' : d.toISOString();
    return html`<time part="base" datetime=${datetime}>${this.#format()}</time>`;
  }
}

customElements.define('sm-format-date', SmFormatDate);
