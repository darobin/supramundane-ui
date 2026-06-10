
import { css, html } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { live } from 'lit/directives/live.js';
import { SupramundaneElement, FormControlController, HasSlotController, defaultValue } from '../core.js';
import { baseElement, formElement } from '../styles.js';
import { xCircleFill, eye, eyeSlash } from '../icons.js';
import './icon.js';

// XXX
// - render
// - style?

export default class Input extends SupramundaneElement {
  #formControlController = new FormControlController(this, { assumeInteractionOn: ['sm-blur', 'sm-input'] });
  #hasSlotController = new HasSlotController(this, 'help-text', 'label');

  static properties = {
    autocapitalize: { type: String },
    autocomplete: { type: String },
    autocorrect: { type: String },
    autofocus: { type: Boolean },
    clearable: { type: Boolean },
    disabled: { type: Boolean, reflect: true },
    enterkeyhint: { type: String },
    form: { reflect: true },
    hasFocus: { state: true },
    helpText: { type: String, attribute: 'help-text' },
    inputmode: { type: String },
    label: { type: String },
    max: {},
    min: {},
    maxlength: { type: Number },
    minlength: { type: Number },
    name: { type: String },
    noSpinButtons: { type: Boolean, attribute: 'no-spin-buttons' },
    pattern: { type: String },
    passwordToggle: { type: Boolean, attribute: 'password-toggle' },
    passwordVisible: { type: Boolean, attribute: 'password-visible' },
    placeholder: { type: String },
    readonly: { type: Boolean, reflect: true },
    required: { type: Boolean, reflect: true },
    size: { type: String, reflect: true },
    spellcheck: {
      type: Boolean,
      converter: {
        fromAttribute: value => (!value || value === 'false' ? false : true),
        toAttribute: value => (value ? 'true' : 'false'),
      },
    },
    step: { type: Number },
    title: { type: String },
    type: { type: String, reflect: true },
    value: { type: String },
  };

  get input() {
    return this.shadowRoot?.querySelector('.input__control');
  }

  #__numberInput = Object.assign(document.createElement('input'), { type: 'number' });
  #__dateInput = Object.assign(document.createElement('input'), { type: 'date' });

