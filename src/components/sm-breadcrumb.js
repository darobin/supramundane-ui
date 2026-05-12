
import { LitElement, html, css } from 'lit';

export class SmBreadcrumb extends LitElement {
  static properties = {
    label: { type: String },
  };

  static styles = css`
    :host {
      display: block;
    }

    ol {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      list-style: none;
      margin: 0;
      padding: 0;
      gap: 0;
    }
  `;

  constructor() {
    super();
    this.label = 'Breadcrumb';
  }

  #handleSlotChange() {
    const items = [...this.querySelectorAll(':scope > sm-breadcrumb-item')];
    items.forEach((item, i) => {
      item.current = i === items.length - 1;
    });
  }

  render() {
    return html`
      <nav aria-label=${this.label}>
        <ol role="list">
          <slot @slotchange=${this.#handleSlotChange}></slot>
        </ol>
      </nav>
    `;
  }
}

customElements.define('sm-breadcrumb', SmBreadcrumb);
