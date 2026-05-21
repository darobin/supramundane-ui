
import { LitElement, html, css } from 'lit';

export class SmOption extends LitElement {
  static properties = {
    value: { type: String },
    disabled: { type: Boolean, reflect: true },
    selected: { type: Boolean, reflect: true },
  };

  static styles = css`
    :host {
      display: block;
    }

    :host([disabled]) {
      opacity: 0.5;
      pointer-events: none;
    }

    .option {
      display: block;
      padding: var(--sm-spacing-x-small) var(--sm-spacing-medium);
      cursor: pointer;
      font-family: var(--sm-input-font-family);
      font-size: var(--sm-font-size-small);
      color: var(--sm-color-neutral-800);
      transition:
        var(--sm-transition-fast) background-color,
        var(--sm-transition-fast) color;
      outline: none;
      user-select: none;
    }

    .option:hover:not([aria-disabled='true']) {
      background-color: var(--sm-color-neutral-100);
    }

    .option:focus-visible {
      background-color: var(--sm-color-neutral-100);
      outline: var(--sm-focus-ring);
      outline-offset: -2px;
    }

    :host([selected]) .option {
      background-color: var(--sm-color-accent-50);
      color: var(--sm-color-accent-700);
    }

    :host([selected]) .option:hover {
      background-color: var(--sm-color-accent-100);
    }
  `;

  constructor() {
    super();
    this.value = '';
    this.disabled = false;
    this.selected = false;
  }

  #handleClick() {
    if (this.disabled) return;
    this.dispatchEvent(new CustomEvent('sm-option-select', {
      detail: {
        value: this.value,
        label: this.textContent?.trim() ?? '',
      },
      bubbles: true,
      composed: true,
    }));
  }

  #handleKeyDown(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this.#handleClick();
    }
  }

  render() {
    return html`
      <div
        class="option"
        role="option"
        aria-selected=${this.selected ? 'true' : 'false'}
        aria-disabled=${this.disabled ? 'true' : 'false'}
        tabindex=${this.disabled ? '-1' : '0'}
        @click=${this.#handleClick}
        @keydown=${this.#handleKeyDown}
      >
        <slot></slot>
      </div>
    `;
  }
}

customElements.define('sm-option', SmOption);
