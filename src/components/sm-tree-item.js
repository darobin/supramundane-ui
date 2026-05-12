
import { LitElement, html, css, nothing } from 'lit';
import { iconChevronRight, iconSpinner } from '../icons/index.js';

export class SmTreeItem extends LitElement {
  static properties = {
    expanded: { type: Boolean, reflect: true },
    selected: { type: Boolean, reflect: true },
    disabled: { type: Boolean, reflect: true },
    lazy: { type: Boolean, reflect: true },
    loading: { type: Boolean, reflect: true },
    _hasChildren: { state: true },
    _lazyLoaded: { state: true },
  };

  static styles = css`
    :host {
      display: block;
    }

    .tree-item__item {
      display: flex;
      align-items: center;
      height: var(--sm-input-height-small);
      padding: 0 var(--sm-spacing-x-small);
      border-radius: var(--sm-border-radius-small);
      cursor: pointer;
      user-select: none;
      transition:
        background-color var(--sm-transition-fast),
        color var(--sm-transition-fast);
      color: var(--sm-input-color);
      font-family: var(--sm-input-font-family);
      font-size: var(--sm-font-size-small);
      outline: none;
      gap: var(--sm-spacing-2x-small);
    }

    .tree-item__item:hover:not(.tree-item__item--disabled) {
      background-color: var(--sm-color-neutral-100);
    }

    .tree-item__item:focus-visible {
      outline: var(--sm-focus-ring);
      outline-offset: var(--sm-focus-ring-offset);
    }

    .tree-item__item--selected {
      background-color: var(--sm-color-primary-50);
      color: var(--sm-color-primary-700);
    }

    .tree-item__item--selected:hover {
      background-color: var(--sm-color-primary-100);
    }

    .tree-item__item--disabled {
      opacity: 0.5;
      cursor: not-allowed;
      pointer-events: none;
    }

    .tree-item__expand {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 1.25rem;
      height: 1.25rem;
      flex-shrink: 0;
      border: none;
      background: none;
      padding: 0;
      cursor: pointer;
      color: inherit;
      border-radius: var(--sm-border-radius-small);
      transition: transform var(--sm-transition-fast);
    }

    .tree-item__expand:focus-visible {
      outline: var(--sm-focus-ring);
      outline-offset: var(--sm-focus-ring-offset);
    }

    .tree-item__expand svg {
      width: 1rem;
      height: 1rem;
      transition: transform var(--sm-transition-fast);
    }

    .tree-item__expand--expanded svg {
      transform: rotate(90deg);
    }

    .tree-item__expand--placeholder {
      width: 1.25rem;
      height: 1.25rem;
      flex-shrink: 0;
      display: inline-block;
    }

    .tree-item__spinner {
      width: 1rem;
      height: 1rem;
      flex-shrink: 0;
      animation: spin 0.75s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .tree-item__spinner svg {
      width: 1rem;
      height: 1rem;
    }

    .tree-item__label {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .tree-item__children {
      display: none;
    }

    .tree-item__children--expanded {
      display: block;
    }

    /* Indent children via padding based on depth */
    .tree-item__children-inner {
      padding-inline-start: 1.5rem;
      border-inline-start: var(--sm-tree-indent-guides, none);
      margin-inline-start: 0.625rem;
    }
  `;

  constructor() {
    super();
    this.expanded = false;
    this.selected = false;
    this.disabled = false;
    this.lazy = false;
    this.loading = false;
    this._hasChildren = false;
    this._lazyLoaded = false;
  }

  #handleSlotChange(e) {
    const slot = e.target;
    const children = slot.assignedElements({ flatten: true });
    this._hasChildren = children.some(el => el.tagName?.toLowerCase() === 'sm-tree-item');
  }

  #handleExpandClick(e) {
    e.stopPropagation();
    if (this.disabled) return;
    if (!this._hasChildren && !this.lazy) return;
    this.expanded = !this.expanded;

    if (this.expanded) {
      if (this.lazy && !this._lazyLoaded) {
        this.loading = true;
        this.dispatchEvent(new CustomEvent('sm-lazy-load', {
          bubbles: true,
          composed: true,
        }));
        this._lazyLoaded = true;
      }
      this.dispatchEvent(new CustomEvent('sm-expand', {
        bubbles: true,
        composed: true,
      }));
    } else {
      this.dispatchEvent(new CustomEvent('sm-collapse', {
        bubbles: true,
        composed: true,
      }));
    }
  }

  #handleItemClick(e) {
    if (this.disabled) return;
    // Only fire selection if not clicking the expand toggle
    this.dispatchEvent(new CustomEvent('sm-tree-select', {
      detail: { item: this },
      bubbles: true,
      composed: true,
    }));
  }

  #handleItemKeyDown(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this.#handleItemClick(e);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      if ((this._hasChildren || this.lazy) && !this.expanded) {
        this.#handleExpandClick(e);
      }
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      if (this.expanded) {
        this.#handleExpandClick(e);
      }
    }
  }

  render() {
    const showExpand = this._hasChildren || this.lazy;

    return html`
      <div part="base">
        <div
          class="tree-item__item
            ${this.selected ? 'tree-item__item--selected' : ''}
            ${this.disabled ? 'tree-item__item--disabled' : ''}"
          part="item"
          role="treeitem"
          aria-expanded=${showExpand ? (this.expanded ? 'true' : 'false') : nothing}
          aria-selected=${this.selected ? 'true' : 'false'}
          aria-disabled=${this.disabled ? 'true' : 'false'}
          tabindex=${this.disabled ? '-1' : '0'}
          @click=${this.#handleItemClick}
          @keydown=${this.#handleItemKeyDown}
        >
          ${this.loading ? html`
            <span class="tree-item__spinner" aria-hidden="true">${iconSpinner()}</span>
          ` : showExpand ? html`
            <button
              class="tree-item__expand ${this.expanded ? 'tree-item__expand--expanded' : ''}"
              part="expand-button"
              aria-label=${this.expanded ? 'Collapse' : 'Expand'}
              tabindex="-1"
              @click=${this.#handleExpandClick}
            >
              <slot name="expand-icon">${iconChevronRight()}</slot>
            </button>
          ` : html`<span class="tree-item__expand--placeholder"></span>`}

          <div class="tree-item__label" part="label">
            <slot name="label"></slot>
          </div>
        </div>

        <div
          class="tree-item__children ${this.expanded && !this.loading ? 'tree-item__children--expanded' : ''}"
          role="group"
          part="children"
        >
          <div class="tree-item__children-inner">
            <slot @slotchange=${this.#handleSlotChange}></slot>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('sm-tree-item', SmTreeItem);
