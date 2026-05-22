
import { html, css, nothing } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { SupramundaneElement } from '../core.js';
import { iconX } from '../icons.js';
import './icon.js';
import './icon-button.js';

export class TabbedPane extends SupramundaneElement {
  static properties = {
    closable: { type: Boolean, reflect: true },
    fullscreen: { type: Boolean, reflect: true },
    _panels: { state: true },
  };

  #observer = null;

  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
    }

    .tabbed-pane__nav {
      border-top: 1px solid var(--sm-panel-border-color);
      border-bottom: 1px solid var(--sm-panel-border-color);
      overflow-x: auto;
      scrollbar-width: none;
      padding: var(--sm-spacing-x-small);
    }
    .tabbed-pane__fullscreen {
      display: none;
    }
    .tabbed-pane__nav::-webkit-scrollbar {
      display: none;
    }
    .tabbed-pane__container {
      display: flex;
      align-items: flex-end;
      background: var(--sm-color-neutral-100);
      border-radius: var(--sm-spacing-x-small);
      padding: var(--sm-spacing-2x-small) var(--sm-spacing-x-small);
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
      padding: var(--sm-spacing-2x-small) var(--sm-spacing-x-small);
      border: none;
      border-radius: var(--sm-border-radius-small);
      background: transparent;
      color: var(--sm-color-neutral-500);
      font-family: var(--sm-input-font-family);
      font-size: var(--sm-font-size-small);
      font-weight: var(--sm-font-weight-medium);
      white-space: nowrap;
      transition:
        var(--sm-transition-medium) color,
        var(--sm-transition-medium) border-color,
        var(--sm-transition-medium) background-color;
      -webkit-appearance: none;
    }
    .tab--active {
      color: var(--sm-color-neutral-1000);
      background: var(--sm-color-neutral-0);
      box-shadow: var(--sm-shadow-medium);
    }
    .tab:hover {
      color: var(--sm-color-neutral-1000);
    }
    .tab svg {
      width: 1em;
      height: 1em;
      flex-shrink: 0;
    }
    .tab sm-icon-button {
      opacity: 0;
      transition: var(--sm-transition-medium) opacity;
    }
    .tab:hover sm-icon-button,
    .tab--active  sm-icon-button {
      opacity: 1;
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
  }

  computeNextIndexOnClosing (panel) {
    if (this._panels.length === 1) return -1;
    // if the panel was active, need to change the current active one
    const idx = this._panels.indexOf(panel);
    if (panel.active) {
      return (idx === 0) ? 0 : idx - 1;
    }
    const activeIdx = this._panels.findIndex(p => p.active);
    return (idx < activeIdx) ? activeIdx - 1 : activeIdx;
  }
  #closePanel (panel) {
    panel.remove();
    this._panels = [...this.querySelectorAll(':scope > sm-tab-panel')];
    this.emit('sm-tab-closed', { detail: { panel } });
    if (this._panels.length) this.#handleActivatePanel(this._panels[this.computeNextIndexOnClosing(panel)]);
  }

  #handleActivatePanel (ev, panel) {
    ev.stopPropagation();
    const activeIndex = this._panels.indexOf(panel);
    const event = this.emit('sm-activate-tab', { detail: { panel, activeIndex } });
    if (!event.defaultPrevented) this.#selectPanel(panel);
  }
  #handleClosePanel (ev, panel) {
    ev.stopPropagation();
    const activeIndex = this._panels.indexOf(panel);
    const nextIndex = this.computeNextIndexOnClosing(panel);
    const event = this.emit('sm-close-tab', { detail: { panel, activeIndex, nextIndex } });
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
        @click=${(ev) => this.#handleActivatePanel(ev, panel)}
      >
        ${icon ? html`<sm-icon>${icon}</sm-icon>` : nothing}
        <span class="tab__label">${panel.label}</span>
        ${this.closable ? html`<sm-icon-button part="close" size="small" label="Close ${panel.label}" @click=${(ev) => this.#handleClosePanel(ev, panel)}>${iconX()}</sm-icon-button>` : nothing}
      </button>
    `;
  }

  render () {
    return html`
      <div class=${classMap({
        'tabbed-pane__nav': true,
        'tabbed-pane__fullscreen': this.fullscreen,
      })} role="tablist">
        <div class="tabbed-pane__container">
          ${this._panels.map(p => this.#renderTab(p))}
        </div>
      </div>
      <div class="tabbed-pane__body">
        <slot></slot>
      </div>
    `;
  }
}

customElements.define('sm-tabbed-pane', TabbedPane);
