
import { LitElement, html, css, nothing } from 'lit';
import { iconX } from '../icons/index.js';

export class SmDrawer extends LitElement {
  static properties = {
    open: { type: Boolean, reflect: true },
    label: { type: String },
    placement: { type: String, reflect: true },
    contained: { type: Boolean, reflect: true },
  };

  static styles = css`
    :host {
      display: contents;
    }

    :host([contained]) {
      position: absolute;
      inset: 0;
    }

    /* Base: hidden when closed. display:none prevents layout and hit-testing. */
    dialog {
      display: none;
      flex-direction: column;
      padding: 0;
      border: none;
      background: var(--sm-panel-background-color);
      color: var(--sm-input-color);
      font-family: var(--sm-input-font-family);
      box-shadow: var(--sm-shadow-x-large);
      z-index: var(--sm-z-index-drawer);
      margin: 0;
      max-width: none;
      max-height: none;
      transition:
        opacity var(--sm-transition-medium),
        transform var(--sm-transition-medium),
        display var(--sm-transition-medium) allow-discrete,
        overlay var(--sm-transition-medium) allow-discrete;
    }

    dialog::backdrop {
      background: var(--sm-overlay-background-color);
      opacity: 0;
      transition:
        opacity var(--sm-transition-medium),
        display var(--sm-transition-medium) allow-discrete,
        overlay var(--sm-transition-medium) allow-discrete;
    }

    dialog[open]::backdrop {
      opacity: 1;
    }

    @starting-style {
      dialog[open]::backdrop { opacity: 0; }
    }

    /* Placement: end (default) — position + closed transform */
    :host([placement="end"]) dialog,
    :host(:not([placement])) dialog {
      inset-inline-start: auto; /* clear UA's left:0 so right:0 takes effect */
      inset-inline-end: 0;
      inset-block: 0;
      width: min(90vw, 28rem);
      height: 100dvh;
      border-radius: var(--sm-border-radius-large) 0 0 var(--sm-border-radius-large);
      opacity: 0;
      transform: translateX(100%);
    }

    /* Open state: higher specificity than placement selector → wins */
    :host([placement="end"]) dialog[open],
    :host(:not([placement])) dialog[open] {
      display: flex;
      opacity: 1;
      transform: translateX(0);
    }

    @starting-style {
      :host([placement="end"]) dialog[open],
      :host(:not([placement])) dialog[open] {
        opacity: 0;
        transform: translateX(100%);
      }
    }

    /* Placement: start */
    :host([placement="start"]) dialog {
      inset-inline-end: auto; /* clear UA's right:0 */
      inset-inline-start: 0;
      inset-block: 0;
      width: min(90vw, 28rem);
      height: 100dvh;
      border-radius: 0 var(--sm-border-radius-large) var(--sm-border-radius-large) 0;
      opacity: 0;
      transform: translateX(-100%);
    }

    :host([placement="start"]) dialog[open] {
      display: flex;
      opacity: 1;
      transform: translateX(0);
    }

    @starting-style {
      :host([placement="start"]) dialog[open] {
        opacity: 0;
        transform: translateX(-100%);
      }
    }

    /* Placement: top */
    :host([placement="top"]) dialog {
      inset-block-start: 0;
      inset-inline: 0;
      width: 100vw;
      height: auto;
      max-height: min(90vh, 40rem);
      border-radius: 0 0 var(--sm-border-radius-large) var(--sm-border-radius-large);
      opacity: 0;
      transform: translateY(-100%);
    }

    :host([placement="top"]) dialog[open] {
      display: flex;
      opacity: 1;
      transform: translateY(0);
    }

    @starting-style {
      :host([placement="top"]) dialog[open] {
        opacity: 0;
        transform: translateY(-100%);
      }
    }

    /* Placement: bottom */
    :host([placement="bottom"]) dialog {
      inset-block-end: 0;
      inset-inline: 0;
      width: 100vw;
      height: auto;
      max-height: min(90vh, 40rem);
      border-radius: var(--sm-border-radius-large) var(--sm-border-radius-large) 0 0;
      opacity: 0;
      transform: translateY(100%);
    }

    :host([placement="bottom"]) dialog[open] {
      display: flex;
      opacity: 1;
      transform: translateY(0);
    }

    @starting-style {
      :host([placement="bottom"]) dialog[open] {
        opacity: 0;
        transform: translateY(100%);
      }
    }

    .drawer__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--sm-spacing-medium) var(--sm-spacing-large);
      border-bottom: var(--sm-panel-border-width) solid var(--sm-panel-border-color);
      flex-shrink: 0;
    }

    .drawer__label {
      font-size: var(--sm-font-size-large);
      font-weight: var(--sm-font-weight-semibold);
      margin: 0;
      flex: 1;
    }

    .drawer__close {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 2rem;
      height: 2rem;
      border: none;
      border-radius: var(--sm-border-radius-medium);
      background: transparent;
      color: var(--sm-color-neutral-500);
      cursor: pointer;
      flex-shrink: 0;
      transition: var(--sm-transition-fast) background-color, var(--sm-transition-fast) color;
    }

    .drawer__close:hover {
      background: var(--sm-color-neutral-100);
      color: var(--sm-color-neutral-700);
    }

    .drawer__close:focus-visible {
      outline: var(--sm-focus-ring);
      outline-offset: var(--sm-focus-ring-offset);
    }

    .drawer__close svg {
      width: 1rem;
      height: 1rem;
    }

    .drawer__body {
      flex: 1;
      overflow: auto;
      padding: var(--sm-spacing-large);
    }

    .drawer__footer {
      display: contents;
    }

    ::slotted([slot="footer"]) {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: var(--sm-spacing-x-small);
      padding: var(--sm-spacing-medium) var(--sm-spacing-large);
      border-top: var(--sm-panel-border-width) solid var(--sm-panel-border-color);
      flex-shrink: 0;
    }
  `;