  static styles = [
    baseElement,
    formElement,
    css`
    :host {
      display: block;
    }

    .input {
      flex: 1 1 auto;
      display: inline-flex;
      align-items: stretch;
      justify-content: start;
      position: relative;
      width: 100%;
      font-family: var(--sm-input-font-family);
      font-weight: var(--sm-input-font-weight);
      letter-spacing: var(--sm-input-letter-spacing);
      vertical-align: middle;
      overflow: hidden;
      cursor: text;
      transition:
        var(--sm-transition-fast) color,
        var(--sm-transition-fast) border,
        var(--sm-transition-fast) box-shadow,
        var(--sm-transition-fast) background-color;
    }

    /* Standard inputs */
    .input--standard {
      background-color: var(--sm-input-background-color);
      border: solid var(--sm-input-border-width) var(--sm-input-border-color);
    }

    .input--standard:hover:not(.input--disabled) {
      background-color: var(--sm-input-background-color-hover);
      border-color: var(--sm-input-border-color-hover);
    }

    .input--standard.input--focused:not(.input--disabled) {
      background-color: var(--sm-input-background-color-focus);
      border-color: var(--sm-input-border-color-focus);
      box-shadow: 0 0 0 var(--sm-focus-ring-width) var(--sm-input-focus-ring-color);
    }

    .input--standard.input--focused:not(.input--disabled) .input__control {
      color: var(--sm-input-color-focus);
    }

    .input--standard.input--disabled {
      background-color: var(--sm-input-background-color-disabled);
      border-color: var(--sm-input-border-color-disabled);
      opacity: 0.5;
      cursor: not-allowed;
    }

    .input--standard.input--disabled .input__control {
      color: var(--sm-input-color-disabled);
    }

    .input--standard.input--disabled .input__control::placeholder {
      color: var(--sm-input-placeholder-color-disabled);
    }

    .input__control {
      flex: 1 1 auto;
      font-family: inherit;
      font-size: inherit;
      font-weight: inherit;
      min-width: 0;
      height: 100%;
      color: var(--sm-input-color);
      border: none;
      background: inherit;
      box-shadow: none;
      padding: 0;
      margin: 0;
      cursor: inherit;
      -webkit-appearance: none;
    }

    .input__control::-webkit-search-decoration,
    .input__control::-webkit-search-cancel-button,
    .input__control::-webkit-search-results-button,
    .input__control::-webkit-search-results-decoration {
      -webkit-appearance: none;
    }

    .input__control:-webkit-autofill,
    .input__control:-webkit-autofill:hover,
    .input__control:-webkit-autofill:focus,
    .input__control:-webkit-autofill:active {
      box-shadow: 0 0 0 var(--sm-input-height-large) var(--sm-input-background-color-hover) inset !important;
      -webkit-text-fill-color: var(--sm-color-primary-500);
      caret-color: var(--sm-input-color);
    }

    .input__control::placeholder {
      color: var(--sm-input-placeholder-color);
      user-select: none;
      -webkit-user-select: none;
    }

    .input:hover:not(.input--disabled) .input__control {
      color: var(--sm-input-color-hover);
    }

    .input__control:focus {
      outline: none;
    }

    .input__prefix,
    .input__suffix {
      display: inline-flex;
      flex: 0 0 auto;
      align-items: center;
      cursor: default;
    }

    .input__prefix ::slotted(sm-icon),
    .input__suffix ::slotted(sm-icon) {
      color: var(--sm-input-icon-color);
    }

    /*
    * Size modifiers
    */

    .input--small {
      border-radius: var(--sm-input-border-radius-small);
      font-size: var(--sm-input-font-size-small);
      height: var(--sm-input-height-small);
    }

    .input--small .input__control {
      height: calc(var(--sm-input-height-small) - var(--sm-input-border-width) * 2);
      padding: 0 var(--sm-input-spacing-small);
    }

    .input--small .input__clear,
    .input--small .input__password-toggle {
      width: calc(1em + var(--sm-input-spacing-small) * 2);
    }

    .input--small .input__prefix ::slotted(*) {
      margin-inline-start: var(--sm-input-spacing-small);
    }

    .input--small .input__suffix ::slotted(*) {
      margin-inline-end: var(--sm-input-spacing-small);
    }

    .input--medium {
      border-radius: var(--sm-input-border-radius-medium);
      font-size: var(--sm-input-font-size-medium);
      height: var(--sm-input-height-medium);
    }

    .input--medium .input__control {
      height: calc(var(--sm-input-height-medium) - var(--sm-input-border-width) * 2);
      padding: 0 var(--sm-input-spacing-medium);
    }

    .input--medium .input__clear,
    .input--medium .input__password-toggle {
      width: calc(1em + var(--sm-input-spacing-medium) * 2);
    }

    .input--medium .input__prefix ::slotted(*) {
      margin-inline-start: var(--sm-input-spacing-medium);
    }

    .input--medium .input__suffix ::slotted(*) {
      margin-inline-end: var(--sm-input-spacing-medium);
    }

    .input--large {
      border-radius: var(--sm-input-border-radius-large);
      font-size: var(--sm-input-font-size-large);
      height: var(--sm-input-height-large);
    }

    .input--large .input__control {
      height: calc(var(--sm-input-height-large) - var(--sm-input-border-width) * 2);
      padding: 0 var(--sm-input-spacing-large);
    }

    .input--large .input__clear,
    .input--large .input__password-toggle {
      width: calc(1em + var(--sm-input-spacing-large) * 2);
    }

    .input--large .input__prefix ::slotted(*) {
      margin-inline-start: var(--sm-input-spacing-large);
    }

    .input--large .input__suffix ::slotted(*) {
      margin-inline-end: var(--sm-input-spacing-large);
    }

    /*
    * Clearable + Password Toggle
    */

    .input__clear,
    .input__password-toggle {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: inherit;
      color: var(--sm-input-icon-color);
      border: none;
      background: none;
      padding: 0;
      transition: var(--sm-transition-fast) color;
      cursor: pointer;
    }

    .input__clear:hover,
    .input__password-toggle:hover {
      color: var(--sm-input-icon-color-hover);
    }

    .input__clear:focus,
    .input__password-toggle:focus {
      outline: none;
    }

    /* Don't show the browser's password toggle in Edge */
    ::-ms-reveal {
      display: none;
    }

    /* Hide the built-in number spinner */
    .input--no-spin-buttons input[type='number']::-webkit-outer-spin-button,
    .input--no-spin-buttons input[type='number']::-webkit-inner-spin-button {
      -webkit-appearance: none;
      display: none;
    }

    .input--no-spin-buttons input[type='number'] {
      -moz-appearance: textfield;
    }`
  ];

