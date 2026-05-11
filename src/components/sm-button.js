
import { LitElement, html, css } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { iconSpinner } from '../icons/index.js';

export class SmButton extends LitElement {
  static properties = {
    variant: { type: String, reflect: true },
    size: { type: String, reflect: true },
    outline: { type: Boolean, reflect: true },
    pill: { type: Boolean, reflect: true },
    circle: { type: Boolean, reflect: true },
    disabled: { type: Boolean, reflect: true },
    loading: { type: Boolean, reflect: true },
    href: { type: String },
    target: { type: String },
    download: { type: String },
    type: { type: String },
    name: { type: String },
    value: { type: String },
    form: { type: String },
  };

  static styles = css`
    :host {
      display: inline-block;
      position: relative;
      width: auto;
      cursor: auto;
    }

    :host([disabled]),
    :host([loading]) {
      cursor: not-allowed;
    }

    .button {
      display: inline-flex;
      align-items: stretch;
      justify-content: center;
      width: 100%;
      border-style: solid;
      border-width: var(--sm-input-border-width);
      font-family: var(--sm-input-font-family);
      font-weight: var(--sm-font-weight-semibold);
      text-decoration: none;
      user-select: none;
      white-space: nowrap;
      vertical-align: middle;
      padding: 0;
      transition:
        var(--sm-transition-fast) background-color,
        var(--sm-transition-fast) color,
        var(--sm-transition-fast) border-color,
        var(--sm-transition-fast) box-shadow;
      cursor: pointer;
      -webkit-appearance: none;
    }

    .button:focus-visible {
      outline: var(--sm-focus-ring);
      outline-offset: var(--sm-focus-ring-offset);
    }

    /* ---- Sizes ---- */

    .button--small {
      height: var(--sm-input-height-small);
      border-radius: var(--sm-input-border-radius-small);
      font-size: var(--sm-button-font-size-small);
      gap: var(--sm-spacing-2x-small);
    }

    .button--medium {
      height: var(--sm-input-height-medium);
      border-radius: var(--sm-input-border-radius-medium);
      font-size: var(--sm-button-font-size-medium);
      gap: var(--sm-spacing-x-small);
    }

    .button--large {
      height: var(--sm-input-height-large);
      border-radius: var(--sm-input-border-radius-large);
      font-size: var(--sm-button-font-size-large);
      gap: var(--sm-spacing-x-small);
    }

    /* ---- Pill & Circle ---- */

    .button--pill {
      border-radius: var(--sm-border-radius-pill);
    }

    .button--circle {
      border-radius: var(--sm-border-radius-circle);
      aspect-ratio: 1;
    }

    /* ---- Inner layout ---- */

    .button__label {
      display: inline-flex;
      align-items: center;
      line-height: 1;
    }

    .button__prefix,
    .button__suffix {
      flex: 0 0 auto;
      display: inline-flex;
      align-items: center;
    }

    /* Padding: applied to inner elements so prefix/suffix sit flush */
    .button--small .button__label { padding: 0 var(--sm-spacing-small); }
    .button--small .button__prefix { padding-inline-start: var(--sm-spacing-small); }
    .button--small .button__suffix { padding-inline-end: var(--sm-spacing-small); }
    .button--small .button__prefix ~ .button__label { padding-inline-start: var(--sm-spacing-2x-small); }
    .button--small .button__label:has(~ .button__suffix) { padding-inline-end: var(--sm-spacing-2x-small); }

    .button--medium .button__label { padding: 0 var(--sm-spacing-medium); }
    .button--medium .button__prefix { padding-inline-start: var(--sm-spacing-medium); }
    .button--medium .button__suffix { padding-inline-end: var(--sm-spacing-medium); }
    .button--medium .button__prefix ~ .button__label { padding-inline-start: var(--sm-spacing-x-small); }
    .button--medium .button__label:has(~ .button__suffix) { padding-inline-end: var(--sm-spacing-x-small); }

    .button--large .button__label { padding: 0 var(--sm-spacing-large); }
    .button--large .button__prefix { padding-inline-start: var(--sm-spacing-large); }
    .button--large .button__suffix { padding-inline-end: var(--sm-spacing-large); }
    .button--large .button__prefix ~ .button__label { padding-inline-start: var(--sm-spacing-small); }
    .button--large .button__label:has(~ .button__suffix) { padding-inline-end: var(--sm-spacing-small); }

    /* Circle: center content, no padding */
    .button--circle .button__label { padding: 0; }

    /* ---- Icon sizing inside buttons ---- */

    .button__prefix ::slotted(svg),
    .button__suffix ::slotted(svg),
    .button__label ::slotted(svg) {
      width: 1em;
      height: 1em;
    }

    /* ---- Variants ---- */

    /* Default */
    .button--default {
      background-color: var(--sm-color-neutral-0);
      border-color: var(--sm-color-neutral-300);
      color: var(--sm-color-neutral-700);
    }
    .button--default:hover:not(.button--disabled) {
      background-color: var(--sm-color-primary-50);
      border-color: var(--sm-color-primary-300);
      color: var(--sm-color-primary-700);
    }
    .button--default:active:not(.button--disabled) {
      background-color: var(--sm-color-primary-100);
      border-color: var(--sm-color-primary-400);
      color: var(--sm-color-primary-700);
    }

    /* Primary */
    .button--primary {
      background-color: var(--sm-color-primary-600);
      border-color: var(--sm-color-primary-600);
      color: #fff;
    }
    .button--primary:hover:not(.button--disabled) {
      background-color: var(--sm-color-primary-500);
      border-color: var(--sm-color-primary-500);
      color: #fff;
    }
    .button--primary:active:not(.button--disabled) {
      background-color: var(--sm-color-primary-700);
      border-color: var(--sm-color-primary-700);
      color: #fff;
    }

    /* Success */
    .button--success {
      background-color: var(--sm-color-success-600);
      border-color: var(--sm-color-success-600);
      color: #fff;
    }
    .button--success:hover:not(.button--disabled) {
      background-color: var(--sm-color-success-500);
      border-color: var(--sm-color-success-500);
      color: #fff;
    }
    .button--success:active:not(.button--disabled) {
      background-color: var(--sm-color-success-700);
      border-color: var(--sm-color-success-700);
      color: #fff;
    }

    /* Neutral */
    .button--neutral {
      background-color: var(--sm-color-neutral-600);
      border-color: var(--sm-color-neutral-600);
      color: #fff;
    }
    .button--neutral:hover:not(.button--disabled) {
      background-color: var(--sm-color-neutral-500);
      border-color: var(--sm-color-neutral-500);
      color: #fff;
    }
    .button--neutral:active:not(.button--disabled) {
      background-color: var(--sm-color-neutral-700);
      border-color: var(--sm-color-neutral-700);
      color: #fff;
    }

    /* Warning */
    .button--warning {
      background-color: var(--sm-color-warning-600);
      border-color: var(--sm-color-warning-600);
      color: #fff;
    }
    .button--warning:hover:not(.button--disabled) {
      background-color: var(--sm-color-warning-500);
      border-color: var(--sm-color-warning-500);
      color: #fff;
    }
    .button--warning:active:not(.button--disabled) {
      background-color: var(--sm-color-warning-700);
      border-color: var(--sm-color-warning-700);
      color: #fff;
    }

    /* Danger */
    .button--danger {
      background-color: var(--sm-color-danger-600);
      border-color: var(--sm-color-danger-600);
      color: #fff;
    }
    .button--danger:hover:not(.button--disabled) {
      background-color: var(--sm-color-danger-500);
      border-color: var(--sm-color-danger-500);
      color: #fff;
    }
    .button--danger:active:not(.button--disabled) {
      background-color: var(--sm-color-danger-700);
      border-color: var(--sm-color-danger-700);
      color: #fff;
    }

    /* Text */
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
    .button--text:active:not(.button--disabled) {
      background-color: transparent;
      border-color: transparent;
      color: var(--sm-color-primary-700);
    }

    /* ---- Outline modifier ---- */

    .button--outline.button--primary {
      background-color: transparent;
      border-color: var(--sm-color-primary-600);
      color: var(--sm-color-primary-600);
    }
    .button--outline.button--primary:hover:not(.button--disabled) {
      background-color: var(--sm-color-primary-600);
      border-color: var(--sm-color-primary-600);
      color: #fff;
    }
    .button--outline.button--primary:active:not(.button--disabled) {
      background-color: var(--sm-color-primary-700);
      border-color: var(--sm-color-primary-700);
      color: #fff;
    }

    .button--outline.button--success {
      background-color: transparent;
      border-color: var(--sm-color-success-600);
      color: var(--sm-color-success-600);
    }
    .button--outline.button--success:hover:not(.button--disabled) {
      background-color: var(--sm-color-success-600);
      border-color: var(--sm-color-success-600);
      color: #fff;
    }
    .button--outline.button--success:active:not(.button--disabled) {
      background-color: var(--sm-color-success-700);
      border-color: var(--sm-color-success-700);
      color: #fff;
    }

    .button--outline.button--neutral {
      background-color: transparent;
      border-color: var(--sm-color-neutral-600);
      color: var(--sm-color-neutral-600);
    }
    .button--outline.button--neutral:hover:not(.button--disabled) {
      background-color: var(--sm-color-neutral-600);
      border-color: var(--sm-color-neutral-600);
      color: #fff;
    }
    .button--outline.button--neutral:active:not(.button--disabled) {
      background-color: var(--sm-color-neutral-700);
      border-color: var(--sm-color-neutral-700);
      color: #fff;
    }

    .button--outline.button--warning {
      background-color: transparent;
      border-color: var(--sm-color-warning-600);
      color: var(--sm-color-warning-600);
    }
    .button--outline.button--warning:hover:not(.button--disabled) {
      background-color: var(--sm-color-warning-600);
      border-color: var(--sm-color-warning-600);
      color: #fff;
    }
    .button--outline.button--warning:active:not(.button--disabled) {
      background-color: var(--sm-color-warning-700);
      border-color: var(--sm-color-warning-700);
      color: #fff;
    }

    .button--outline.button--danger {
      background-color: transparent;
      border-color: var(--sm-color-danger-600);
      color: var(--sm-color-danger-600);
    }
    .button--outline.button--danger:hover:not(.button--disabled) {
      background-color: var(--sm-color-danger-600);
      border-color: var(--sm-color-danger-600);
      color: #fff;
    }
    .button--outline.button--danger:active:not(.button--disabled) {
      background-color: var(--sm-color-danger-700);
      border-color: var(--sm-color-danger-700);
      color: #fff;
    }

    /* ---- Disabled state ---- */

    .button--disabled {
      opacity: 0.5;
      cursor: not-allowed;
      pointer-events: none;
    }

    /* ---- Loading state ---- */

    .button--loading {
      position: relative;
      cursor: wait;
    }

    .button--loading .button__label,
    .button--loading .button__prefix,
    .button--loading .button__suffix {
      visibility: hidden;
    }

    .button__spinner {
      position: absolute;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 1em;
      height: 1em;
      animation: spin 0.75s linear infinite;
    }

    .button__spinner svg {
      width: 1em;
      height: 1em;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `;

