
import { LitElement, html, css } from 'lit';

export class SmDropdown extends LitElement {
  static properties = {
    open: { type: Boolean, reflect: true },
    placement: { type: String },
    distance: { type: Number },
    disabled: { type: Boolean, reflect: true },
    stayOpenOnSelect: { type: Boolean, attribute: 'stay-open-on-select' },
  };

  static styles = css`
    :host {
      display: inline-block;
      position: relative;
    }

    .dropdown__trigger {
      display: contents;
    }

    .dropdown__panel {
      position: fixed;
      z-index: var(--sm-z-index-dropdown);
      background: var(--sm-panel-background-color);
      border: var(--sm-panel-border-width) solid var(--sm-panel-border-color);
      border-radius: var(--sm-border-radius-medium);
      box-shadow: var(--sm-shadow-medium);
      display: none;
    }

    .dropdown__panel[data-open] {
      display: block;
    }
  `;

  #panelId = `sm-dropdown-panel-${Math.random().toString(36).slice(2)}`;
  #handleDocumentClick = this.#onDocumentClick.bind(this);
  #handleDocumentKeyDown = this.#onDocumentKeyDown.bind(this);

  constructor() {
    super();
    this.open = false;
    this.placement = 'bottom-start';
    this.distance = 4;
    this.disabled = false;
    this.stayOpenOnSelect = false;
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.#removeListeners();
  }

  #addListeners() {
    document.addEventListener('click', this.#handleDocumentClick, true);
    document.addEventListener('keydown', this.#handleDocumentKeyDown);
  }

  #removeListeners() {
    document.removeEventListener('click', this.#handleDocumentClick, true);
    document.removeEventListener('keydown', this.#handleDocumentKeyDown);
  }

  #onDocumentClick(e) {
    if (!this.open) return;
    const path = e.composedPath();
    if (!path.includes(this)) {
      this.#hide();
    }
  }

  #onDocumentKeyDown(e) {
    if (e.key === 'Escape' && this.open) {
      this.#hide();
      // Return focus to trigger
      const trigger = this.shadowRoot?.querySelector('.dropdown__trigger');
      const triggerEl = trigger?.querySelector('*') ?? this;
      triggerEl?.focus?.();
    }
  }

  #getPanel() {
    return this.shadowRoot?.querySelector('.dropdown__panel');
  }

  #getTrigger() {
    return this.shadowRoot?.querySelector('.dropdown__trigger');
  }

  #computePosition() {
    const trigger = this.#getTrigger();
    const panel = this.#getPanel();
    if (!trigger || !panel) return;

    const slot = trigger.querySelector('slot');
    const assignedElements = slot?.assignedElements({ flatten: true });
    const triggerEl = assignedElements?.[0] ?? trigger;
    const triggerRect = triggerEl.getBoundingClientRect();
    const panelRect = panel.getBoundingClientRect();
    const dist = this.distance;

    let top = 0;
    let left = 0;

    switch (this.placement) {
      case 'bottom':
        top = triggerRect.bottom + dist;
        left = triggerRect.left + triggerRect.width / 2 - panelRect.width / 2;
        break;
      case 'bottom-end':
        top = triggerRect.bottom + dist;
        left = triggerRect.right - panelRect.width;
        break;
      case 'top':
        top = triggerRect.top - panelRect.height - dist;
        left = triggerRect.left + triggerRect.width / 2 - panelRect.width / 2;
        break;
      case 'top-start':
        top = triggerRect.top - panelRect.height - dist;
        left = triggerRect.left;
        break;
      case 'top-end':
        top = triggerRect.top - panelRect.height - dist;
        left = triggerRect.right - panelRect.width;
        break;
      case 'left':
        top = triggerRect.top + triggerRect.height / 2 - panelRect.height / 2;
        left = triggerRect.left - panelRect.width - dist;
        break;
      case 'right':
        top = triggerRect.top + triggerRect.height / 2 - panelRect.height / 2;
        left = triggerRect.right + dist;
        break;
      case 'bottom-start':
      default:
        top = triggerRect.bottom + dist;
        left = triggerRect.left;
        break;
    }

    // Clamp to viewport
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    left = Math.max(8, Math.min(left, vw - panelRect.width - 8));
    top = Math.max(8, Math.min(top, vh - panelRect.height - 8));

    panel.style.top = `${top}px`;
    panel.style.left = `${left}px`;
  }

  async #show() {
    if (this.disabled || this.open) return;
    this.open = true;
    const panel = this.#getPanel();
    if (panel) panel.setAttribute('data-open', '');
    await this.updateComplete;
    this.#computePosition();
    this.#addListeners();
    this.dispatchEvent(new CustomEvent('sm-show', { bubbles: true, composed: true }));
  }

  #hide() {
    if (!this.open) return;
    this.open = false;
    const panel = this.#getPanel();
    if (panel) panel.removeAttribute('data-open');
    this.#removeListeners();
    this.dispatchEvent(new CustomEvent('sm-hide', { bubbles: true, composed: true }));
  }

  #handleTriggerClick() {
    if (this.disabled) return;
    if (this.open) {
      this.#hide();
    } else {
      this.#show();
    }
  }

  #handleSmSelect() {
    if (!this.stayOpenOnSelect) {
      this.#hide();
    }
  }

  render() {
    return html`
      <div class="dropdown__trigger" @click=${this.#handleTriggerClick}>
        <slot name="trigger"></slot>
      </div>
      <div
        class="dropdown__panel"
        id=${this.#panelId}
        role="presentation"
        @sm-select=${this.#handleSmSelect}
      >
        <slot></slot>
      </div>
    `;
  }
}

customElements.define('sm-dropdown', SmDropdown);
