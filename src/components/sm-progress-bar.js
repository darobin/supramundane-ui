
import { LitElement, html, css, nothing } from 'lit';

export class SmProgressBar extends LitElement {
  static properties = {
    value: { type: Number },
    max: { type: Number },
    indeterminate: { type: Boolean, reflect: true },
    label: { type: String },
  };

  static styles = css`
    :host {
      display: block;
    }

    .progress-bar {
      height: var(--sm-progress-bar-height, 4px);
      background-color: var(--sm-color-neutral-200);
      border-radius: var(--sm-border-radius-pill);
      overflow: hidden;
    }

    .progress-bar__fill {
      height: 100%;
      background-color: var(--sm-color-primary-600);
      border-radius: inherit;
      transition: width var(--sm-transition-medium);
      transform-origin: left center;
    }

    :host([indeterminate]) .progress-bar__fill {
      width: 33% !important;
      animation: indeterminate 1.5s ease-in-out infinite;
    }

    @keyframes indeterminate {
      0% {
        transform: translateX(-100%);
      }
      100% {
        transform: translateX(400%);
      }
    }
  `;

  constructor() {
    super();
    this.value = 0;
    this.max = 100;
    this.indeterminate = false;
    this.label = 'Progress';
  }

  render() {
    const pct = this.indeterminate
      ? null
      : Math.min(100, Math.max(0, (this.value / this.max) * 100));

    return html`
      <div
        part="base"
        class="progress-bar"
        role="progressbar"
        aria-label=${this.label}
        aria-valuemin="0"
        aria-valuemax=${this.indeterminate ? nothing : this.max}
        aria-valuenow=${this.indeterminate ? nothing : this.value}
      >
        <div
          part="indicator"
          class="progress-bar__fill"
          style=${pct !== null ? `width: ${pct}%` : ''}
        ></div>
      </div>
    `;
  }
}

customElements.define('sm-progress-bar', SmProgressBar);
