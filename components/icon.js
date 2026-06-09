
import { css, html } from 'lit';
import { SupramundaneElement } from '../core.js';

export class Icon extends SupramundaneElement {
  static properties = {
    label: { type: String },
  };

  static styles = css`
    :host {
      display: inline-block;
      width: 1.4em;
      height: 1.4em;
      box-sizing: content-box !important;
    }
    ::slotted(svg),
    svg,
    ::slotted(img),
    img {
      display: block;
      height: 100%;
      width: 100%;
    }
  `;

  constructor() {
    super();
    this.#handleLabelChange();
  }

  hasChanged (changedProperties) {
    if (changedProperties.has('label')) this.#handleLabelChange();
  }

  #handleLabelChange () {
    if (typeof this.label === 'string' && this.label.length > 0) {
      this.setAttribute('role', 'img');
      this.setAttribute('aria-label', this.label);
      this.removeAttribute('aria-hidden');
    } else {
      this.removeAttribute('role');
      this.removeAttribute('aria-label');
      this.setAttribute('aria-hidden', 'true');
    }
  }

  render () {
    return html`<slot></slot>`;
  }
}

customElements.define('sm-icon', Icon);
