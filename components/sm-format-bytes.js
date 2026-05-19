
import { LitElement, html, css } from 'lit';

export class SmFormatBytes extends LitElement {
  static properties = {
    value: { type: Number },
    unit: { type: String },
    display: { type: String },
    locale: { type: String },
  };

  static styles = css`
    :host {
      display: inline;
    }
  `;

  constructor() {
    super();
    this.value = 0;
    this.unit = 'byte';
    this.display = 'short';
    this.locale = undefined;
  }

  #format() {
    if (this.value == null || isNaN(this.value)) return '';

    // Probe whether Intl supports digital-storage units, fall back to manual
    try {
      new Intl.NumberFormat(this.locale, {
        style: 'unit',
        unit: this.unit === 'bit' ? 'gigabit' : 'gigabyte',
        unitDisplay: this.display,
      });
      return this.#formatWithIntl();
    } catch {
      return this.#formatManual();
    }
  }

  #formatWithIntl() {
    const bytes = this.unit === 'bit' ? this.value / 8 : this.value;
    const units = [
      { threshold: 1024 ** 4, unit: this.unit === 'bit' ? 'terabit' : 'terabyte' },
      { threshold: 1024 ** 3, unit: this.unit === 'bit' ? 'gigabit' : 'gigabyte' },
      { threshold: 1024 ** 2, unit: this.unit === 'bit' ? 'megabit' : 'megabyte' },
      { threshold: 1024, unit: this.unit === 'bit' ? 'kilobit' : 'kilobyte' },
      { threshold: 0, unit: this.unit === 'bit' ? 'bit' : 'byte' },
    ];

    const absBytes = Math.abs(bytes);
    const selected = units.find((u) => absBytes >= u.threshold) || units[units.length - 1];
    const divisor = selected.threshold || 1;
    const scaled = bytes / (divisor || 1);

    try {
      return new Intl.NumberFormat(this.locale, {
        style: 'unit',
        unit: selected.unit,
        unitDisplay: this.display,
        maximumFractionDigits: 2,
      }).format(scaled);
    } catch {
      return this.#formatManual();
    }
  }

  #formatManual() {
    const value = this.unit === 'bit' ? this.value / 8 : this.value;
    const abs = Math.abs(value);
    const sign = value < 0 ? '-' : '';
    const unitSuffix = this.unit === 'bit' ? 'b' : 'B';

    if (abs >= 1024 ** 4) return `${sign}${(abs / 1024 ** 4).toFixed(2)} T${unitSuffix}`;
    if (abs >= 1024 ** 3) return `${sign}${(abs / 1024 ** 3).toFixed(2)} G${unitSuffix}`;
    if (abs >= 1024 ** 2) return `${sign}${(abs / 1024 ** 2).toFixed(2)} M${unitSuffix}`;
    if (abs >= 1024) return `${sign}${(abs / 1024).toFixed(2)} K${unitSuffix}`;
    return `${sign}${abs} ${unitSuffix}`;
  }

  render() {
    return html`<span part="base">${this.#format()}</span>`;
  }
}

customElements.define('sm-format-bytes', SmFormatBytes);
