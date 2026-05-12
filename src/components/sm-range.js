
import { LitElement, html, css } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { styleMap } from 'lit/directives/style-map.js';

export class SmRange extends LitElement {
  static formAssociated = true;

  static properties = {
    name: { type: String },
    value: { type: Number },
    min: { type: Number },
    max: { type: Number },
    step: { type: Number },
    disabled: { type: Boolean, reflect: true },
    label: { type: String },
    helpText: { type: String, attribute: 'help-text' },
    tooltipPlacement: { type: String, attribute: 'tooltip' },
    _hasFocus: { type: Boolean, state: true },
  };

  static styles = css`
    :host {
      display: block;
      font-family: var(--sm-input-font-family);
    }

    .form-control {
      display: flex;
      flex-direction: column;
      gap: var(--sm-spacing-2x-small);
    }

    .form-control__label {
      display: inline-block;
      color: var(--sm-input-label-color);
      font-size: var(--sm-input-label-font-size-medium);
      font-weight: var(--sm-font-weight-semibold);
    }

    .form-control__help-text {
      color: var(--sm-input-help-text-color);
      font-size: var(--sm-input-help-text-font-size-medium);
    }

    /* Range container */
    .range__wrapper {
      position: relative;
      display: flex;
      align-items: center;
      padding-top: 1.5rem; /* space for tooltip above */
    }

    .range__wrapper--tooltip-bottom {
      padding-top: 0;
      padding-bottom: 1.5rem;
    }

    .range__wrapper--tooltip-none {
      padding-top: 0;
      padding-bottom: 0;
    }

    /* The range input */
    .range__control {
      -webkit-appearance: none;
      appearance: none;
      width: 100%;
      height: 4px;
      border-radius: var(--sm-border-radius-pill);
      background: var(--sm-color-neutral-200);
      background-image: linear-gradient(
        var(--sm-color-primary-600),
        var(--sm-color-primary-600)
      );
      background-size: 0% 100%;
      background-repeat: no-repeat;
      cursor: pointer;
      outline: none;
      border: none;
      padding: 0;
    }

    .range__control:disabled {
      cursor: not-allowed;
      opacity: 0.5;
    }

    /* Thumb - webkit */
    .range__control::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 1rem;
      height: 1rem;
      border-radius: var(--sm-border-radius-circle);
      background-color: var(--sm-color-primary-600);
      border: none;
      cursor: pointer;
      transition:
        var(--sm-transition-fast) background-color,
        var(--sm-transition-fast) box-shadow;
    }

    .range__control:focus-visible::-webkit-slider-thumb {
      outline: var(--sm-focus-ring);
      outline-offset: var(--sm-focus-ring-offset);
    }

    .range__control::-webkit-slider-thumb:hover {
      background-color: var(--sm-color-primary-500);
    }

    /* Thumb - moz */
    .range__control::-moz-range-thumb {
      width: 1rem;
      height: 1rem;
      border-radius: var(--sm-border-radius-circle);
      background-color: var(--sm-color-primary-600);
      border: none;
      cursor: pointer;
    }

    .range__control:focus-visible::-moz-range-thumb {
      outline: var(--sm-focus-ring);
      outline-offset: var(--sm-focus-ring-offset);
    }

    /* Track - moz */
    .range__control::-moz-range-track {
      height: 4px;
      border-radius: var(--sm-border-radius-pill);
      background: var(--sm-color-neutral-200);
    }

    .range__control::-moz-range-progress {
      height: 4px;
      border-radius: var(--sm-border-radius-pill);
      background: var(--sm-color-primary-600);
    }

    /* Tooltip */
    .range__tooltip {
      position: absolute;
      top: 0;
      background-color: var(--sm-tooltip-background-color);
      color: var(--sm-tooltip-color);
      font-size: var(--sm-tooltip-font-size);
      font-family: var(--sm-tooltip-font-family);
      font-weight: var(--sm-tooltip-font-weight);
      line-height: var(--sm-tooltip-line-height);
      padding: var(--sm-tooltip-padding);
      border-radius: var(--sm-tooltip-border-radius);
      white-space: nowrap;
      transform: translateX(-50%);
      pointer-events: none;
      user-select: none;
    }

    .range__tooltip::after {
      content: '';
      position: absolute;
      left: 50%;
      bottom: calc(-1 * var(--sm-tooltip-arrow-size));
      transform: translateX(-50%);
      border: calc(var(--sm-tooltip-arrow-size) / 2) solid transparent;
      border-top-color: var(--sm-tooltip-background-color);
      border-bottom: none;
    }

    .range__tooltip--bottom {
      top: auto;
      bottom: 0;
    }

    .range__tooltip--bottom::after {
      top: calc(-1 * var(--sm-tooltip-arrow-size));
      bottom: auto;
      border-top: none;
      border-bottom: calc(var(--sm-tooltip-arrow-size) / 2) solid var(--sm-tooltip-background-color);
    }
  `;