  constructor() {
    super();
    this.open = false;
    this.label = '';
    this.placement = 'end';
    this.contained = false;
  }

  get #dialog() {
    return this.shadowRoot?.querySelector('dialog');
  }

  show() {
    this.open = true;
  }

  hide() {
    this.open = false;
  }

  updated(changed) {
    if (changed.has('open')) {
      if (this.open) {
        this.#dialog?.showModal();
        this.dispatchEvent(new CustomEvent('sm-show', { bubbles: true, composed: true }));
        this.dispatchEvent(new CustomEvent('sm-initial-focus', { bubbles: true, composed: true }));
      } else {
        this.#dialog?.close();
        this.dispatchEvent(new CustomEvent('sm-hide', { bubbles: true, composed: true }));
      }
    }
  }

  #handleCancel(e) {
    e.preventDefault();
    const requestClose = new CustomEvent('sm-request-close', {
      bubbles: true,
      composed: true,
      cancelable: true,
    });
    if (this.dispatchEvent(requestClose)) {
      this.hide();
    }
  }

  #handleClose() {
    this.open = false;
  }

  render() {
    return html`
      <dialog
        part="base"
        aria-labelledby="drawer-label"
        @cancel=${this.#handleCancel}
      >
        <slot name="header">
          <div class="drawer__header" part="header">
            <slot name="label">
              <h2 id="drawer-label" class="drawer__label" part="label">${this.label}</h2>
            </slot>
            <button
              class="drawer__close"
              part="close-button"
              aria-label="Close"
              @click=${this.#handleClose}
            >${iconX()}</button>
          </div>
        </slot>
        <div class="drawer__body" part="body">
          <slot></slot>
        </div>
        <div class="drawer__footer" part="footer">
          <slot name="footer"></slot>
        </div>
      </dialog>
    `;
  }
}

customElements.define('sm-drawer', SmDrawer);
