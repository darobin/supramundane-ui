
import { LitElement, html, css, nothing } from 'lit';
import { iconX } from '../icons/index.js';

export class SmDialog extends LitElement {
  static properties = {
    open: { type: Boolean, reflect: true },
    label: { type: String },
    noHeader: { type: Boolean, attribute: 'no-header', reflect: true },
  };

  static styles = css`
    :host {
      display: contents;
    }

    dialog {
      display: flex;
      flex-direction: column;
      max-width: min(90vw, 35rem);
      max-height: min(90vh, 60rem);
      width: min(90vw, 35rem);
      padding: 0;
      border: none;
      border-radius: var(--sm-border-radius-large);
      box-shadow: var(--sm-shadow-x-large);
      background: var(--sm-panel-background-color);
      color: var(--sm-input-color);
      font-family: var(--sm-input-font-family);
      z-index: var(--sm-z-index-dialog);
      opacity: 0;
      transform: translateY(-0.5rem);
      transition:
        opacity var(--sm-transition-medium),
        transform var(--sm-transition-medium),
        display var(--sm-transition-medium) allow-discrete,
        overlay var(--sm-transition-medium) allow-discrete;
    }

    dialog[open] {
      opacity: 1;
      transform: translateY(0);
    }

    @starting-style {
      dialog[open] {
        opacity: 0;
        transform: translateY(-0.5rem);
      }
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
      dialog[open]::backdrop {
        opacity: 0;
      }
    }

    .dialog__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--sm-spacing-medium) var(--sm-spacing-large);
      border-bottom: var(--sm-panel-border-width) solid var(--sm-panel-border-color);
      flex-shrink: 0;
    }

    .dialog__label {
      font-size: var(--sm-font-size-large);
      font-weight: var(--sm-font-weight-semibold);
      margin: 0;
      flex: 1;
    }

    .dialog__close {
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

    .dialog__close:hover {
      background: var(--sm-color-neutral-100);
      color: var(--sm-color-neutral-700);
    }

    .dialog__close:focus-visible {
      outline: var(--sm-focus-ring);
      outline-offset: var(--sm-focus-ring-offset);
    }

    .dialog__close svg {
      width: 1rem;
      height: 1rem;
    }

    .dialog__body {
      flex: 1;
      overflow: auto;
      padding: var(--sm-spacing-large);
    }

    .dialog__footer {
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
    this.noHeader = false;
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
        aria-label=${this.noHeader ? this.label : nothing}
        aria-labelledby=${!this.noHeader ? 'dialog-label' : nothing}
        @cancel=${this.#handleCancel}
      >
        ${!this.noHeader ? html`
          <slot name="header">
            <div class="dialog__header" part="header">
              <slot name="label">
                <h2 id="dialog-label" class="dialog__label" part="label">${this.label}</h2>
              </slot>
              <button
                class="dialog__close"
                part="close-button"
                aria-label="Close"
                @click=${this.#handleClose}
              >${iconX()}</button>
            </div>
          </slot>
        ` : nothing}
        <div class="dialog__body" part="body">
          <slot></slot>
        </div>
        <div class="dialog__footer" part="footer">
          <slot name="footer"></slot>
        </div>
      </dialog>
    `;
  }
}

customElements.define('sm-dialog', SmDialog);
