
import { LitElement, html, css } from 'lit';

export class SmFormatNumber extends LitElement {
  static properties = {
    value: { type: Number },
    locale: { type: String },
    numberType: { type: String, attribute: 'type' },
    noGrouping: { type: Boolean, attribute: 'no-grouping' },
    currency: { type: String },
    currencyDisplay: { type: String, attribute: 'currency-display' },
    unit: { type: String },
    unitDisplay: { type: String, attribute: 'unit-display' },
    minimumIntegerDigits: { type: Number, attribute: 'minimum-integer-digits' },
    minimumFractionDigits: { type: Number, attribute: 'minimum-fraction-digits' },
    maximumFractionDigits: { type: Number, attribute: 'maximum-fraction-digits' },
    minimumSignificantDigits: { type: Number, attribute: 'minimum-significant-digits' },
    maximumSignificantDigits: { type: Number, attribute: 'maximum-significant-digits' },
  };

  static styles = css`
    :host {
      display: inline;
    }
  `;

  constructor() {
    super();
    this.numberType = 'decimal';
    this.noGrouping = false;
  }

  #format() {
    if (this.value == null || isNaN(this.value)) return '';

    const options = {};

    options.style = this.numberType;

    if (this.noGrouping) options.useGrouping = false;

    if (this.currency) options.currency = this.currency;
    if (this.currencyDisplay) options.currencyDisplay = this.currencyDisplay;
    if (this.unit) options.unit = this.unit;
    if (this.unitDisplay) options.unitDisplay = this.unitDisplay;

    if (this.minimumIntegerDigits != null) options.minimumIntegerDigits = this.minimumIntegerDigits;
    if (this.minimumFractionDigits != null) options.minimumFractionDigits = this.minimumFractionDigits;
    if (this.maximumFractionDigits != null) options.maximumFractionDigits = this.maximumFractionDigits;
    if (this.minimumSignificantDigits != null) options.minimumSignificantDigits = this.minimumSignificantDigits;
    if (this.maximumSignificantDigits != null) options.maximumSignificantDigits = this.maximumSignificantDigits;

    try {
      return new Intl.NumberFormat(this.locale, options).format(this.value);
    } catch {
      return String(this.value);
    }
  }

  render() {
    return html`<span part="base">${this.#format()}</span>`;
  }
}

customElements.define('sm-format-number', SmFormatNumber);
