
import { LitElement, html, css } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { iconX } from '../icons.js';

export class SmTag extends LitElement {
  static properties = {
    variant: { type: String, reflect: true },
    size: { type: String, reflect: true },
    removable: { type: Boolean, reflect: true },
    pill: { type: Boolean, reflect: true },
  };

  static styles = css`
    :host {
      display: inline-flex;
    }

    .tag {
      display: inline-flex;
      align-items: center;
      border-style: solid;
      border-width: 1px;
      white-space: nowrap;
      font-family: var(--sm-font-sans);
      user-select: none;
      gap: var(--sm-spacing-3x-small);
    }

    /* ---- Sizes ---- */

    .tag--small {
      font-size: var(--sm-font-size-x-small);
      padding: var(--sm-spacing-3x-small) var(--sm-spacing-x-small);
      border-radius: var(--sm-border-radius-small);
    }

    .tag--medium {
      font-size: var(--sm-font-size-small);
      padding: var(--sm-spacing-2x-small) var(--sm-spacing-small);
      border-radius: var(--sm-border-radius-small);
    }

    .tag--large {
      font-size: var(--sm-font-size-medium);
      padding: var(--sm-spacing-x-small) var(--sm-spacing-medium);
      border-radius: var(--sm-border-radius-small);
    }

    /* ---- Pill ---- */

    .tag--pill {
      border-radius: var(--sm-border-radius-pill);
    }

    /* ---- Variants ---- */

    .tag--default {
      background-color: var(--sm-color-neutral-100);
      border-color: var(--sm-color-neutral-400);
      color: var(--sm-color-neutral-700);
    }

    .tag--primary {
      background-color: var(--sm-color-primary-100);
      border-color: var(--sm-color-primary-400);
      color: var(--sm-color-primary-700);
    }

    .tag--success {
      background-color: var(--sm-color-success-100);
      border-color: var(--sm-color-success-400);
      color: var(--sm-color-success-700);
    }

    .tag--warning {
      background-color: var(--sm-color-warning-100);
      border-color: var(--sm-color-warning-400);
      color: var(--sm-color-warning-700);
    }

    .tag--danger {
      background-color: var(--sm-color-danger-100);
      border-color: var(--sm-color-danger-400);
      color: var(--sm-color-danger-700);
    }

    .tag--neutral {
      background-color: var(--sm-color-neutral-100);
      border-color: var(--sm-color-neutral-400);
      color: var(--sm-color-neutral-700);
    }

    /* ---- Remove button ---- */

    .tag__remove {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: none;
      border: none;
      padding: 0;
      margin: 0;
      cursor: pointer;
      color: inherit;
      opacity: 0.7;
      line-height: 1;
    }

    .tag__remove:hover {
      opacity: 1;
    }

    .tag__remove:focus-visible {
      outline: var(--sm-focus-ring);
      outline-offset: var(--sm-focus-ring-offset);
      border-radius: 2px;
    }

    .tag__remove svg {
      width: 0.75em;
      height: 0.75em;
    }
  `;

  constructor() {
    super();
    this.variant = 'default';
    this.size = 'medium';
    this.removable = false;
    this.pill = false;
  }

  #handleRemove() {
    const event = new CustomEvent('sm-remove', {
      bubbles: true,
      composed: true,
      cancelable: true,
    });
    this.dispatchEvent(event);
  }

  render() {
    const classes = {
      tag: true,
      [`tag--${this.variant}`]: true,
      [`tag--${this.size}`]: true,
      'tag--pill': this.pill,
    };

    return html`
      <span part="base" class=${classMap(classes)}>
        <slot name="prefix" part="prefix"></slot>
        <slot part="label"></slot>
        ${this.removable
          ? html`
              <button
                part="remove-button"
                class="tag__remove"
                aria-label="Remove"
                @click=${this.#handleRemove}
              >
                ${iconX()}
              </button>
            `
          : ''}
      </span>
    `;
  }
}

customElements.define('sm-tag', SmTag);