  constructor () {
    super();
    this.form = '';
    this.noSpinButtons = false;
    this.passwordToggle = false;
    this.passwordVisible = false;
    this.readonly = false;
    this.required = false;
    this.size = 'medium';
    this.spellcheck = true;
    this.type = 'text';
    defaultValue()(this, 'defaultValue');
    // XXX bring this back
    // watch('disabled', { waitUntilFirstUpdate: true })(this, 'handleDisabledChange');
    // watch('step', { waitUntilFirstUpdate: true })(this, 'handleStepChange');
    // watch('value', { waitUntilFirstUpdate: true })(this, 'handleValueChange');
  }
  get valueAsDate () {
    this.#__dateInput.type = this.type;
    this.#__dateInput.value = this.value;
    return this.input?.valueAsDate || this.#__dateInput.valueAsDate;
  }
  set valueAsDate (newValue) {
    this.#__dateInput.type = this.type;
    this.#__dateInput.valueAsDate = newValue;
    this.value = this.#__dateInput.value;
  }
  get valueAsNumber () {
    this.#__numberInput.value = this.value;
    return this.input?.valueAsNumber || this.#__numberInput.valueAsNumber;
  }
  set valueAsNumber (newValue) {
    this.#__numberInput.valueAsNumber = newValue;
    this.value = this.#__numberInput.value;
  }
  get validity () { return this.input?.validity; }
  get validationMessage () { return this.input?.validationMessage; }

