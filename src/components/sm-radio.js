
import { LitElement, html, css } from 'lit';

export class SmRadio extends LitElement {
  static formAssociated = true;

  static properties = {
    name: { type: String },
    value: { type: String },
    checked: { type: Boolean, reflect: true },
    disabled: { type: Boolean, reflect: true },
    size: { type: String, reflect: true },
  };

  static styles = css`
    :host {
      display: inline-flex;
      align-items: flex-start;
      font-family: var(--sm-input-font-family);
      color: var(--sm-input-color);
      cursor: pointer;
    }

    :host([disabled]) {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .radio__label {
      display: inline-flex;
      align-items: center;
      gap: var(--sm-spacing-x-small);
      cursor: pointer;
      user-select: none;
      font-size: var(--sm-font-size-small);
    }

    :host([disabled]) .radio__label {
      cursor: not-allowed;
      pointer-events: none;
    }

    /* Hide native input */
    .radio__input {
      position: absolute;
      opacity: 0;
      width: 0;
      height: 0;
      margin: 0;
      padding: 0;
    }

    /* Custom circle */
    .radio__control {
      flex: 0 0 auto;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: var(--sm-toggle-size-medium);
      height: var(--sm-toggle-size-medium);
      border: var(--sm-input-border-width) solid var(--sm-input-border-color);
      border-radius: var(--sm-border-radius-circle);
      background-color: var(--sm-input-background-color);
      transition:
        var(--sm-transition-fast) background-color,
        var(--sm-transition-fast) border-color,
        var(--sm-transition-fast) box-shadow;
    }

    .radio__label:hover:not([disabled]) .radio__control {
      border-color: var(--sm-input-border-color-hover);
    }

    .radio__input:focus-visible ~ .radio__control {
      outline: var(--sm-focus-ring);
      outline-offset: var(--sm-focus-ring-offset);
    }

    /* Checked state */
    :host([checked]) .radio__control {
      border-color: var(--sm-color-accent-600);
    }

    /* Inner dot */
    .radio__dot {
      width: 40%;
      height: 40%;
      border-radius: var(--sm-border-radius-circle);
      background-color: transparent;
      transition: var(--sm-transition-fast) background-color;
    }

    :host([checked]) .radio__dot {
      background-color: var(--sm-color-accent-600);
    }

    /* Sizes */
    :host([size='small']) .radio__control {
      width: var(--sm-toggle-size-small);
      height: var(--sm-toggle-size-small);
    }
    :host([size='small']) .radio__label {
      font-size: var(--sm-font-size-x-small);
    }

    :host([size='medium']) .radio__control {
      width: var(--sm-toggle-size-medium);
      height: var(--sm-toggle-size-medium);
    }
    :host([size='medium']) .radio__label {
      font-size: var(--sm-font-size-small);
    }

    :host([size='large']) .radio__control {
      width: var(--sm-toggle-size-large);
      height: var(--sm-toggle-size-large);
    }
    :host([size='large']) .radio__label {
      font-size: var(--sm-font-size-medium);
    }
  `;

  #internals;

  constructor() {
    super();
    this.#internals = this.attachInternals();
    this.value = 'on';
    this.checked = false;
    this.disabled = false;
    this.size = 'medium';
  }

  #handleClick() {
    if (this.disabled) return;
    this.checked = true;
    this.#internals.setFormValue(this.checked ? this.value : null);
    this.dispatchEvent(new CustomEvent('sm-change', { bubbles: true, composed: true }));
  }

  #handleKeyDown(e) {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      this.#handleClick();
    }
  }

  render() {
    return html`
      <label class="radio__label" part="base" @click=${this.#handleClick}>
        <input
          class="radio__input"
          type="radio"
          .checked=${this.checked}
          ?disabled=${this.disabled}
          name=${this.name ?? ''}
          value=${this.value}
          @change=${() => {}}
        />
        <span class="radio__control" part="control" aria-hidden="true">
          <span class="radio__dot"></span>
        </span>
        <span class="radio__label-text" part="label">
          <slot></slot>
        </span>
      </label>
    `;
  }
}

customElements.define('sm-radio', SmRadio);
