
import { LitElement, html, css } from 'lit';
import { iconCopy } from '../icons/index.js';

export class SmCopyButton extends LitElement {
  static properties = {
    value: { type: String },
    label: { type: String },
    successLabel: { type: String, attribute: 'success-label' },
    errorLabel: { type: String, attribute: 'error-label' },
    feedbackDuration: { type: Number, attribute: 'feedback-duration' },
    _status: { type: String, state: true },
  };

  static styles = css`
    :host {
      display: inline-block;
    }

    .copy-button {
      display: inline-flex;
      align-items: center;
      gap: var(--sm-spacing-x-small);
      padding: 0 var(--sm-spacing-medium);
      height: var(--sm-input-height-medium);
      background-color: var(--sm-color-neutral-0);
      border: var(--sm-input-border-width) solid var(--sm-color-neutral-300);
      border-radius: var(--sm-input-border-radius-medium);
      color: var(--sm-color-neutral-700);
      font-family: var(--sm-input-font-family);
      font-size: var(--sm-font-size-small);
      font-weight: var(--sm-font-weight-semibold);
      cursor: pointer;
      user-select: none;
      white-space: nowrap;
      transition:
        var(--sm-transition-fast) background-color,
        var(--sm-transition-fast) color,
        var(--sm-transition-fast) border-color;
    }

    .copy-button:hover {
      background-color: var(--sm-color-primary-50);
      border-color: var(--sm-color-primary-300);
      color: var(--sm-color-primary-700);
    }

    .copy-button:focus-visible {
      outline: var(--sm-focus-ring);
      outline-offset: var(--sm-focus-ring-offset);
    }

    .copy-button--success {
      color: var(--sm-color-success-600);
      border-color: var(--sm-color-success-400);
      background-color: var(--sm-color-success-50);
    }

    .copy-button--error {
      color: var(--sm-color-danger-600);
      border-color: var(--sm-color-danger-400);
      background-color: var(--sm-color-danger-50);
    }

    .copy-button__icon {
      display: inline-flex;
      align-items: center;
      flex: 0 0 auto;
    }

    .copy-button__icon svg {
      width: 1em;
      height: 1em;
    }
  `;

  constructor() {
    super();
    this.value = '';
    this.label = 'Copy';
    this.successLabel = 'Copied!';
    this.errorLabel = 'Error';
    this.feedbackDuration = 1000;
    this._status = 'idle';
  }

  #resetTimer = null;

  async #handleClick() {
    if (this.#resetTimer) {
      clearTimeout(this.#resetTimer);
    }

    try {
      await navigator.clipboard.writeText(this.value);
      this._status = 'success';
      this.dispatchEvent(new CustomEvent('sm-copy', { bubbles: true, composed: true }));
    } catch {
      this._status = 'error';
      this.dispatchEvent(new CustomEvent('sm-error', { bubbles: true, composed: true }));
    }

    this.#resetTimer = setTimeout(() => {
      this._status = 'idle';
      this.#resetTimer = null;
    }, this.feedbackDuration);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.#resetTimer) {
      clearTimeout(this.#resetTimer);
    }
  }

  render() {
    const currentLabel =
      this._status === 'success'
        ? this.successLabel
        : this._status === 'error'
          ? this.errorLabel
          : this.label;

    return html`
      <button
        part="button"
        class="copy-button ${this._status !== 'idle' ? `copy-button--${this._status}` : ''}"
        aria-label=${currentLabel}
        @click=${this.#handleClick}
      >
        <span class="copy-button__icon" aria-hidden="true">${iconCopy()}</span>
        <span class="copy-button__label">${currentLabel}</span>
      </button>
    `;
  }
}

customElements.define('sm-copy-button', SmCopyButton);
