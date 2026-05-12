
import { LitElement, html, css } from 'lit';

export class SmRelativeTime extends LitElement {
  static properties = {
    date: { type: String },
    format: { type: String },
    numeric: { type: String },
    locale: { type: String },
    sync: { type: Boolean },
  };

  static styles = css`
    :host {
      display: inline;
    }
  `;

  constructor() {
    super();
    this.format = 'long';
    this.numeric = 'auto';
    this.sync = false;
  }

  #interval = null;

  connectedCallback() {
    super.connectedCallback();
    if (this.sync) {
      this.#startSync();
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.#stopSync();
  }

  updated(changedProps) {
    if (changedProps.has('sync')) {
      if (this.sync) {
        this.#startSync();
      } else {
        this.#stopSync();
      }
    }
  }

  #startSync() {
    this.#stopSync();
    this.#interval = setInterval(() => this.requestUpdate(), 60_000);
  }

  #stopSync() {
    if (this.#interval) {
      clearInterval(this.#interval);
      this.#interval = null;
    }
  }

  #getDate() {
    if (!this.date) return new Date();
    if (this.date instanceof Date) return this.date;
    return new Date(this.date);
  }

  #format() {
    const d = this.#getDate();
    if (isNaN(d.getTime())) return '';

    const now = Date.now();
    const diffMs = d.getTime() - now;
    const diffSecs = Math.round(diffMs / 1000);
    const absSecs = Math.abs(diffSecs);

    let value;
    let unit;

    if (absSecs < 60) {
      value = diffSecs;
      unit = 'second';
    } else if (absSecs < 3600) {
      value = Math.round(diffSecs / 60);
      unit = 'minute';
    } else if (absSecs < 86400) {
      value = Math.round(diffSecs / 3600);
      unit = 'hour';
    } else if (absSecs < 604800) {
      value = Math.round(diffSecs / 86400);
      unit = 'day';
    } else if (absSecs < 2_629_800) {
      value = Math.round(diffSecs / 604800);
      unit = 'week';
    } else if (absSecs < 31_557_600) {
      value = Math.round(diffSecs / 2_629_800);
      unit = 'month';
    } else {
      value = Math.round(diffSecs / 31_557_600);
      unit = 'year';
    }

    try {
      return new Intl.RelativeTimeFormat(this.locale, {
        style: this.format,
        numeric: this.numeric,
      }).format(value, unit);
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

customElements.define('sm-relative-time', SmRelativeTime);
