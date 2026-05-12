
import { LitElement, html, css } from 'lit';
import { iconStar, iconStarFilled } from '../icons/index.js';

export class SmRating extends LitElement {
  static properties = {
    value: { type: Number },
    max: { type: Number },
    precision: { type: Number },
    readonly: { type: Boolean, reflect: true },
    disabled: { type: Boolean, reflect: true },
    label: { type: String },
    _hoverValue: { state: true },
  };

  static styles = css`
    :host {
      display: inline-block;
    }

    :host([disabled]) {
      opacity: 0.5;
    }

    .rating {
      display: inline-flex;
      align-items: center;
      gap: var(--sm-spacing-3x-small);
      outline: none;
    }

    .rating:focus-visible {
      outline: var(--sm-focus-ring);
      outline-offset: var(--sm-focus-ring-offset);
      border-radius: var(--sm-border-radius-small);
    }

    .rating__symbol {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: var(--sm-rating-symbol-size, 1.25rem);
      height: var(--sm-rating-symbol-size, 1.25rem);
      cursor: pointer;
      transition: var(--sm-transition-fast) color, var(--sm-transition-fast) transform;
      position: relative;
    }

    .rating__symbol svg {
      width: 100%;
      height: 100%;
    }

    .rating__symbol--filled {
      color: #f59e0b; /* amber-400 */
    }

    .rating__symbol--half {
      color: var(--sm-color-neutral-300);
      position: relative;
    }

    .rating__symbol--half .rating__symbol-filled-half {
      position: absolute;
      inset: 0;
      overflow: hidden;
      width: 50%;
      color: #f59e0b;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .rating__symbol--half .rating__symbol-filled-half svg,
    .rating__symbol--half .rating__symbol-outline svg {
      width: var(--sm-rating-symbol-size, 1.25rem);
      height: var(--sm-rating-symbol-size, 1.25rem);
    }

    .rating__symbol--half .rating__symbol-outline {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
    }

    .rating__symbol--empty {
      color: var(--sm-color-neutral-300);
    }

    :host(:not([readonly]):not([disabled])) .rating__symbol:hover {
      transform: scale(1.15);
    }

    :host([readonly]) .rating__symbol,
    :host([disabled]) .rating__symbol {
      cursor: default;
    }
  `;

  #hoverValue = null;

  constructor() {
    super();
    this.value = 0;
    this.max = 5;
    this.precision = 1;
    this.readonly = false;
    this.disabled = false;
    this.label = 'Rating';
    this._hoverValue = null;
  }

  #getDisplayValue() {
    return this.#hoverValue !== null ? this.#hoverValue : this.value;
  }

  #getStarState(starIndex) {
    const display = this.#getDisplayValue();
    if (display >= starIndex) return 'filled';
    if (this.precision === 0.5 && display >= starIndex - 0.5) return 'half';
    return 'empty';
  }

  #handleMouseMove(e, starIndex) {
    if (this.readonly || this.disabled) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const half = rect.width / 2;
    if (this.precision === 0.5) {
      this.#hoverValue = x < half ? starIndex - 0.5 : starIndex;
    } else {
      this.#hoverValue = starIndex;
    }
    this._hoverValue = this.#hoverValue;
  }

  #handleMouseLeave() {
    if (this.readonly || this.disabled) return;
    this.#hoverValue = null;
    this._hoverValue = null;
  }

  #handleClick(starIndex, e) {
    if (this.readonly || this.disabled) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const half = rect.width / 2;
    let newValue;
    if (this.precision === 0.5) {
      newValue = x < half ? starIndex - 0.5 : starIndex;
    } else {
      newValue = starIndex;
    }
    this.value = newValue;
    this.dispatchEvent(new CustomEvent('sm-change', {
      detail: { value: this.value },
      bubbles: true,
      composed: true,
    }));
  }

  #handleKeyDown(e) {
    if (this.readonly || this.disabled) return;
    const step = this.precision;
    let newValue = this.value;

    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        e.preventDefault();
        newValue = Math.min(this.max, this.value + step);
        break;
      case 'ArrowLeft':
      case 'ArrowDown':
        e.preventDefault();
        newValue = Math.max(0, this.value - step);
        break;
      case 'Home':
        e.preventDefault();
        newValue = 0;
        break;
      case 'End':
        e.preventDefault();
        newValue = this.max;
        break;
      default:
        return;
    }

    if (newValue !== this.value) {
      this.value = newValue;
      this.dispatchEvent(new CustomEvent('sm-change', {
        detail: { value: this.value },
        bubbles: true,
        composed: true,
      }));
    }
  }

  #renderStar(starIndex) {
    const state = this.#getStarState(starIndex);
    if (state === 'filled') {
      return html`
        <span
          class="rating__symbol rating__symbol--filled"
          @mousemove=${(e) => this.#handleMouseMove(e, starIndex)}
          @click=${(e) => this.#handleClick(starIndex, e)}
        >
          ${iconStarFilled()}
        </span>
      `;
    } else if (state === 'half') {
      return html`
        <span
          class="rating__symbol rating__symbol--half"
          @mousemove=${(e) => this.#handleMouseMove(e, starIndex)}
          @click=${(e) => this.#handleClick(starIndex, e)}
        >
          <span class="rating__symbol-outline">${iconStar()}</span>
          <span class="rating__symbol-filled-half">${iconStarFilled()}</span>
        </span>
      `;
    } else {
      return html`
        <span
          class="rating__symbol rating__symbol--empty"
          @mousemove=${(e) => this.#handleMouseMove(e, starIndex)}
          @click=${(e) => this.#handleClick(starIndex, e)}
        >
          ${iconStar()}
        </span>
      `;
    }
  }

  render() {
    const stars = [];
    for (let i = 1; i <= this.max; i++) {
      stars.push(this.#renderStar(i));
    }

    return html`
      <div
        class="rating"
        role="slider"
        aria-label=${this.label}
        aria-valuenow=${this.value}
        aria-valuemin="0"
        aria-valuemax=${this.max}
        tabindex=${this.disabled ? '-1' : '0'}
        @mouseleave=${this.#handleMouseLeave}
        @keydown=${this.#handleKeyDown}
      >
        ${stars}
      </div>
    `;
  }
}

customElements.define('sm-rating', SmRating);
