
import { LitElement, html, css } from 'lit';

export class SmTree extends LitElement {
  static properties = {
    selection: { type: String },
    indentGuides: { type: Boolean, attribute: 'indent-guides', reflect: true },
  };

  static styles = css`
    :host {
      display: block;
    }

    :host([indent-guides]) {
      --sm-tree-indent-guides: 1px solid var(--sm-color-neutral-200);
    }
  `;

  constructor() {
    super();
    this.selection = 'none';
    this.indentGuides = false;
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('sm-tree-select', this.#handleSelection);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('sm-tree-select', this.#handleSelection);
  }

  #getAllItems() {
    return [...this.querySelectorAll('sm-tree-item')];
  }

  #handleSelection = (e) => {
    if (this.selection === 'none') return;
    const item = e.detail?.item;
    if (!item) return;

    if (this.selection === 'single') {
      this.#getAllItems().forEach(i => { i.selected = false; });
      item.selected = true;
    } else if (this.selection === 'multiple') {
      item.selected = !item.selected;
    }

    const selected = this.#getAllItems().filter(i => i.selected);
    this.dispatchEvent(new CustomEvent('sm-selection-change', {
      detail: { selection: selected },
      bubbles: true,
      composed: true,
    }));
  };

  render() {
    return html`
      <div role="tree" part="base">
        <slot></slot>
      </div>
    `;
  }
}

customElements.define('sm-tree', SmTree);
