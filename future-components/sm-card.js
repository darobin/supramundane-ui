
import { LitElement, html, css } from 'lit';

export class SmCard extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    .card {
      background-color: var(--sm-panel-background-color);
      border: var(--sm-panel-border-width) solid var(--sm-panel-border-color);
      border-radius: var(--sm-border-radius-large);
      box-shadow: var(--sm-shadow-small);
      overflow: hidden;
    }

    .card__image ::slotted(*) {
      display: block;
      width: 100%;
    }

    .card__header {
      padding: var(--sm-spacing-medium);
      border-bottom: var(--sm-panel-border-width) solid var(--sm-panel-border-color);
    }

    .card__body {
      padding: var(--sm-spacing-medium);
    }

    .card__footer {
      padding: var(--sm-spacing-medium);
      border-top: var(--sm-panel-border-width) solid var(--sm-panel-border-color);
    }
  `;

  #handleHeaderSlotChange(e) {
    const slot = e.target;
    const header = this.shadowRoot.querySelector('.card__header');
    header.hidden = slot.assignedNodes({ flatten: true }).length === 0;
  }

  #handleFooterSlotChange(e) {
    const slot = e.target;
    const footer = this.shadowRoot.querySelector('.card__footer');
    footer.hidden = slot.assignedNodes({ flatten: true }).length === 0;
  }

  render() {
    return html`
      <div part="base" class="card">
        <div part="image" class="card__image">
          <slot name="image"></slot>
        </div>
        <div part="header" class="card__header" hidden>
          <slot name="header" @slotchange=${this.#handleHeaderSlotChange}></slot>
        </div>
        <div part="body" class="card__body">
          <slot></slot>
        </div>
        <div part="footer" class="card__footer" hidden>
          <slot name="footer" @slotchange=${this.#handleFooterSlotChange}></slot>
        </div>
      </div>
    `;
  }
}

customElements.define('sm-card', SmCard);
