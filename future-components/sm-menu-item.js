
import { LitElement, html, css } from 'lit';
import { iconCheck } from '../icons.js';

export class SmMenuItem extends LitElement {
  static properties = {
    value: { type: String },
    type: { type: String },
    checked: { type: Boolean, reflect: true },
    disabled: { type: Boolean, reflect: true },
  };

  static styles = css`
    :host {
      display: block;
    }

    :host([disabled]) {
      opacity: 0.5;
      pointer-events: none;
    }

    .menu-item {
      display: flex;
      align-items: center;
      gap: var(--sm-spacing-x-small);
      padding: var(--sm-spacing-x-small) var(--sm-spacing-medium);
      border-radius: var(--sm-border-radius-small);
      cursor: pointer;
      font-family: var(--sm-input-font-family);
      font-size: var(--sm-font-size-small);
      color: var(--sm-color-neutral-800);
      transition: var(--sm-transition-fast) background-color;
      outline: none;
      user-select: none;
    }

    .menu-item:hover {
      background-color: var(--sm-color-neutral-100);
    }

    .menu-item:focus-visible {
      background-color: var(--sm-color-neutral-100);
      outline: var(--sm-focus-ring);
      outline-offset: -2px;
    }

    .menu-item__check {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 1em;
      height: 1em;
      flex-shrink: 0;
    }

    .menu-item__check svg {
      width: 1em;
      height: 1em;
    }

    .menu-item__prefix {
      display: inline-flex;
      align-items: center;
    }

    .menu-item__label {
      flex: 1;
    }

    .menu-item__suffix {
      display: inline-flex;
      align-items: center;
      margin-inline-start: auto;
      color: var(--sm-color-neutral-500);
    }
  `;

  constructor() {
    super();
    this.value = '';
    this.type = 'normal';
    this.checked = false;
    this.disabled = false;
  }

  #getRole() {
    if (this.type === 'checkbox') return 'menuitemcheckbox';
    if (this.type === 'radio') return 'menuitemradio';
    return 'menuitem';
  }

  #handleClick() {
    if (this.disabled) return;
    if (this.type === 'checkbox') {
      this.checked = !this.checked;
    } else if (this.type === 'radio') {
      this.checked = true;
    }
    this.dispatchEvent(new CustomEvent('sm-select', {
      detail: { item: this, value: this.value },
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
    const showCheckArea = this.type === 'checkbox' || this.type === 'radio';
    const role = this.#getRole();

    return html`
      <div
        class="menu-item"
        role=${role}
        aria-checked=${showCheckArea ? (this.checked ? 'true' : 'false') : undefined}
        aria-disabled=${this.disabled ? 'true' : 'false'}
        tabindex=${this.disabled ? '-1' : '0'}
        @click=${this.#handleClick}
        @keydown=${this.#handleKeyDown}
      >
        ${showCheckArea ? html`
          <span class="menu-item__check">
            ${this.checked ? iconCheck() : ''}
          </span>
        ` : ''}
        <span class="menu-item__prefix">
          <slot name="prefix"></slot>
        </span>
        <span class="menu-item__label">
          <slot></slot>
        </span>
        <span class="menu-item__suffix">
          <slot name="suffix"></slot>
        </span>
        <slot name="submenu"></slot>
      </div>
    `;
  }

  focus(options) {
    this.shadowRoot?.querySelector('.menu-item')?.focus(options);
  }
}

customElements.define('sm-menu-item', SmMenuItem);
