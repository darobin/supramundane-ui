
import { css } from 'lit';
import { html, literal } from 'lit/static-html.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { SupramundaneElement } from '../core.js';
import { hourglassSplit } from '../icons.js';
import './icon.js';

export class IconButton extends SupramundaneElement {
  static properties = {
    label: { type: String },
    variant: { type: String, reflect: true },
    size: { type: String, reflect: true },
    disabled: { type: Boolean, reflect: true },
    loading: { type: Boolean, reflect: true },
    href: { type: String },
    target: { type: String },
    download: { type: String },
    hasFocus: { state: true },
  };

  static styles = css`
    :host {
      display: inline-block;
      position: relative;
      cursor: auto;
      user-select: none;
    }

    :host([disabled]),
    :host([loading]) {
      cursor: not-allowed;
    }

    .button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-style: none;
      border-width: var(--sm-input-border-width);
      border-radius: var(--sm-border-radius-circle);
      aspect-ratio: 1;
      padding: 0em;
      font-family: var(--sm-input-font-family);
      font-size: inherit;
      text-decoration: none;
      user-select: none;
      vertical-align: middle;
      transition:
        var(--sm-transition-medium) background-color,
        var(--sm-transition-medium) color,
        var(--sm-transition-medium) border-color,
        var(--sm-transition-medium) box-shadow;
      -webkit-appearance: none;
    }

    .button:focus-visible:hover:not(.button--disabled) {
      outline: var(--sm-focus-ring);
      outline-offset: var(--sm-focus-ring-offset);
    }

    .button--small {
      width: 1.5em;
      height: 1.5em;
      font-size: var(--sm-button-font-size-small);
      /*padding: 0.2em;*/
    }
    .button--medium {
      width: var(--sm-input-height-medium);
      font-size: var(--sm-button-font-size-medium);
    }
    .button--large {
      width: var(--sm-input-height-large);
      font-size: var(--sm-button-font-size-large);
    }

    .button__spinner {
      pointer-events: none;
    }

    .button--default {
      background-color: var(--sm-color-neutral-0);
      border-color: var(--sm-color-neutral-300);
      color: var(--sm-color-neutral-700);
    }
    .button--default:hover:not(.button--disabled) {
      background-color: var(--sm-color-neutral-50);
      color: var(--sm-color-neutral-1000);
    }
    .button--default:active:not(.button--disabled) {
      background-color: var(--sm-color-accent-100);
      border-color: var(--sm-color-accent-400);
      color: var(--sm-color-accent-700);
    }

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

    .button__spinner {
      position: absolute;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 1em;
      height: 1em;
      animation: spin 0.75s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `;

  constructor() {
    super();
    this.variant = 'default';
    this.size = 'medium';
    this.disabled = false;
    this.loading = false;
  }

  get button () {
    return this.querySelector('.button');
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
          })}
          type=${ifDefined(isLink ? undefined : 'button')}
          href=${ifDefined(isLink ? this.href : undefined)}
          target=${ifDefined(isLink ? this.target : undefined)}
          download=${ifDefined(isLink ? this.download : undefined)}
          rel=${ifDefined(isLink && this.target ? 'noreferrer noopener' : undefined)}
          role=${ifDefined(isLink ? undefined : 'button')}
          aria-label=${ifDefined(this.label)}
          ?disabled=${ifDefined(isLink ? undefined : this.disabled)}
          aria-disabled=${isDisabled ? 'true' : 'false'}
          tabindex=${this.disabled ? '-1' : '0'}
          @click=${this.#handleClick}
          @blur=${this.#handleBlur}
          @focus=${this.#handleFocus}
        >
          ${this.loading ? hourglassSplit() : html`<slot></slot>`}
        </${tag}>
      `;
  }
}

customElements.define('sm-icon-button', IconButton);
