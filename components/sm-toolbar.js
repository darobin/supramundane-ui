
import { LitElement, html, css } from 'lit';

export class SmToolbar extends LitElement {
  static styles = css`
    :host {
      display: inline-flex;
      align-items: center;
      gap: var(--sm-spacing-2x-small);
      padding: var(--sm-spacing-2x-small);
      background: var(--sm-panel-background-color);
      border: var(--sm-panel-border-width) solid var(--sm-panel-border-color);
      border-radius: var(--sm-border-radius-medium);
      box-shadow: var(--sm-shadow-small);
    }

    ::slotted(hr) {
      all: unset;
      display: block;
      align-self: stretch;
      width: 1px;
      background: var(--sm-panel-border-color);
      margin: var(--sm-spacing-2x-small) var(--sm-spacing-3x-small);
    }
  `;

  render() {
    return html`<slot></slot>`;
  }
}

customElements.define('sm-toolbar', SmToolbar);
