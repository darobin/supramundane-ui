
import { LitElement, html, css } from 'lit';
import { classMap } from 'lit/directives/class-map.js';

export class SmRadioGroup extends LitElement {
  static properties = {
    name: { type: String },
    value: { type: String },
    label: { type: String },
    required: { type: Boolean, reflect: true },
    disabled: { type: Boolean, reflect: true },
    orientation: { type: String },
    helpText: { type: String, attribute: 'help-text' },
  };

  static styles = css`
    :host {
      display: block;
      font-family: var(--sm-input-font-family);
    }

    .radio-group {
      display: flex;
      flex-direction: column;
      gap: var(--sm-spacing-2x-small);
    }

    .radio-group__label {
      display: inline-block;
      color: var(--sm-input-label-color);
      font-size: var(--sm-input-label-font-size-medium);
      font-weight: var(--sm-font-weight-semibold);
    }

    .radio-group__label .required {
      color: var(--sm-color-danger-600);
      margin-inline-start: var(--sm-spacing-3x-small);
    }

    .radio-group__options {
      display: flex;
      flex-direction: column;
      gap: var(--sm-spacing-x-small);
    }

    .radio-group__options--horizontal {
      flex-direction: row;
      flex-wrap: wrap;
      gap: var(--sm-spacing-medium);
    }

    .radio-group__help-text {
      color: var(--sm-input-help-text-color);
      font-size: var(--sm-input-help-text-font-size-medium);
    }
  `;

  constructor() {
    super();
    this.orientation = 'vertical';
    this.disabled = false;
    this.required = false;
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('sm-change', this.#handleRadioChange);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('sm-change', this.#handleRadioChange);
  }

  #handleRadioChange(e) {
    const radio = e.target;
    // Only handle sm-radio children
    if (!radio.matches || !radio.matches('sm-radio')) return;

    this.value = radio.value;
    this.#syncRadios(radio);
    this.dispatchEvent(new CustomEvent('sm-change', {
      bubbles: true,
      composed: true,
      detail: { value: this.value },
    }));
  }

  #getRadios() {
    return [...this.querySelectorAll('sm-radio')];
  }

  #syncRadios(activeRadio = null) {
    const radios = this.#getRadios();
    for (const radio of radios) {
      radio.name = this.name ?? '';
      if (this.disabled) {
        radio.disabled = true;
      }
      if (activeRadio !== null) {
        radio.checked = radio === activeRadio;
      } else if (this.value !== undefined) {
        radio.checked = radio.value === this.value;
      }
    }
  }

  #handleSlotChange() {
    this.#syncRadios();
  }

  updated(changedProperties) {
    if (changedProperties.has('name') || changedProperties.has('disabled') || changedProperties.has('value')) {
      this.#syncRadios();
    }
  }

  render() {
    const hasLabel = this.label || this.querySelector('[slot="label"]');
    const hasHelpText = this.helpText || this.querySelector('[slot="help-text"]');

    const optionsClasses = {
      'radio-group__options': true,
      'radio-group__options--horizontal': this.orientation === 'horizontal',
    };

    return html`
      <div
        class="radio-group"
        role="radiogroup"
        aria-required=${this.required ? 'true' : 'false'}
        aria-disabled=${this.disabled ? 'true' : 'false'}
        part="base"
      >
        ${hasLabel ? html`
          <span class="radio-group__label" part="label" id="radio-group-label">
            <slot name="label">${this.label}</slot>
            ${this.required ? html`<span class="required" aria-hidden="true">*</span>` : ''}
          </span>
        ` : ''}

        <div class=${classMap(optionsClasses)} part="options">
          <slot @slotchange=${this.#handleSlotChange}></slot>
        </div>

        ${hasHelpText ? html`
          <div class="radio-group__help-text" part="help-text">
            <slot name="help-text">${this.helpText}</slot>
          </div>
        ` : ''}
      </div>
    `;
  }
}

customElements.define('sm-radio-group', SmRadioGroup);
