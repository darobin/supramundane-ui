
import { LitElement, html, css } from 'lit';
import { iconUser } from '../icons/index.js';

export class SmAvatar extends LitElement {
  static properties = {
    image: { type: String },
    label: { type: String },
    initials: { type: String },
    shape: { type: String, reflect: true },
    size: { type: String, reflect: true },
    _imageError: { type: Boolean, state: true },
  };

  static styles = css`
    :host {
      display: inline-block;
    }

    :host([size='small']) {
      --size: 1.875rem;
    }

    :host([size='medium']),
    :host(:not([size])) {
      --size: 2.5rem;
    }

    :host([size='large']) {
      --size: 3.75rem;
    }

    .avatar {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: var(--size);
      height: var(--size);
      background-color: var(--sm-color-neutral-200);
      color: var(--sm-color-neutral-700);
      overflow: hidden;
      user-select: none;
      font-family: var(--sm-font-sans);
      font-weight: var(--sm-font-weight-semibold);
      font-size: calc(var(--size) * 0.4);
    }

    :host([shape='circle']) .avatar,
    :host(:not([shape])) .avatar {
      border-radius: var(--sm-border-radius-circle);
    }

    :host([shape='square']) .avatar {
      border-radius: 0;
    }

    :host([shape='rounded']) .avatar {
      border-radius: var(--sm-border-radius-large);
    }

    .avatar__image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .avatar__icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 60%;
      height: 60%;
    }

    .avatar__icon svg {
      width: 100%;
      height: 100%;
    }
  `;

  constructor() {
    super();
    this.shape = 'circle';
    this.size = 'medium';
    this._imageError = false;
  }

  #handleImageError() {
    this._imageError = true;
  }

  #renderContent() {
    if (this.image && !this._imageError) {
      return html`<img
        class="avatar__image"
        src=${this.image}
        alt=${this.label || ''}
        @error=${this.#handleImageError}
      />`;
    }
    if (this.initials) {
      return html`<span aria-hidden="true">${this.initials}</span>`;
    }
    return html`<span class="avatar__icon" aria-hidden="true">${iconUser()}</span>`;
  }

  render() {
    return html`
      <div
        part="base"
        class="avatar"
        role="img"
        aria-label=${this.label || this.initials || 'Avatar'}
      >
        ${this.#renderContent()}
      </div>
    `;
  }
}

customElements.define('sm-avatar', SmAvatar);
