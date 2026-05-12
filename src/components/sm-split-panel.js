
import { LitElement, html, css } from 'lit';
import { iconGripVertical } from '../icons/index.js';

export class SmSplitPanel extends LitElement {
  static properties = {
    position: { type: Number },
    primary: { type: String },
    vertical: { type: Boolean, reflect: true },
    disabled: { type: Boolean, reflect: true },
    snapThreshold: { type: Number, attribute: 'snap-threshold' },
    _position: { state: true },
  };

  static styles = css`
    :host {
      display: flex;
      width: 100%;
      height: 100%;
      overflow: hidden;
    }

    :host([vertical]) {
      flex-direction: column;
    }

    .split-panel__start,
    .split-panel__end {
      overflow: hidden;
    }

    .split-panel__start {
      flex: 0 0 auto;
    }

    .split-panel__end {
      flex: 1;
      min-width: 0;
      min-height: 0;
    }

    .split-panel__divider {
      flex: 0 0 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--sm-panel-border-color);
      cursor: col-resize;
      user-select: none;
      touch-action: none;
      transition: background var(--sm-transition-fast);
      position: relative;
    }

    :host([vertical]) .split-panel__divider {
      cursor: row-resize;
      width: 100%;
      height: 4px;
    }

    .split-panel__divider:hover:not(.split-panel__divider--disabled),
    .split-panel__divider:focus-visible:not(.split-panel__divider--disabled) {
      background: var(--sm-color-primary-400);
    }

    .split-panel__divider:focus-visible {
      outline: var(--sm-focus-ring);
      outline-offset: 0;
    }

    .split-panel__divider--disabled {
      cursor: not-allowed;
    }

    .split-panel__divider svg {
      width: 1rem;
      height: 1rem;
      color: var(--sm-color-neutral-500);
      pointer-events: none;
    }

    :host([vertical]) .split-panel__divider svg {
      transform: rotate(90deg);
    }
  `;

  #dragging = false;
  #startPos = 0;
  #startPosition = 0;

  constructor() {
    super();
    this.position = 50;
    this.primary = 'start';
    this.vertical = false;
    this.disabled = false;
    this.snapThreshold = 12;
    this._position = 50;
  }

  connectedCallback() {
    super.connectedCallback();
    this._position = this.position;
  }

  updated(changed) {
    if (changed.has('position') && !this.#dragging) {
      this._position = this.position;
    }
  }

  #handlePointerDown(e) {
    if (this.disabled) return;
    const divider = this.shadowRoot?.querySelector('.split-panel__divider');
    if (!divider) return;

    this.#dragging = true;
    this.#startPos = this.vertical ? e.clientY : e.clientX;
    this.#startPosition = this._position;
    divider.setPointerCapture(e.pointerId);
  }

  #handlePointerMove(e) {
    if (!this.#dragging) return;
    const container = this.shadowRoot?.querySelector('.split-panel__start')?.parentElement;
    if (!container) return;

    const containerRect = this.getBoundingClientRect();
    const dimension = this.vertical ? containerRect.height : containerRect.width;
    if (dimension === 0) return;

    const delta = this.vertical
      ? e.clientY - this.#startPos
      : e.clientX - this.#startPos;

    const deltaPercent = (delta / dimension) * 100;
    let newPosition = this.primary === 'end'
      ? this.#startPosition - deltaPercent
      : this.#startPosition + deltaPercent;

    newPosition = Math.max(0, Math.min(100, newPosition));

    // Snap to edges
    const snapPercent = (this.snapThreshold / dimension) * 100;
    if (newPosition < snapPercent) newPosition = 0;
    if (newPosition > 100 - snapPercent) newPosition = 100;

    this._position = newPosition;
    this.dispatchEvent(new CustomEvent('sm-reposition', {
      detail: { position: this._position },
      bubbles: true,
      composed: true,
    }));
  }

  #handlePointerUp() {
    this.#dragging = false;
  }

  #handleKeyDown(e) {
    if (this.disabled) return;
    const step = 1;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      this._position = Math.max(0, this._position - step);
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      this._position = Math.min(100, this._position + step);
    } else if (e.key === 'Home') {
      e.preventDefault();
      this._position = 0;
    } else if (e.key === 'End') {
      e.preventDefault();
      this._position = 100;
    }
    this.dispatchEvent(new CustomEvent('sm-reposition', {
      detail: { position: this._position },
      bubbles: true,
      composed: true,
    }));
  }

  render() {
    const startSize = this.primary === 'end' ? 100 - this._position : this._position;
    const dimension = this.vertical ? 'height' : 'width';

    return html`
      <div
        class="split-panel__start"
        part="start"
        style="${dimension}: ${startSize}%;"
      >
        <slot name="start"></slot>
      </div>
      <div
        class="split-panel__divider ${this.disabled ? 'split-panel__divider--disabled' : ''}"
        part="divider"
        role="separator"
        aria-valuenow=${Math.round(this._position)}
        aria-valuemin="0"
        aria-valuemax="100"
        aria-label="Resize panels"
        tabindex=${this.disabled ? '-1' : '0'}
        @pointerdown=${this.#handlePointerDown}
        @pointermove=${this.#handlePointerMove}
        @pointerup=${this.#handlePointerUp}
        @keydown=${this.#handleKeyDown}
      >
        <slot name="divider">${iconGripVertical()}</slot>
      </div>
      <div class="split-panel__end" part="end">
        <slot name="end"></slot>
      </div>
    `;
  }
}

customElements.define('sm-split-panel', SmSplitPanel);
