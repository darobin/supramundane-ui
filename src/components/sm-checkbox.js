
import { LitElement, html, css } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { iconCheck, iconMinus } from '../icons/index.js';

export class SmCheckbox extends LitElement {
  static formAssociated = true;

  static properties = {
    name: { type: String },
    value: { type: String },
    checked: { type: Boolean, reflect: true },
    indeterminate: { type: Boolean, reflect: true },
    disabled: { type: Boolean, reflect: true },
    required: { type: Boolean, reflect: true },
    size: { type: String, reflect: true },
    label: { type: String },
  };

  static styles = css`
    :host {
      display: inline-flex;
      align-items: flex-start;
      font-family: var(--sm-input-font-family);
      color: var(--sm-input-color);
    }

    :host([disabled]) {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .checkbox__label {
      display: inline-flex;
      align-items: center;
      gap: var(--sm-spacing-x-small);
      cursor: pointer;
      user-select: none;
    }

    :host([disabled]) .checkbox__label {
      cursor: not-allowed;
      pointer-events: none;
    }

    /* Hide native input */
    .checkbox__input {
      position: absolute;
      opacity: 0;
      width: 0;
      height: 0;
      margin: 0;
      padding: 0;
    }

    /* Custom box */
    .checkbox__control {
      flex: 0 0 auto;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: var(--sm-toggle-size-medium);
      height: var(--sm-toggle-size-medium);
      border: var(--sm-input-border-width) solid var(--sm-input-border-color);
      border-radius: var(--sm-border-radius-medium);
      background-color: var(--sm-input-background-color);
      color: #fff;
      transition:
        var(--sm-transition-fast) background-color,
        var(--sm-transition-fast) border-color,
        var(--sm-transition-fast) box-shadow;
    }

    .checkbox__control svg {
      width: 0.75em;
      height: 0.75em;
    }

    .checkbox__label:hover:not([disabled]) .checkbox__control {
      border-color: var(--sm-input-border-color-hover);
    }

    .checkbox__input:focus-visible ~ .checkbox__control {
      outline: var(--sm-focus-ring);
      outline-offset: var(--sm-focus-ring-offset);
    }

    /* Checked / indeterminate */
    :host([checked]) .checkbox__control,
    :host([indeterminate]) .checkbox__control {
      background-color: var(--sm-color-primary-600);
      border-color: var(--sm-color-primary-600);
    }

    /* Sizes */
    :host([size='small']) .checkbox__control {
      width: var(--sm-toggle-size-small);
      height: var(--sm-toggle-size-small);
    }
    :host([size='small']) .checkbox__control svg {
      width: 0.6em;
      height: 0.6em;
    }
    :host([size='small']) .checkbox__label {
      font-size: var(--sm-font-size-x-small);
    }

    :host([size='medium']) .checkbox__control {
      width: var(--sm-toggle-size-medium);
      height: var(--sm-toggle-size-medium);
    }
    :host([size='medium']) .checkbox__label {
      font-size: var(--sm-font-size-small);
    }

    :host([size='large']) .checkbox__control {
      width: var(--sm-toggle-size-large);
      height: var(--sm-toggle-size-large);
    }
    :host([size='large']) .checkbox__control svg {
      width: 0.9em;
      height: 0.9em;
    }
    :host([size='large']) .checkbox__label {
      font-size: var(--sm-font-size-medium);
    }

    .checkbox__label-text:empty {
      display: none;
    }
  `;

  #internals;

  constructor() {
    super();
    this.#internals = this.attachInternals();
    this.value = 'on';
    this.checked = false;
    this.indeterminate = false;
    this.disabled = false;
    this.required = false;
    this.size = 'medium';
  }

  #handleChange(e) {
    if (this.disabled) return;
    this.checked = e.target.checked;
    if (this.checked) {
      this.indeterminate = false;
    }
    this.#internals.setFormValue(this.checked ? this.value : null);
    this.dispatchEvent(new CustomEvent('sm-change', { bubbles: true, composed: true }));
    this.dispatchEvent(new CustomEvent('sm-input', { bubbles: true, composed: true }));
  }

  render() {
    const icon = this.indeterminate ? iconMinus() : this.checked ? iconCheck() : '';

    return html`
      <label class="checkbox__label" part="base">
        <input
          class="checkbox__input"
          type="checkbox"
          .checked=${this.checked}
          .indeterminate=${this.indeterminate}
          ?disabled=${this.disabled}
          ?required=${this.required}
          name=${this.name ?? ''}
          value=${this.value}
          @change=${this.#handleChange}
        />
        <span class="checkbox__control" part="control" aria-hidden="true">
          ${icon}
        </span>
        <span class="checkbox__label-text" part="label">
          ${this.label ?? ''}
          <slot></slot>
        </span>
      </label>
    `;
  }
}

customElements.define('sm-checkbox', SmCheckbox);
