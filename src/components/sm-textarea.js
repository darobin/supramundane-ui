
import { LitElement, html, css } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';

export class SmTextarea extends LitElement {
  static formAssociated = true;

  static properties = {
    name: { type: String },
    value: { type: String },
    rows: { type: Number },
    resize: { type: String },
    disabled: { type: Boolean, reflect: true },
    readonly: { type: Boolean, reflect: true },
    required: { type: Boolean, reflect: true },
    placeholder: { type: String },
    label: { type: String },
    helpText: { type: String, attribute: 'help-text' },
    minlength: { type: Number },
    maxlength: { type: Number },
    autocomplete: { type: String },
    size: { type: String, reflect: true },
    filled: { type: Boolean, reflect: true },
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

    /* Textarea wrapper */
    .textarea-wrapper {
      display: flex;
      background-color: var(--sm-input-background-color);
      border: var(--sm-input-border-width) solid var(--sm-input-border-color);
      border-radius: var(--sm-input-border-radius-medium);
      color: var(--sm-input-color);
      transition:
        var(--sm-transition-fast) background-color,
        var(--sm-transition-fast) border-color,
        var(--sm-transition-fast) box-shadow;
      font-size: var(--sm-input-font-size-medium);
    }

    :host([size='small']) .textarea-wrapper {
      font-size: var(--sm-input-font-size-small);
      border-radius: var(--sm-input-border-radius-small);
    }
    :host([size='large']) .textarea-wrapper {
      font-size: var(--sm-input-font-size-large);
      border-radius: var(--sm-input-border-radius-large);
    }

    :host([filled]) .textarea-wrapper {
      background-color: var(--sm-input-filled-background-color);
      border-color: transparent;
      color: var(--sm-input-filled-color);
    }

    .textarea-wrapper:hover:not(.textarea-wrapper--disabled) {
      border-color: var(--sm-input-border-color-hover);
    }
    :host([filled]) .textarea-wrapper:hover:not(.textarea-wrapper--disabled) {
      background-color: var(--sm-input-filled-background-color-hover);
    }

    .textarea-wrapper--focused {
      border-color: var(--sm-input-border-color-focus);
      box-shadow: 0 0 0 var(--sm-focus-ring-width) var(--sm-input-focus-ring-color);
    }
    :host([filled]) .textarea-wrapper--focused {
      background-color: var(--sm-input-filled-background-color-focus);
    }

    .textarea-wrapper--disabled {
      background-color: var(--sm-input-background-color-disabled);
      border-color: var(--sm-input-border-color-disabled);
      color: var(--sm-input-color-disabled);
      cursor: not-allowed;
      opacity: 0.5;
    }
    :host([filled]) .textarea-wrapper--disabled {
      background-color: var(--sm-input-filled-background-color-disabled);
    }

    /* Native textarea */
    .textarea__control {
      flex: 1 1 auto;
      width: 100%;
      min-width: 0;
      background: none;
      border: none;
      outline: none;
      padding: var(--sm-input-spacing-medium);
      color: inherit;
      font-family: var(--sm-input-font-family);
      font-size: inherit;
      font-weight: var(--sm-input-font-weight);
      letter-spacing: var(--sm-input-letter-spacing);
      line-height: var(--sm-line-height-normal);
      resize: vertical;
    }

    :host([size='small']) .textarea__control {
      padding: var(--sm-input-spacing-small);
    }
    :host([size='large']) .textarea__control {
      padding: var(--sm-input-spacing-large);
    }

    .textarea__control::placeholder {
      color: var(--sm-input-placeholder-color);
    }

    .textarea__control:disabled {
      cursor: not-allowed;
    }

    .textarea__control--resize-none {
      resize: none;
    }
    .textarea__control--resize-vertical {
      resize: vertical;
    }
    .textarea__control--resize-auto {
      resize: none;
      overflow: hidden;
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
  #hasFocus = false;

  constructor() {
    super();
    this.#internals = this.attachInternals();
    this.value = '';
    this.rows = 4;
    this.resize = 'vertical';
    this.disabled = false;
    this.readonly = false;
    this.required = false;
    this.size = 'medium';
    this.filled = false;
    this._hasFocus = false;
  }

  get #textareaEl() {
    return this.shadowRoot?.querySelector('.textarea__control');
  }

  #handleInput(e) {
    this.value = e.target.value;
    this.#internals.setFormValue(this.value);
    if (this.resize === 'auto') {
      const ta = e.target;
      ta.style.height = 'auto';
      ta.style.height = `${ta.scrollHeight}px`;
    }
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

  render() {
    const hasLabel = this.label || this.querySelector('[slot="label"]');
    const hasHelpText = this.helpText || this.querySelector('[slot="help-text"]');

    const wrapperClasses = {
      'textarea-wrapper': true,
      'textarea-wrapper--focused': this._hasFocus,
      'textarea-wrapper--disabled': this.disabled,
    };

    const controlClasses = {
      'textarea__control': true,
      'textarea__control--resize-none': this.resize === 'none',
      'textarea__control--resize-vertical': this.resize === 'vertical',
      'textarea__control--resize-auto': this.resize === 'auto',
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
          <textarea
            class=${classMap(controlClasses)}
            part="textarea"
            name=${ifDefined(this.name)}
            .value=${this.value ?? ''}
            rows=${this.rows}
            placeholder=${ifDefined(this.placeholder)}
            ?disabled=${this.disabled}
            ?readonly=${this.readonly}
            ?required=${this.required}
            minlength=${ifDefined(this.minlength)}
            maxlength=${ifDefined(this.maxlength)}
            autocomplete=${ifDefined(this.autocomplete)}
            @input=${this.#handleInput}
            @change=${this.#handleChange}
            @focus=${this.#handleFocus}
            @blur=${this.#handleBlur}
          ></textarea>
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

customElements.define('sm-textarea', SmTextarea);