  firstUpdated () {
    this.#formControlController.updateValidity();
  }
  #handleBlur () {
    this.hasFocus = false;
    this.emit('sm-blur');
  }
  #handleChange () {
    this.value = this.input?.value;
    this.emit('sm-change');
  }
  #handleClearClick (ev) {
    ev.preventDefault();
    if (this.value !== '') {
      this.value = '';
      this.emit('sm-clear');
      this.emit('sm-input');
      this.emit('sm-change');
    }
    this.input?.focus();
  }
  #handleFocus () {
    this.hasFocus = true;
    this.emit('s,-focus');
  }
  #handleInput () {
    this.value = this.input?.value;
    this.#formControlController.updateValidity();
    this.emit('sm-input');
  }
  #handleInvalid (ev) {
    this.#formControlController.setValidity(false);
    this.#formControlController.emitInvalidEvent(ev);
  }
  #handleKeyDown (ev) {
    const hasModifier = ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.altKey;
    // Pressing enter when focused on an input should submit the form like a native input, but we wait a tick before
    // submitting to allow users to cancel the keydown event if they need to
    if (ev.key === 'Enter' && !hasModifier) {
      setTimeout(() => {
        // When using an Input Method Editor (IME), pressing enter will cause the form to submit unexpectedly. One way
        // to check for this is to look at event.isComposing, which will be true when the IME is open.
        // See https://github.com/shoelace-style/shoelace/pull/988
        if (!ev.defaultPrevented && !ev.isComposing) this.#formControlController.submit();
      });
    }
  }
  #handlePasswordToggle () {
    this.passwordVisible = !this.passwordVisible;
  }
  handleDisabledChange () {
    // Disabled form controls are always valid
    this.#formControlController.setValidity(this.disabled);
  }
  handleStepChange () {
    // If step changes, the value may become invalid so we need to recheck after the update. We set the new step
    // imperatively so we don't have to wait for the next render to report the updated validity.
    if (this.input) this.input.step = String(this.step);
    this.#formControlController.updateValidity();
  }
  async handleValueChange () {
    await this.updateComplete;
    this.#formControlController.updateValidity();
  }

  focus (options) {
    this.input?.focus(options);
  }
  blur () {
    this.input?.blur();
  }
  select () {
    this.input?.select();
  }
  setSelectionRange(selectionStart, selectionEnd, selectionDirection ) {
    this.input?.setSelectionRange(selectionStart, selectionEnd, selectionDirection);
  }
  setRangeText (replacement, start, end, selectMode) {
    const selectionStart = start ?? this.input?.selectionStart;
    const selectionEnd = end ?? this.input?.selectionEnd;
    this.input?.setRangeText(replacement, selectionStart, selectionEnd, selectMode);
    if (this.value !== this.input?.value) this.value = this.input?.value;
  }
  showPicker () {
    if ('showPicker' in HTMLInputElement.prototype) this.input?.showPicker();
  }
  stepUp () {
    this.input?.stepUp();
    if (this.value !== this.input?.value) this.value = this.input?.value;
  }
  stepDown () {
    this.input?.stepDown();
    if (this.value !== this.input?.value) this.value = this.input?.value;
  }
  checkValidity () {
    return this.input?.checkValidity();
  }
  getForm () {
    return this.#formControlController.getForm();
  }
  reportValidity () {
    return this.input?.reportValidity();
  }
  setCustomValidity (message) {
    this.input?.setCustomValidity(message);
    this.#formControlController.updateValidity();
  }
  render () {
    const hasLabelSlot = this.#hasSlotController.test('label');
    const hasHelpTextSlot = this.#hasSlotController.test('help-text');
    const hasLabel = this.label ? true : !!hasLabelSlot;
    const hasHelpText = this.helpText ? true : !!hasHelpTextSlot;
    const hasClearIcon = this.clearable && !this.disabled && !this.readonly;
    const isClearIconVisible = hasClearIcon && (typeof this.value === 'number' || this.value.length > 0);

    return html`
      <div
        part="form-control"
        class=${classMap({
          'form-control': true,
          'form-control--small': this.size === 'small',
          'form-control--medium': this.size === 'medium',
          'form-control--large': this.size === 'large',
          'form-control--has-label': hasLabel,
          'form-control--has-help-text': hasHelpText
        })}
      >
        <label
          part="form-control-label"
          class="form-control__label"
          for="input"
          aria-hidden=${hasLabel ? 'false' : 'true'}
        >
          <slot name="label">${this.label}</slot>
        </label>

        <div part="form-control-input" class="form-control-input">
          <div
            part=${`base ${this.hasFocus ? 'focused' : ''} ${!this.value ? 'empty' : ''} ${this.disabled ? 'disabled' : ''}`}
            class=${classMap({
              input: true,
              // Sizes
              'input--small': this.size === 'small',
              'input--medium': this.size === 'medium',
              'input--large': this.size === 'large',
              // States
              'input--standard': true,
              'input--disabled': this.disabled,
              'input--focused': this.hasFocus,
              'input--empty': !this.value,
              'input--no-spin-buttons': this.noSpinButtons
            })}
          >
            <span part="prefix" class="input__prefix">
              <slot name="prefix"></slot>
            </span>
            <input
              part="input"
              id="input"
              class="input__control"
              type=${this.type === 'password' && this.passwordVisible ? 'text' : this.type}
              title=${this.title /* An empty title prevents browser validation tooltips from appearing on hover */}
              name=${ifDefined(this.name)}
              ?disabled=${this.disabled}
              ?readonly=${this.readonly}
              ?required=${this.required}
              placeholder=${ifDefined(this.placeholder)}
              minlength=${ifDefined(this.minlength)}
              maxlength=${ifDefined(this.maxlength)}
              min=${ifDefined(this.min)}
              max=${ifDefined(this.max)}
              step=${ifDefined(this.step)}
              .value=${live(this.value)}
              autocapitalize=${ifDefined(this.autocapitalize)}
              autocomplete=${ifDefined(this.autocomplete)}
              autocorrect=${ifDefined(this.autocorrect)}
              ?autofocus=${this.autofocus}
              spellcheck=${this.spellcheck}
              pattern=${ifDefined(this.pattern)}
              enterkeyhint=${ifDefined(this.enterkeyhint)}
              inputmode=${ifDefined(this.inputmode)}
              aria-describedby="help-text"
              @change=${this.#handleChange}
              @input=${this.#handleInput}
              @invalid=${this.#handleInvalid}
              @keydown=${this.#handleKeyDown}
              @focus=${this.#handleFocus}
              @blur=${this.#handleBlur}
            >
            ${isClearIconVisible
              ? html`
                  <button
                    part="clear-button"
                    class="input__clear"
                    type="button"
                    aria-label="Clear entry"
                    @click=${this.#handleClearClick}
                    tabindex="-1"
                  >
                    <slot name="clear-icon">
                      ${xCircleFill()}
                    </slot>
                  </button>
                `
              : ''}
            ${this.passwordToggle && !this.disabled
              ? html`
                  <button
                    part="password-toggle-button"
                    class="input__password-toggle"
                    type="button"
                    aria-label=${this.passwordVisible ? 'Hide password' : 'Show password'}
                    @click=${this.#handlePasswordToggle}
                    tabindex="-1"
                  >
                    ${this.passwordVisible
                      ? html`
                          <slot name="show-password-icon">
                            ${eyeSlash()}
                          </slot>
                        `
                      : html`
                          <slot name="hide-password-icon">
                            ${eye()}
                          </slot>
                        `}
                  </button>
                `
              : ''}

            <span part="suffix" class="input__suffix">
              <slot name="suffix"></slot>
            </span>
          </div>
        </div>
        <div
          part="form-control-help-text"
          id="help-text"
          class="form-control__help-text"
          aria-hidden=${hasHelpText ? 'false' : 'true'}
        >
          <slot name="help-text">${this.helpText}</slot>
        </div>
      </div>
    `;
  }
}

customElements.define('sm-input', Input);
