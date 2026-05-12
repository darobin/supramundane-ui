
import { LitElement, html, css } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { iconX, iconEye, iconEyeSlash } from '../icons/index.js';

export class SmInput extends LitElement {
  static formAssociated = true;

  static properties = {
    type: { type: String },
    name: { type: String },
    value: { type: String },
    size: { type: String, reflect: true },
    filled: { type: Boolean, reflect: true },
    pill: { type: Boolean, reflect: true },
    label: { type: String },
    helpText: { type: String, attribute: 'help-text' },
    placeholder: { type: String },
    disabled: { type: Boolean, reflect: true },
    readonly: { type: Boolean, reflect: true },
    required: { type: Boolean, reflect: true },
    clearable: { type: Boolean, reflect: true },
    passwordToggle: { type: Boolean, reflect: true, attribute: 'password-toggle' },
    minlength: { type: Number },
    maxlength: { type: Number },
    min: { type: String },
    max: { type: String },
    step: { type: String },
    autocomplete: { type: String },
    pattern: { type: String },
    _passwordVisible: { type: Boolean, state: true },
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

    /* Label */
    .form-control__label {
      display: inline-block;
      color: var(--sm-input-label-color);
      font-size: var(--sm-input-label-font-size-medium);
      font-weight: var(--sm-font-weight-semibold);
    }
    :host([size='small']) .form-control__label {
      font-size: var(--sm-input-label-font-size-small);
    }
    :host([size='large']) .form-control__label {
      font-size: var(--sm-input-label-font-size-large);
    }

    .form-control__label .required {
      color: var(--sm-color-danger-600);
      margin-inline-start: var(--sm-spacing-3x-small);
    }

    /* Input wrapper */
    .input-wrapper {
      display: flex;
      align-items: center;
      position: relative;
      background-color: var(--sm-input-background-color);
      border: var(--sm-input-border-width) solid var(--sm-input-border-color);
      border-radius: var(--sm-input-border-radius-medium);
      color: var(--sm-input-color);
      transition:
        var(--sm-transition-fast) background-color,
        var(--sm-transition-fast) border-color,
        var(--sm-transition-fast) box-shadow;
      height: var(--sm-input-height-medium);
      font-size: var(--sm-input-font-size-medium);
    }

    :host([size='small']) .input-wrapper {
      height: var(--sm-input-height-small);
      font-size: var(--sm-input-font-size-small);
      border-radius: var(--sm-input-border-radius-small);
    }
    :host([size='large']) .input-wrapper {
      height: var(--sm-input-height-large);
      font-size: var(--sm-input-font-size-large);
      border-radius: var(--sm-input-border-radius-large);
    }

    :host([pill]) .input-wrapper {
      border-radius: var(--sm-border-radius-pill);
    }

    :host([filled]) .input-wrapper {
      background-color: var(--sm-input-filled-background-color);
      border-color: transparent;
      color: var(--sm-input-filled-color);
    }

    .input-wrapper:hover:not(.input-wrapper--disabled) {
      border-color: var(--sm-input-border-color-hover);
    }
    :host([filled]) .input-wrapper:hover:not(.input-wrapper--disabled) {
      background-color: var(--sm-input-filled-background-color-hover);
    }

    .input-wrapper--focused {
      border-color: var(--sm-input-border-color-focus);
      box-shadow: 0 0 0 var(--sm-focus-ring-width) var(--sm-input-focus-ring-color);
    }
    :host([filled]) .input-wrapper--focused {
      background-color: var(--sm-input-filled-background-color-focus);
    }

    .input-wrapper--disabled {
      background-color: var(--sm-input-background-color-disabled);
      border-color: var(--sm-input-border-color-disabled);
      color: var(--sm-input-color-disabled);
      cursor: not-allowed;
      opacity: 0.5;
    }
    :host([filled]) .input-wrapper--disabled {
      background-color: var(--sm-input-filled-background-color-disabled);
    }

    /* Native input */
    .input__control {
      flex: 1 1 auto;
      min-width: 0;
      height: 100%;
      background: none;
      border: none;
      outline: none;
      padding: 0 var(--sm-input-spacing-medium);
      color: inherit;
      font-family: var(--sm-input-font-family);
      font-size: inherit;
      font-weight: var(--sm-input-font-weight);
      letter-spacing: var(--sm-input-letter-spacing);
    }

    :host([size='small']) .input__control {
      padding: 0 var(--sm-input-spacing-small);
    }
    :host([size='large']) .input__control {
      padding: 0 var(--sm-input-spacing-large);
    }

    .input__control::placeholder {
      color: var(--sm-input-placeholder-color);
    }

    .input__control:disabled {
      cursor: not-allowed;
    }

    /* Prefix / suffix slots */
    .input__prefix,
    .input__suffix {
      display: inline-flex;
      flex: 0 0 auto;
      align-items: center;
      color: var(--sm-input-icon-color);
    }

    .input__prefix {
      padding-inline-start: var(--sm-input-spacing-medium);
    }
    :host([size='small']) .input__prefix {
      padding-inline-start: var(--sm-input-spacing-small);
    }
    :host([size='large']) .input__prefix {
      padding-inline-start: var(--sm-input-spacing-large);
    }

    .input__suffix {
      padding-inline-end: var(--sm-input-spacing-medium);
    }
    :host([size='small']) .input__suffix {
      padding-inline-end: var(--sm-input-spacing-small);
    }
    :host([size='large']) .input__suffix {
      padding-inline-end: var(--sm-input-spacing-large);
    }

    /* When prefix slot is populated, remove left padding from the input */
    .input__prefix:not(:empty) ~ .input__control {
      padding-inline-start: var(--sm-spacing-x-small);
    }

    /* Icon buttons inside suffix area */
    .input__icon-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: none;
      border: none;
      padding: 0 var(--sm-spacing-3x-small);
      cursor: pointer;
      color: var(--sm-input-icon-color);
      line-height: 1;
    }