  #internals;

  constructor() {
    super();
    this.#internals = this.attachInternals();
    this.value = 0;
    this.min = 0;
    this.max = 100;
    this.step = 1;
    this.disabled = false;
    this.tooltipPlacement = 'top';
    this._hasFocus = false;
  }

  get #fillPercent() {
    const range = this.max - this.min;
    if (range === 0) return 0;
    return ((this.value - this.min) / range) * 100;
  }

  get #thumbLeftPercent() {
    // Position tooltip accounting for thumb width (1rem = 16px assumed)
    // We use the same formula: fillPercent% offset slightly for thumb edge
    return this.#fillPercent;
  }

  #handleInput(e) {
    this.value = Number(e.target.value);
    this.#internals.setFormValue(String(this.value));
    this.dispatchEvent(new CustomEvent('sm-input', { bubbles: true, composed: true }));
  }

  #handleChange(e) {
    this.value = Number(e.target.value);
    this.#internals.setFormValue(String(this.value));
    this.dispatchEvent(new CustomEvent('sm-change', { bubbles: true, composed: true }));
  }

  render() {
    const hasLabel = this.label;
    const hasHelpText = this.helpText;
    const showTooltip = this.tooltipPlacement !== 'none';
    const fillPct = this.#fillPercent;

    const wrapperClass = [
      'range__wrapper',
      this.tooltipPlacement === 'bottom' ? 'range__wrapper--tooltip-bottom' : '',
      !showTooltip ? 'range__wrapper--tooltip-none' : '',
    ].filter(Boolean).join(' ');

    const tooltipClass = [
      'range__tooltip',
      this.tooltipPlacement === 'bottom' ? 'range__tooltip--bottom' : '',
    ].filter(Boolean).join(' ');

    // left position: fill% scaled to account for thumb (thumb 1rem, track full width)
    // calc(fillPct% * (100% - 1rem) / 100% + 0.5rem)
    const tooltipLeft = `calc(${fillPct}% * (100% - 1rem) / 100% + 0.5rem)`;

    const rangeStyle = styleMap({
      'background-size': `${fillPct}% 100%`,
    });

    return html`
      <div class="form-control" part="form-control">
        ${hasLabel ? html`
          <label class="form-control__label" part="label">${this.label}</label>
        ` : ''}

        <div class=${wrapperClass}>
          ${showTooltip ? html`
            <span
              class=${tooltipClass}
              part="tooltip"
              style="left: ${tooltipLeft}"
              aria-hidden="true"
            >${this.value}</span>
          ` : ''}

          <input
            class="range__control"
            part="input"
            type="range"
            name=${ifDefined(this.name)}
            .value=${String(this.value)}
            min=${this.min}
            max=${this.max}
            step=${this.step}
            ?disabled=${this.disabled}
            style=${rangeStyle}
            @input=${this.#handleInput}
            @change=${this.#handleChange}
          />
        </div>

        ${hasHelpText ? html`
          <div class="form-control__help-text" part="help-text">${this.helpText}</div>
        ` : ''}
      </div>
    `;
  }
}

customElements.define('sm-range', SmRange);
