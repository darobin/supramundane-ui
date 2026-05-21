
import { LitElement, html, css } from 'lit';

export class SmDivider extends LitElement {
  static properties = {
    vertical: { type: Boolean, reflect: true },
    dashed: { type: Boolean, reflect: true },
  };

  static styles = css`
    :host {
      display: block;
    }

    :host([vertical]) {
      display: inline-block;
    }

    .divider {
      border: none;
      border-top: 1px solid var(--sm-panel-border-color);
      height: 0;
      width: 100%;
      margin: 0;
    }

    :host([dashed]) .divider {
      border-top-style: dashed;
    }

    :host([vertical]) .divider {
      border-top: none;
      border-left: 1px solid var(--sm-panel-border-color);
      height: 100%;
      width: 0;
    }

    :host([vertical][dashed]) .divider {
      border-left-style: dashed;
    }
  `;

  constructor() {
    super();
    this.vertical = false;
    this.dashed = false;
  }

  render() {
    return html`<div part="base" class="divider" role="separator" aria-orientation=${this.vertical ? 'vertical' : 'horizontal'}></div>`;
  }
}

customElements.define('sm-divider', SmDivider);
