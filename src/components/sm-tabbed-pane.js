
import { LitElement, html, css, nothing } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { iconX } from '../icons/index.js';

export class SmTabbedPane extends LitElement {
  static properties = {
    closable: { type: Boolean, reflect: true },
    _panels: { state: true },
  };

  #observer = null;

  static styles = css`
    :host {
      display: block;
    }

    .tabbed-pane__nav {
      display: flex;
      align-items: flex-end;
      border-bottom: 1px solid var(--sm-panel-border-color);
      overflow-x: auto;
      scrollbar-width: none;
    }

    .tabbed-pane__nav::-webkit-scrollbar {
      display: none;
    }

    .tabbed-pane__body {
      background: var(--sm-panel-background-color);
      border: 1px solid var(--sm-panel-border-color);
      border-top: none;
      border-radius: 0 0 var(--sm-border-radius-medium) var(--sm-border-radius-medium);
    }

    .tab {
      display: inline-flex;
      align-items: center;
      gap: var(--sm-spacing-2x-small);
      padding: var(--sm-spacing-x-small) var(--sm-spacing-medium);
      border: none;
      border-bottom: 2px solid transparent;
      border-radius: var(--sm-border-radius-medium) var(--sm-border-radius-medium) 0 0;
      background: transparent;
      color: var(--sm-color-neutral-600);
      font-family: var(--sm-input-font-family);
      font-size: var(--sm-font-size-small);
      font-weight: var(--sm-font-weight-semibold);
      white-space: nowrap;
      cursor: pointer;
      transition:
        var(--sm-transition-fast) color,
        var(--sm-transition-fast) border-color,
        var(--sm-transition-fast) background-color;
      -webkit-appearance: none;
    }

    .tab:focus-visible {
      outline: var(--sm-focus-ring);
      outline-offset: var(--sm-focus-ring-offset);
    }

    .tab:hover:not(.tab--disabled) {
      color: var(--sm-color-primary-700);
      background-color: var(--sm-color-neutral-100);
    }

    .tab--active {
      color: var(--sm-color-primary-700);
      border-bottom-color: var(--sm-color-primary-600);
    }

    .tab--disabled {
      opacity: 0.5;
      cursor: not-allowed;
      pointer-events: none;
    }

    .tab svg {
      width: 1em;
      height: 1em;
      flex-shrink: 0;
    }

    .tab__close {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 1.25em;
      height: 1.25em;
      margin-inline-start: var(--sm-spacing-3x-small);
      border-radius: var(--sm-border-radius-small);
      opacity: 0.6;
      cursor: pointer;
      flex-shrink: 0;
    }

    .tab__close:hover {
      opacity: 1;
      background: var(--sm-color-neutral-200);
    }

    .tab__close:focus-visible {
      outline: var(--sm-focus-ring);
      outline-offset: 0;
      opacity: 1;
    }

    .tab__close svg {
      width: 0.875em;
      height: 0.875em;
    }
  `;

  constructor() {
    super();
    this.closable = false;
    this._panels = [];
  }

  connectedCallback() {
    super.connectedCallback();
    this.#observer = new MutationObserver(() => {
      this._panels = [...this.querySelectorAll(':scope > sm-tab-panel')];
    });
    this.#observer.observe(this, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['label', 'disabled', 'active'],
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.#observer?.disconnect();
    this.#observer = null;
  }

  firstUpdated() {
    this._panels = [...this.querySelectorAll(':scope > sm-tab-panel')];
    const first = this._panels.find(p => !p.disabled);
    if (first) this.#selectPanel(first);
  }

  #selectPanel(target) {
    this._panels.forEach(p => { p.active = p === target; });
    this.updateComplete.then(() => {
      this.shadowRoot?.querySelector('.tab--active')?.focus();
    });
  }

  #closePanel(panel) {
    const wasActive = panel.active;
    const idx = this._panels.indexOf(panel);

    const event = new CustomEvent('sm-tab-close', {
      detail: { panel },
      bubbles: true,
      composed: true,
      cancelable: true,
    });
    if (!this.dispatchEvent(event)) return;

    panel.remove();
    this._panels = [...this.querySelectorAll(':scope > sm-tab-panel')];

    if (wasActive) {
      const enabled = this._panels.filter(p => !p.disabled);
      const next = enabled[Math.min(idx, enabled.length - 1)];
      if (next) this.#selectPanel(next);
    }
  }

  #handleKeyDown(e) {
    const enabled = this._panels.filter(p => !p.disabled);
    const active = this._panels.find(p => p.active);
    const idx = enabled.indexOf(active);

    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      this.#selectPanel(enabled[(idx + 1) % enabled.length]);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      this.#selectPanel(enabled[(idx - 1 + enabled.length) % enabled.length]);
    } else if (e.key === 'Home') {
      e.preventDefault();
      if (enabled[0]) this.#selectPanel(enabled[0]);
    } else if (e.key === 'End') {
      e.preventDefault();
      if (enabled.at(-1)) this.#selectPanel(enabled.at(-1));
    }
  }

  #renderTab(panel) {
    const icon = panel.querySelector('[slot="icon"]');
    return html`
      <button
        part="tab"
        class=${classMap({
          tab: true,
          'tab--active': panel.active,
          'tab--disabled': panel.disabled,
        })}
        role="tab"
        aria-selected=${panel.active ? 'true' : 'false'}
        aria-disabled=${panel.disabled ? 'true' : 'false'}
        tabindex=${panel.active ? '0' : '-1'}
        @click=${() => !panel.disabled && this.#selectPanel(panel)}
      >
        ${icon ? icon.cloneNode(true) : nothing}
        <span class="tab__label">${panel.label}</span>
        ${this.closable ? html`
          <span
            part="close"
            class="tab__close"
            role="button"
            tabindex="0"
            aria-label="Close ${panel.label}"
            @click=${(e) => { e.stopPropagation(); this.#closePanel(panel); }}
            @keydown=${(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                e.stopPropagation();
                this.#closePanel(panel);
              }
            }}
          >${iconX()}</span>
        ` : nothing}
      </button>
    `;
  }

  render() {
    return html`
      <div class="tabbed-pane__nav" role="tablist" @keydown=${this.#handleKeyDown}>
        ${this._panels.map(p => this.#renderTab(p))}
      </div>
      <div class="tabbed-pane__body">
        <slot></slot>
      </div>
    `;
  }
}

customElements.define('sm-tabbed-pane', SmTabbedPane);
