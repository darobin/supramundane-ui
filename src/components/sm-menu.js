
import { LitElement, html, css } from 'lit';

export class SmMenu extends LitElement {
  static properties = {};

  static styles = css`
    :host {
      display: block;
    }

    .menu {
      background: var(--sm-panel-background-color);
      border: var(--sm-panel-border-width) solid var(--sm-panel-border-color);
      border-radius: var(--sm-border-radius-medium);
      box-shadow: var(--sm-shadow-medium);
      padding: var(--sm-spacing-2x-small);
      min-width: 10rem;
    }
  `;

  #getItems() {
    return [...this.querySelectorAll('sm-menu-item')].filter(item => !item.disabled);
  }

  #focusItem(item) {
    if (item) item.focus();
  }

  #handleKeyDown(e) {
    const items = this.#getItems();
    if (!items.length) return;

    const focused = this.shadowRoot?.activeElement || document.activeElement;
    const currentIndex = items.indexOf(focused);

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (currentIndex < items.length - 1) {
          this.#focusItem(items[currentIndex + 1]);
        } else {
          this.#focusItem(items[0]);
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (currentIndex > 0) {
          this.#focusItem(items[currentIndex - 1]);
        } else {
          this.#focusItem(items[items.length - 1]);
        }
        break;
      case 'Home':
        e.preventDefault();
        this.#focusItem(items[0]);
        break;
      case 'End':
        e.preventDefault();
        this.#focusItem(items[items.length - 1]);
        break;
      case 'Enter':
        // Let the focused item handle Enter natively
        break;
    }
  }

  #handleSmSelect(e) {
    // Re-dispatch the event from this element so consumers can listen on sm-menu
    this.dispatchEvent(new CustomEvent('sm-select', {
      detail: e.detail,
      bubbles: true,
      composed: true,
    }));
  }

  render() {
    return html`
      <div
        class="menu"
        role="menu"
        @keydown=${this.#handleKeyDown}
        @sm-select=${this.#handleSmSelect}
      >
        <slot></slot>
      </div>
    `;
  }
}

customElements.define('sm-menu', SmMenu);