    .input__icon-btn:hover {
      color: var(--sm-input-icon-color-hover);
    }

    .input__icon-btn:focus-visible {
      outline: var(--sm-focus-ring);
      outline-offset: var(--sm-focus-ring-offset);
      border-radius: var(--sm-border-radius-medium);
    }

    .input__icon-btn svg {
      width: 1em;
      height: 1em;
    }

    /* Help text */
    .form-control__help-text {
      color: var(--sm-input-help-text-color);
      font-size: var(--sm-input-help-text-font-size-medium);
    }
    :host([size='small']) .form-control__help-text {
      font-size: var(--sm-input-help-text-font-size-small);
    }
    :host([size='large']) .form-control__help-text {
      font-size: var(--sm-input-help-text-font-size-large);
    }
  `;

  #internals;
  #passwordVisible = false;
  #hasFocus = false;

  constructor() {
    super();
    this.#internals = this.attachInternals();
    this.type = 'text';
    this.value = '';
    this.size = 'medium';
    this.filled = false;
    this.pill = false;
    this.disabled = false;
    this.readonly = false;
    this.required = false;
    this.clearable = false;
    this.passwordToggle = false;
    this._passwordVisible = false;
    this._hasFocus = false;
  }

  get #inputEl() {
    return this.shadowRoot?.querySelector('.input__control');
  }

  #handleInput(e) {
    this.value = e.target.value;
    this.#internals.setFormValue(this.value);
    this.dispatchEvent(new CustomEvent('sm-input', { bubbles: true, composed: true }));
  }

  #handleChange(e) {
    this.value = e.target.value;
    this.#internals.setFormValue(this.value);
    this.dispatchEvent(new CustomEvent('sm-change', { bubbles: true, composed: true }));
  }

  #handleFocus() {
    this._hasFocus = true;
    this.dispatchEvent(new CustomEvent('sm-focus', { bubbles: true, composed: true }));
  }

  #handleBlur() {
    this._hasFocus = false;
    this.dispatchEvent(new CustomEvent('sm-blur', { bubbles: true, composed: true }));
  }

  #handleClear() {
    this.value = '';
    this.#internals.setFormValue('');
    this.#inputEl?.focus();
    this.dispatchEvent(new CustomEvent('sm-clear', { bubbles: true, composed: true }));
    this.dispatchEvent(new CustomEvent('sm-input', { bubbles: true, composed: true }));
    this.dispatchEvent(new CustomEvent('sm-change', { bubbles: true, composed: true }));
  }

  #togglePasswordVisibility() {
    this._passwordVisible = !this._passwordVisible;
    this.#inputEl?.focus();
  }

  render() {
    const hasLabel = this.label || this.querySelector('[slot="label"]');
    const hasHelpText = this.helpText || this.querySelector('[slot="help-text"]');
    const showClear = this.clearable && this.value && !this.disabled && !this.readonly;
    const showPasswordToggle = this.type === 'password' && this.passwordToggle;
    const effectiveType = showPasswordToggle && this._passwordVisible ? 'text' : this.type;

    const wrapperClasses = {
      'input-wrapper': true,
      'input-wrapper--focused': this._hasFocus,
      'input-wrapper--disabled': this.disabled,
    };

    return html`
      <div class="form-control" part="form-control">
        ${hasLabel ? html`
          <label class="form-control__label" part="label">
            <slot name="label">${this.label}</slot>
            ${this.required ? html`<span class="required" aria-hidden="true">*</span>` : ''}
          </label>
        ` : ''}

        <div class=${classMap(wrapperClasses)} part="base">
          <span class="input__prefix" part="prefix">
            <slot name="prefix"></slot>
          </span>

          <input
            class="input__control"
            part="input"
            type=${effectiveType}
            name=${ifDefined(this.name)}
            .value=${this.value ?? ''}
            placeholder=${ifDefined(this.placeholder)}
            ?disabled=${this.disabled}
            ?readonly=${this.readonly}
            ?required=${this.required}
            minlength=${ifDefined(this.minlength)}
            maxlength=${ifDefined(this.maxlength)}
            min=${ifDefined(this.min)}
            max=${ifDefined(this.max)}
            step=${ifDefined(this.step)}
            autocomplete=${ifDefined(this.autocomplete)}
            pattern=${ifDefined(this.pattern)}
            @input=${this.#handleInput}
            @change=${this.#handleChange}
            @focus=${this.#handleFocus}
            @blur=${this.#handleBlur}
          />

          <span class="input__suffix" part="suffix">
            ${showClear ? html`
              <button
                class="input__icon-btn"
                type="button"
                aria-label="Clear"
                @click=${this.#handleClear}
              >${iconX()}</button>
            ` : ''}
            ${showPasswordToggle ? html`
              <button
                class="input__icon-btn"
                type="button"
                aria-label=${this._passwordVisible ? 'Hide password' : 'Show password'}
                @click=${this.#togglePasswordVisibility}
              >${this._passwordVisible ? iconEyeSlash() : iconEye()}</button>
            ` : ''}
            <slot name="suffix"></slot>
          </span>
        </div>

        ${hasHelpText ? html`
          <div class="form-control__help-text" part="help-text">
            <slot name="help-text">${this.helpText}</slot>
          </div>
        ` : ''}
      </div>
    `;
  }
}

customElements.define('sm-input', SmInput);