  constructor() {
    super();
    this.variant = 'default';
    this.size = 'medium';
    this.outline = false;
    this.pill = false;
    this.circle = false;
    this.disabled = false;
    this.loading = false;
    this.type = 'button';
  }

  #handleClick(e) {
    if (this.disabled || this.loading) {
      e.preventDefault();
      e.stopImmediatePropagation();
    }
  }

  #renderInner() {
    return html`
      <slot name="prefix" part="prefix" class="button__prefix"></slot>
      <slot part="label" class="button__label"></slot>
      <slot name="suffix" part="suffix" class="button__suffix"></slot>
      ${this.loading ? html`<span class="button__spinner" aria-hidden="true">${iconSpinner}</span>` : ''}
    `;
  }

  render() {
    const isLink = !!this.href;
    const isDisabled = this.disabled || this.loading;

    const classes = {
      button: true,
      [`button--${this.variant}`]: true,
      [`button--${this.size}`]: true,
      'button--outline': this.outline,
      'button--pill': this.pill,
      'button--circle': this.circle,
      'button--disabled': isDisabled,
      'button--loading': this.loading,
    };

    return isLink
      ? html`
          <a
            part="base"
            class=${classMap(classes)}
            href=${ifDefined(this.disabled ? undefined : this.href)}
            target=${ifDefined(this.target)}
            download=${ifDefined(this.download)}
            aria-disabled=${isDisabled ? 'true' : 'false'}
            tabindex=${this.disabled ? '-1' : '0'}
            @click=${this.#handleClick}
          >
            ${this.#renderInner()}
          </a>
        `
      : html`
          <button
            part="base"
            class=${classMap(classes)}
            type=${ifDefined(this.type)}
            name=${ifDefined(this.name)}
            value=${ifDefined(this.value)}
            form=${ifDefined(this.form)}
            ?disabled=${isDisabled}
            aria-disabled=${isDisabled ? 'true' : 'false'}
            @click=${this.#handleClick}
          >
            ${this.#renderInner()}
          </button>
        `;
  }
}

customElements.define('sm-button', SmButton);
