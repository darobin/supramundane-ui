
import { LitElement, html, css } from 'lit';

export class SmTooltip extends LitElement {
  static properties = {
    content: { type: String },
    placement: { type: String },
    trigger: { type: String },
    disabled: { type: Boolean, reflect: true },
    distance: { type: Number },
    skidding: { type: Number },
    hoist: { type: Boolean, reflect: true },
    _visible: { state: true },
    _x: { state: true },
    _y: { state: true },
  };

  static styles = css`
    :host {
      display: inline-block;
    }

    .tooltip__trigger {
      display: inline-block;
    }

    .tooltip__popup {
      position: fixed;
      z-index: var(--sm-z-index-tooltip);
      background: var(--sm-tooltip-background-color);
      color: var(--sm-tooltip-color);
      font-family: var(--sm-tooltip-font-family);
      font-size: var(--sm-tooltip-font-size);
      font-weight: var(--sm-tooltip-font-weight);
      line-height: var(--sm-tooltip-line-height);
      padding: var(--sm-tooltip-padding);
      border-radius: var(--sm-tooltip-border-radius);
      box-shadow: var(--sm-shadow-small);
      max-width: 20rem;
      word-wrap: break-word;
      pointer-events: none;
      white-space: normal;
      opacity: 0;
      transform: scale(0.95);
      transition:
        opacity var(--sm-transition-fast),
        transform var(--sm-transition-fast);
    }

    .tooltip__popup.tooltip__popup--visible {
      opacity: 1;
      transform: scale(1);
    }
  `;

  #rafId = null;
  #triggerEl = null;

  constructor() {
    super();
    this.content = '';
    this.placement = 'top';
    this.trigger = 'hover focus';
    this.disabled = false;
    this.distance = 8;
    this.skidding = 0;
    this.hoist = false;
    this._visible = false;
    this._x = 0;
    this._y = 0;
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.#rafId) cancelAnimationFrame(this.#rafId);
  }

  get #triggers() {
    return this.trigger.split(' ');
  }

  #show() {
    if (this.disabled) return;
    this._visible = true;
    this.dispatchEvent(new CustomEvent('sm-show', { bubbles: true, composed: true }));
    this.#schedulePosition();
  }

  #hide() {
    this._visible = false;
    this.dispatchEvent(new CustomEvent('sm-hide', { bubbles: true, composed: true }));
  }

  #schedulePosition() {
    if (this.#rafId) cancelAnimationFrame(this.#rafId);
    this.#rafId = requestAnimationFrame(() => this.#updatePosition());
  }

  #updatePosition() {
    const trigger = this.shadowRoot?.querySelector('.tooltip__trigger');
    const popup = this.shadowRoot?.querySelector('.tooltip__popup');
    if (!trigger || !popup) return;

    const triggerRect = trigger.getBoundingClientRect();
    const popupRect = popup.getBoundingClientRect();
    const d = this.distance;
    const sk = this.skidding;
    const [primary, secondary] = this.placement.split('-');

    let x = 0;
    let y = 0;

    // Compute base position
    if (primary === 'top') {
      y = triggerRect.top - popupRect.height - d;
      x = triggerRect.left + triggerRect.width / 2 - popupRect.width / 2;
    } else if (primary === 'bottom') {
      y = triggerRect.bottom + d;
      x = triggerRect.left + triggerRect.width / 2 - popupRect.width / 2;
    } else if (primary === 'left') {
      x = triggerRect.left - popupRect.width - d;
      y = triggerRect.top + triggerRect.height / 2 - popupRect.height / 2;
    } else if (primary === 'right') {
      x = triggerRect.right + d;
      y = triggerRect.top + triggerRect.height / 2 - popupRect.height / 2;
    }

    // Apply skidding and secondary alignment
    if (primary === 'top' || primary === 'bottom') {
      x += sk;
      if (secondary === 'start') {
        x = triggerRect.left;
      } else if (secondary === 'end') {
        x = triggerRect.right - popupRect.width;
      }
    } else {
      y += sk;
      if (secondary === 'start') {
        y = triggerRect.top;
      } else if (secondary === 'end') {
        y = triggerRect.bottom - popupRect.height;
      }
    }

    this._x = Math.round(x);
    this._y = Math.round(y);
  }

  #handlePointerEnter() {
    if (this.#triggers.includes('hover')) this.#show();
  }

  #handlePointerLeave() {
    if (this.#triggers.includes('hover')) this.#hide();
  }

  #handleFocusIn() {
    if (this.#triggers.includes('focus')) this.#show();
  }

  #handleFocusOut() {
    if (this.#triggers.includes('focus')) this.#hide();
  }

  #handleClick() {
    if (this.#triggers.includes('click')) {
      this._visible ? this.#hide() : this.#show();
    }
  }

  render() {
    return html`
      <span
        class="tooltip__trigger"
        @pointerenter=${this.#handlePointerEnter}
        @pointerleave=${this.#handlePointerLeave}
        @focusin=${this.#handleFocusIn}
        @focusout=${this.#handleFocusOut}
        @click=${this.#handleClick}
      >
        <slot></slot>
      </span>
      <div
        class="tooltip__popup ${this._visible ? 'tooltip__popup--visible' : ''}"
        role="tooltip"
        style="left:${this._x}px;top:${this._y}px;"
        part="popup"
      >
        <slot name="content">${this.content}</slot>
      </div>
    `;
  }
}

customElements.define('sm-tooltip', SmTooltip);
