
import { html, css, nothing } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { SupramundaneElement } from '../core.js';
import { iconX } from '../icons.js';
import './icon.js';
import './icon-button.js';

export class TabbedPane extends SupramundaneElement {
  static properties = {
    closable: { type: Boolean, reflect: true },
    _panels: { state: true },
  };

  #observer = null;

  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
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
      border-radius: 0;
      flex-grow: 1;
    }

    .tab {
      display: flex;
      align-items: center;
      gap: var(--sm-spacing-2x-small);
      padding: var(--sm-spacing-x-small) var(--sm-spacing-x-small);
      border: none;
      border-bottom: 2px solid transparent;
      border-radius: var(--sm-border-radius-small) var(--sm-border-radius-small) 0 0;
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

    .tab--active {
      color: var(--sm-color-accent-700);
      border-bottom-color: var(--sm-color-accent-600);
    }

    .tab svg {
      width: 1em;
      height: 1em;
      flex-shrink: 0;
    }
  `;

  constructor () {
    super();
    this.closable = false;
    this._panels = [];
  }

  connectedCallback () {
    super.connectedCallback();
    this.#observer = new MutationObserver(() => {
      this._panels = [...this.querySelectorAll(':scope > sm-tab-panel')];
    });
    this.#observer.observe(this, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['label', 'active'],
    });
  }

  disconnectedCallback () {
    super.disconnectedCallback();
    this.#observer?.disconnect();
    this.#observer = null;
  }

  firstUpdated () {
    this._panels = [...this.querySelectorAll(':scope > sm-tab-panel')];
    if (this._panels.length && !this._panels.find(p => p.active)) this.#handleActivatePanel(this._panels[0]);
  }

  #selectPanel (target) {
    this._panels.forEach(p => { p.active = p === target; p.hidden = !p.active });
    console.warn(`#selectPanel`, this._panels);
  }

  #closePanel (panel) {
    // if the panel was active, need to change the current active one
    const wasActive = panel.active;
    let nextIdx;
    if (wasActive) {
      const idx = this._panels.indexOf(panel);
      nextIdx = (idx === 0) ? 0 : idx - 1;
    }
    panel.remove();
    this._panels = [...this.querySelectorAll(':scope > sm-tab-panel')];
    this.emit('sm-tab-closed', { detail: { panel } });
    if (typeof nextIdx !== 'undefined') this.#handleActivatePanel(this._panels[nextIdx]);
  }

  #handleActivatePanel (panel) {
    const activeIndex = this._panels.indexOf(panel);
    const event = this.emit('sm-activate-tab', { detail: { panel, activeIndex } });
    console.warn(`sm-activate-tab`, event);
    if (!event.defaultPrevented) this.#selectPanel(panel);
  }
  #handleClosePanel (panel) {
    const activeIndex = this._panels.indexOf(panel);
    const event = this.emit('sm-close-tab', { detail: { panel, activeIndex } });
    console.warn(`sm-close-tab`, event);
    if (!event.defaultPrevented) this.#closePanel(panel);
  }

  #renderTab (panel) {
    const icon = panel.querySelector('[slot="icon"]')?.cloneNode(true);
    icon?.removeAttribute('slot');
    return html`
      <button
        part="tab"
        class=${classMap({
          tab: true,
          'tab--active': panel.active,
        })}
        role="tab"
        aria-selected=${panel.active ? 'true' : 'false'}
        tabindex=${panel.active ? '0' : '-1'}
        @click=${() => this.#handleActivatePanel(panel)}
      >
        ${icon ? html`<sm-icon>${icon}</sm-icon>` : nothing}
        <span class="tab__label">${panel.label}</span>
        ${this.closable ? html`<sm-icon-button part="close" size="small" label="Close ${panel.label}" @click=${() => this.#handleClosePanel(panel)}>${iconX()}</sm-icon-button>` : nothing}
      </button>
    `;
  }

  render () {
    return html`
      <div class="tabbed-pane__nav" role="tablist">
        ${this._panels.map(p => this.#renderTab(p))}
      </div>
      <div class="tabbed-pane__body">
        <slot></slot>
      </div>
    `;
  }
}

customElements.define('sm-tabbed-pane', TabbedPane);
