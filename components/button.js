
import { css } from 'lit';
import { html, literal } from 'lit/static-html.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { SupramundaneElement, FormControlController, HasSlotController, validValidityState } from '../core.js';
import { baseElement } from '../styles.js';
import { hourglassSplit, caretDown } from '../icons.js';
import './icon.js';

export class Button extends SupramundaneElement {
  #formControlController = new FormControlController(this, { assumeInteractionOn: ['click'] });
  #hasSlotController = new HasSlotController(this, '[default]', 'prefix', 'suffix');

  static properties = {
    label: { type: String },
    variant: { type: String, reflect: true },
    size: { type: String, reflect: true },
    caret: { type: Boolean, reflect: true },
    disabled: { type: Boolean, reflect: true },
    outline: { type: Boolean, reflect: true },
    loading: { type: Boolean, reflect: true },
    href: { type: String },
    target: { type: String },
    name: { type: String },
    value: { type: String },
    form: { type: String },
    formAction: { type: String, attribute: 'formaction' },
    formEnctype: { type: String, attribute: 'formenctype' },
    formMethod: { type: String, attribute: 'formmethod' },
    formTarget: { type: String, attribute: 'formtarget' },
    formNoValidate: { type: Boolean, attribute: 'formnovalidate' },
    type: { type: String },
    download: { type: String },
    hasFocus: { state: true },
    invalid: { state: true },
  };

