
import { LitElement, html, css } from 'lit';
import { iconSpinner } from '../icons/index.js';

export class SmInfiniteScroll extends LitElement {
  static properties = {
    distance: { type: Number },
    loading: { type: Boolean, reflect: true },
    disabled: { type: Boolean, reflect: true },
  };

  static styles = css`
    :host {
      display: block;
    }

    .sentinel {
      /* Invisible, sits below the slot content */
    }

    .spinner {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: var(--sm-spacing-medium);
      color: var(--sm-color-neutral-500);
    }

    .spinner svg {
      width: 1.5rem;
      height: 1.5rem;
      animation: spin 0.75s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `;

  constructor() {
    super();
    this.distance = 0;
    this.loading = false;
    this.disabled = false;
  }

  #observer = null;
  #sentinel = null;

  connectedCallback() {
    super.connectedCallback();
    this.updateComplete.then(() => this.#setupObserver());
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.#observer?.disconnect();
    this.#observer = null;
  }

  #setupObserver() {
    this.#sentinel = this.shadowRoot.querySelector('.sentinel');
    if (!this.#sentinel) return;

    this.#observer?.disconnect();

    const rootMargin = this.distance > 0 ? `0px 0px ${this.distance}px 0px` : '0px';

    this.#observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && !this.loading && !this.disabled) {
          this.dispatchEvent(
            new CustomEvent('sm-load-more', { bubbles: true, composed: true }),
          );
        }
      },
      { rootMargin },
    );

    this.#observer.observe(this.#sentinel);
  }

  updated(changedProps) {
    if (changedProps.has('distance')) {
      this.#setupObserver();
    }
  }

  render() {
    return html`
      <slot></slot>
      ${this.loading
        ? html`<div class="spinner" aria-label="Loading" aria-live="polite">${iconSpinner()}</div>`
        : ''}
      <div class="sentinel" aria-hidden="true"></div>
    `;
  }
}

customElements.define('sm-infinite-scroll', SmInfiniteScroll);
