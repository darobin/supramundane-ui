
import { LitElement, html, css } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { iconSpinner } from '../icons.js';

export class SmIconButton extends LitElement {
  static properties = {
    label: { type: String },
    variant: { type: String, reflect: true },
    size: { type: String, reflect: true },
    disabled: { type: Boolean, reflect: true },
    loading: { type: Boolean, reflect: true },
    href: { type: String },
    target: { type: String },
    download: { type: String },
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
      padding: 0;
      font-family: var(--sm-input-font-family);
      text-decoration: none;
      user-select: none;
      vertical-align: middle;
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
      width: var(--sm-input-height-small);
      font-size: var(--sm-button-font-size-small);
    }

    .button--medium {
      width: var(--sm-input-height-medium);
      font-size: var(--sm-button-font-size-medium);
    }

    .button--large {
      width: var(--sm-input-height-large);
      font-size: var(--sm-button-font-size-large);
    }

    ::slotted(svg),
    .button__spinner svg {
      width: 1em;
      height: 1em;
      pointer-events: none;
      padding: 0.5em;
    }

    /* ---- Variants ---- */

    .button--default {
      background-color: var(--sm-color-neutral-0);
      border-color: var(--sm-color-neutral-300);
      color: var(--sm-color-neutral-700);
    }
    .button--default:hover:not(.button--disabled) {
      background-color: var(--sm-color-accent-50);
      border-color: var(--sm-color-accent-300);
      color: var(--sm-color-accent-700);
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

    .button--text {
      background-color: transparent;
      border-color: transparent;
      color: var(--sm-color-accent-600);
    }
    .button--text:hover:not(.button--disabled) {
      background-color: transparent;
      border-color: transparent;
      color: var(--sm-color-accent-500);
    }
    .button--text:active:not(.button--disabled) {
      background-color: transparent;
      border-color: transparent;
      color: var(--sm-color-accent-700);
    }

    /* ---- Disabled state ---- */

    .button--disabled {
      opacity: 0.5;
      cursor: not-allowed;
      pointer-events: none;
    }

    /* ---- Loading state ---- */

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

  #handleClick(e) {
    if (this.disabled || this.loading) {
      e.preventDefault();
      e.stopImmediatePropagation();
    }
  }

  #renderInner() {
    return html`
      <slot></slot>
      ${this.loading ? html`<span class="button__spinner" aria-hidden="true">${iconSpinner()}</span>` : ''}
    `;
  }

  render() {
    const isLink = !!this.href;
    const isDisabled = this.disabled || this.loading;

    const classes = {
      button: true,
      [`button--${this.variant}`]: true,
      [`button--${this.size}`]: true,
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
            aria-label=${ifDefined(this.label)}
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
            aria-label=${ifDefined(this.label)}
            ?disabled=${isDisabled}
            aria-disabled=${isDisabled ? 'true' : 'false'}
            @click=${this.#handleClick}
          >
            ${this.#renderInner()}
          </button>
        `;
  }
}

customElements.define('sm-icon-button', SmIconButton);