  static styles = [
    baseElement,
    css`
    :host {
      display: inline-block;
      position: relative;
      cursor: pointer;
      user-select: none;
      -webkit-user-select: none;
    }

    :host([disabled]),
    :host([loading]) {
      cursor: not-allowed;
    }

    .button {
      display: inline-flex;
      align-items: stretch;
      justify-content: center;
      border-style: solid;
      border-width: var(--sm-input-border-width);
      padding: 0;
      font-family: var(--sm-input-font-family);
      font-weight: var(--sm-font-weight-semibold);
      text-decoration: none;
      user-select: none;
      -webkit-user-select: none;
      vertical-align: middle;
      transition:
        var(--sm-transition-medium) background-color,
        var(--sm-transition-medium) color,
        var(--sm-transition-medium) border-color,
        var(--sm-transition-medium) box-shadow;
      cursor: inherit;
    }
    .button::-moz-focus-inner {
      border: 0;
    }
    .button:focus {
      outline: none;
    }
    .button:focus-visible {
      outline: var(--sm-focus-ring);
      outline-offset: var(--sm-focus-ring-offset);
    }
    .button:focus-visible:hover:not(.button--disabled) {
      outline: var(--sm-focus-ring);
      outline-offset: var(--sm-focus-ring-offset);
    }
    .button--disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .button--disabled * {
      pointer-events: none;
    }
    .button__prefix,
    .button__suffix {
      flex: 0 0 auto;
      display: flex;
      align-items: center;
      pointer-events: none;
    }
    .button__label {
      display: inline-block;
    }
    .button__label::slotted(sm-icon) {
      vertical-align: -2px;
    }

  /* Default */
  .button--standard.button--default {
    background-color: var(--sm-color-neutral-0);
    border-color: var(--sm-input-border-color);
    color: var(--sm-color-neutral-700);
  }

  .button--standard.button--default:hover:not(.button--disabled) {
    background-color: var(--sm-color-primary-50);
    border-color: var(--sm-color-primary-300);
    color: var(--sm-color-primary-700);
  }

  .button--standard.button--default:active:not(.button--disabled) {
    background-color: var(--sm-color-primary-100);
    border-color: var(--sm-color-primary-400);
    color: var(--sm-color-primary-700);
  }

  /* Primary */
  .button--standard.button--primary {
    background-color: var(--sm-color-primary-600);
    border-color: var(--sm-color-primary-600);
    color: var(--sm-color-neutral-0);
  }

  .button--standard.button--primary:hover:not(.button--disabled) {
    background-color: var(--sm-color-primary-500);
    border-color: var(--sm-color-primary-500);
    color: var(--sm-color-neutral-0);
  }

  .button--standard.button--primary:active:not(.button--disabled) {
    background-color: var(--sm-color-primary-600);
    border-color: var(--sm-color-primary-600);
    color: var(--sm-color-neutral-0);
  }

  /* Success */
  .button--standard.button--success {
    background-color: var(--sm-color-success-600);
    border-color: var(--sm-color-success-600);
    color: var(--sm-color-neutral-0);
  }

  .button--standard.button--success:hover:not(.button--disabled) {
    background-color: var(--sm-color-success-500);
    border-color: var(--sm-color-success-500);
    color: var(--sm-color-neutral-0);
  }

  .button--standard.button--success:active:not(.button--disabled) {
    background-color: var(--sm-color-success-600);
    border-color: var(--sm-color-success-600);
    color: var(--sm-color-neutral-0);
  }

  /* Neutral */
  .button--standard.button--neutral {
    background-color: var(--sm-color-neutral-600);
    border-color: var(--sm-color-neutral-600);
    color: var(--sm-color-neutral-0);
  }

  .button--standard.button--neutral:hover:not(.button--disabled) {
    background-color: var(--sm-color-neutral-500);
    border-color: var(--sm-color-neutral-500);
    color: var(--sm-color-neutral-0);
  }

  .button--standard.button--neutral:active:not(.button--disabled) {
    background-color: var(--sm-color-neutral-600);
    border-color: var(--sm-color-neutral-600);
    color: var(--sm-color-neutral-0);
  }

  /* Warning */
  .button--standard.button--warning {
    background-color: var(--sm-color-warning-600);
    border-color: var(--sm-color-warning-600);
    color: var(--sm-color-neutral-0);
  }
  .button--standard.button--warning:hover:not(.button--disabled) {
    background-color: var(--sm-color-warning-500);
    border-color: var(--sm-color-warning-500);
    color: var(--sm-color-neutral-0);
  }

  .button--standard.button--warning:active:not(.button--disabled) {
    background-color: var(--sm-color-warning-600);
    border-color: var(--sm-color-warning-600);
    color: var(--sm-color-neutral-0);
  }

  /* Danger */
  .button--standard.button--danger {
    background-color: var(--sm-color-danger-600);
    border-color: var(--sm-color-danger-600);
    color: var(--sm-color-neutral-0);
  }

  .button--standard.button--danger:hover:not(.button--disabled) {
    background-color: var(--sm-color-danger-500);
    border-color: var(--sm-color-danger-500);
    color: var(--sm-color-neutral-0);
  }

  .button--standard.button--danger:active:not(.button--disabled) {
    background-color: var(--sm-color-danger-600);
    border-color: var(--sm-color-danger-600);
    color: var(--sm-color-neutral-0);
  }

  /*
   * Outline buttons
   */

  .button--outline {
    background: none;
    border: solid 1px;
  }

  /* Default */
  .button--outline.button--default {
    border-color: var(--sm-input-border-color);
    color: var(--sm-color-neutral-700);
  }

  .button--outline.button--default:hover:not(.button--disabled),
  .button--outline.button--default.button--checked:not(.button--disabled) {
    border-color: var(--sm-color-primary-600);
    background-color: var(--sm-color-primary-600);
    color: var(--sm-color-neutral-0);
  }

  .button--outline.button--default:active:not(.button--disabled) {
    border-color: var(--sm-color-primary-700);
    background-color: var(--sm-color-primary-700);
    color: var(--sm-color-neutral-0);
  }

  /* Primary */
  .button--outline.button--primary {
    border-color: var(--sm-color-primary-600);
    color: var(--sm-color-primary-600);
  }

  .button--outline.button--primary:hover:not(.button--disabled),
  .button--outline.button--primary.button--checked:not(.button--disabled) {
    background-color: var(--sm-color-primary-600);
    color: var(--sm-color-neutral-0);
  }

  .button--outline.button--primary:active:not(.button--disabled) {
    border-color: var(--sm-color-primary-700);
    background-color: var(--sm-color-primary-700);
    color: var(--sm-color-neutral-0);
  }

  /* Success */
  .button--outline.button--success {
    border-color: var(--sm-color-success-600);
    color: var(--sm-color-success-600);
  }

  .button--outline.button--success:hover:not(.button--disabled),
  .button--outline.button--success.button--checked:not(.button--disabled) {
    background-color: var(--sm-color-success-600);
    color: var(--sm-color-neutral-0);
  }

  .button--outline.button--success:active:not(.button--disabled) {
    border-color: var(--sm-color-success-700);
    background-color: var(--sm-color-success-700);
    color: var(--sm-color-neutral-0);
  }

  /* Neutral */
  .button--outline.button--neutral {
    border-color: var(--sm-color-neutral-600);
    color: var(--sm-color-neutral-600);
  }

  .button--outline.button--neutral:hover:not(.button--disabled),
  .button--outline.button--neutral.button--checked:not(.button--disabled) {
    background-color: var(--sm-color-neutral-600);
    color: var(--sm-color-neutral-0);
  }

  .button--outline.button--neutral:active:not(.button--disabled) {
    border-color: var(--sm-color-neutral-700);
    background-color: var(--sm-color-neutral-700);
    color: var(--sm-color-neutral-0);
  }

  /* Warning */
  .button--outline.button--warning {
    border-color: var(--sm-color-warning-600);
    color: var(--sm-color-warning-600);
  }

  .button--outline.button--warning:hover:not(.button--disabled),
  .button--outline.button--warning.button--checked:not(.button--disabled) {
    background-color: var(--sm-color-warning-600);
    color: var(--sm-color-neutral-0);
  }

  .button--outline.button--warning:active:not(.button--disabled) {
    border-color: var(--sm-color-warning-700);
    background-color: var(--sm-color-warning-700);
    color: var(--sm-color-neutral-0);
  }

  /* Danger */
  .button--outline.button--danger {
    border-color: var(--sm-color-danger-600);
    color: var(--sm-color-danger-600);
  }

  .button--outline.button--danger:hover:not(.button--disabled),
  .button--outline.button--danger.button--checked:not(.button--disabled) {
    background-color: var(--sm-color-danger-600);
    color: var(--sm-color-neutral-0);
  }

  .button--outline.button--danger:active:not(.button--disabled) {
    border-color: var(--sm-color-danger-700);
    background-color: var(--sm-color-danger-700);
    color: var(--sm-color-neutral-0);
  }

  @media (forced-colors: active) {
    .button.button--outline.button--checked:not(.button--disabled) {
      outline: solid 2px transparent;
    }
  }

  /*
   * Text buttons
   */

  .button--text {
    background-color: transparent;
    border-color: transparent;
    color: var(--sm-color-primary-600);
  }

  .button--text:hover:not(.button--disabled) {
    background-color: transparent;
    border-color: transparent;
    color: var(--sm-color-primary-500);
  }

  .button--text:focus-visible:not(.button--disabled) {
    background-color: transparent;
    border-color: transparent;
    color: var(--sm-color-primary-500);
  }

  .button--text:active:not(.button--disabled) {
    background-color: transparent;
    border-color: transparent;
    color: var(--sm-color-primary-700);
  }

  /*
   * Size modifiers
   */

  .button--small {
    height: auto;
    min-height: var(--sm-input-height-small);
    font-size: var(--sm-button-font-size-small);
    line-height: calc(var(--sm-input-height-small) - var(--sm-input-border-width) * 2);
    border-radius: var(--sm-input-border-radius-small);
  }

  .button--medium {
    height: auto;
    min-height: var(--sm-input-height-medium);
    font-size: var(--sm-button-font-size-medium);
    line-height: calc(var(--sm-input-height-medium) - var(--sm-input-border-width) * 2);
    border-radius: var(--sm-input-border-radius-medium);
  }

  .button--large {
    height: auto;
    min-height: var(--sm-input-height-large);
    font-size: var(--sm-button-font-size-large);
    line-height: calc(var(--sm-input-height-large) - var(--sm-input-border-width) * 2);
    border-radius: var(--sm-input-border-radius-large);
  }

  .button--caret .button__suffix {
    display: none;
  }

  .button--caret .button__caret {
    height: auto;
  }












    .button__spinner {
      pointer-events: none;
      position: absolute;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 1em;
      height: 1em;
      animation: spin 0.75s linear infinite;
    }
    .button--loading {
      position: relative;
      cursor: wait;
    }

    .button--loading .button__prefix,
    .button--loading .button__label,
    .button--loading .button__suffix,
    .button--loading .button__caret {
      visibility: hidden;
    }
    .button--disabled {
      opacity: 0.5;
      cursor: not-allowed;
      pointer-events: none;
    }
    .button--loading {
      cursor: wait;
    }
    .button--loading ::slotted(*) {
      visibility: hidden;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .button--has-label.button--small .button__label {
      padding: 0 var(--sm-spacing-small);
    }

    .button--has-label.button--medium .button__label {
      padding: 0 var(--sm-spacing-medium);
    }

    .button--has-label.button--large .button__label {
      padding: 0 var(--sm-spacing-large);
    }

    .button--has-prefix.button--small {
      padding-inline-start: var(--sm-spacing-x-small);
    }

    .button--has-prefix.button--small .button__label {
      padding-inline-start: var(--sm-spacing-x-small);
    }

    .button--has-prefix.button--medium {
      padding-inline-start: var(--sm-spacing-small);
    }

    .button--has-prefix.button--medium .button__label {
      padding-inline-start: var(--sm-spacing-small);
    }

    .button--has-prefix.button--large {
      padding-inline-start: var(--sm-spacing-small);
    }

    .button--has-prefix.button--large .button__label {
      padding-inline-start: var(--sm-spacing-small);
    }

    .button--has-suffix.button--small,
    .button--caret.button--small {
      padding-inline-end: var(--sm-spacing-x-small);
    }

    .button--has-suffix.button--small .button__label,
    .button--caret.button--small .button__label {
      padding-inline-end: var(--sm-spacing-x-small);
    }

    .button--has-suffix.button--medium,
    .button--caret.button--medium {
      padding-inline-end: var(--sm-spacing-small);
    }

    .button--has-suffix.button--medium .button__label,
    .button--caret.button--medium .button__label {
      padding-inline-end: var(--sm-spacing-small);
    }

    .button--has-suffix.button--large,
    .button--caret.button--large {
      padding-inline-end: var(--sm-spacing-small);
    }

    .button--has-suffix.button--large .button__label,
    .button--caret.button--large .button__label {
      padding-inline-end: var(--sm-spacing-small);
    }


  `];

  constructor() {
    super();
    this.variant = 'default';
    this.size = 'medium';
    this.caret = false;
    this.type = 'button';
    this.disabled = false;
    this.loading = false;
    this.invalid = false;
    this.outline = false;
    // XXX
    // watch('disabled', { waitUntilFirstUpdate: true })(this, 'handleDisabledChange');
  }

  get button () {
    return this.shadowRoot?.querySelector('.button');
  }
  #isButton () {
    return this.href ? false : true;
  }
  #isLink () {
    return this.href ? true : false;
  }
  get validity () {
    if (this.#isButton()) return (this.button).validity;
    return validValidityState;
  }
  get validationMessage () {
    if (this.#isButton()) return (this.button).validationMessage;
    return '';
  }

  #handleBlur () {
    this.hasFocus = false;
    this.emit('sm-blur');
  }
  #handleFocus () {
    this.hasFocus = true;
    this.emit('sm-focus');
  }
  #handleClick (e) {
    if (this.disabled || this.loading) {
      e.preventDefault();
      e.stopImmediatePropagation();
    }
    if (this.type === 'submit') this.#formControlController.submit(this);
    if (this.type === 'reset') this.#formControlController.reset(this);
  }
  click () {
    this.button.click();
  }
  focus (options) {
    this.button.focus(options);
  }
  blur () {
    this.button.blur();
  }
  #handleInvalid (ev) {
    this.#formControlController.setValidity(false);
    this.#formControlController.emitInvalidEvent(ev);
  }
  handleDisabledChange () {
    if (this.#isButton()) this.#formControlController.setValidity(this.disabled);
  }
  checkValidity () {
    if (this.#isButton()) return (this.button).checkValidity();
    return true;
  }
  getForm () {
    return this.#formControlController.getForm();
  }
  reportValidity () {
    if (this.#isButton()) return this.button.reportValidity();
    return true;
  }
  setCustomValidity (message) {
    if (this.#isButton()) {
      this.button.setCustomValidity(message);
      this.#formControlController.updateValidity();
    }
  }

  firstUpdated () {
    if (this.#isButton()) this.#formControlController.updateValidity();
  }
  render () {
    const isLink = !!this.href;
    const isDisabled = this.disabled || this.loading;
    const tag = isLink ? literal`a` : literal`button`;

    return html`
        <${tag}
          part="base"
          class=${classMap({
            button: true,
            [`button--${this.variant}`]: true,
            [`button--${this.size}`]: true,
            'button--disabled': isDisabled,
            'button--loading': this.loading,
            'button--caret': this.caret,
            'button--focused': this.hasFocus,
            'button--standard': !this.outline,
            'button--outline': this.outline,
            'button--has-label': this.#hasSlotController.test('[default]'),
            'button--has-prefix': this.#hasSlotController.test('prefix'),
            'button--has-suffix': this.#hasSlotController.test('suffix')
          })}
          type=${ifDefined(isLink ? undefined : 'button')}
          title=${this.title /* An empty title prevents browser validation tooltips from appearing on hover */}
          name=${ifDefined(isLink ? undefined : this.name)}
          value=${ifDefined(isLink ? undefined : this.value)}
          href=${ifDefined(isLink ? this.href : undefined)}
          target=${ifDefined(isLink ? this.target : undefined)}
          download=${ifDefined(isLink ? this.download : undefined)}
          rel=${ifDefined(isLink && this.target ? 'noreferrer noopener' : undefined)}
          role=${ifDefined(isLink ? undefined : 'button')}
          ?disabled=${ifDefined(isLink ? undefined : this.disabled)}
          aria-disabled=${isDisabled ? 'true' : 'false'}
          tabindex=${this.disabled ? '-1' : '0'}
          @click=${this.#handleClick}
          @blur=${this.#handleBlur}
          @focus=${this.#handleFocus}
          @invalid=${this.#isButton() ? this.#handleInvalid : null}
        >
          <slot name="prefix" part="prefix" class="button__prefix"></slot>
          <slot part="label" class="button__label"></slot>
          <slot name="suffix" part="suffix" class="button__suffix"></slot>
          ${
            this.caret ? html` <sm-icon part="caret" class="button__caret">${caretDown()}</sm-icon> ` : ''
          }
          ${this.loading ? hourglassSplit() : html`<slot></slot>`}
        </${tag}>
      `;
  }
}

customElements.define('sm-button', Button);
