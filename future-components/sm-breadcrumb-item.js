
import { LitElement, html, css } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { iconChevronRight } from '../icons.js';

export class SmBreadcrumbItem extends LitElement {
  static properties = {
    href: { type: String },
    target: { type: String },
    rel: { type: String },
    current: { type: Boolean, reflect: true },
  };

  static styles = css`
    :host {
      display: contents;
    }

    .breadcrumb-item {
      display: inline-flex;
      align-items: center;
      gap: var(--sm-spacing-x-small);
      font-family: var(--sm-input-font-family);
      font-size: var(--sm-font-size-small);
    }

    .breadcrumb-item__label {
      display: inline-flex;
      align-items: center;
    }

    .breadcrumb-item__label a {
      color: var(--sm-color-accent-600);
      text-decoration: none;
      transition: var(--sm-transition-fast) color;
    }

    .breadcrumb-item__label a:hover {
      color: var(--sm-color-accent-700);
      text-decoration: underline;
    }

    .breadcrumb-item__label a:focus-visible {
      outline: var(--sm-focus-ring);
      outline-offset: var(--sm-focus-ring-offset);
      border-radius: var(--sm-border-radius-small);
    }

    .breadcrumb-item__label span {
      color: var(--sm-color-neutral-700);
      font-weight: var(--sm-font-weight-semibold);
    }

    .breadcrumb-item__separator {
      display: inline-flex;
      align-items: center;
      color: var(--sm-color-neutral-400);
      font-size: var(--sm-font-size-x-small);
      user-select: none;
    }

    .breadcrumb-item__separator svg {
      width: 1em;
      height: 1em;
    }
  `;

  constructor() {
    super();
    this.href = undefined;
    this.target = undefined;
    this.rel = undefined;
    this.current = false;
  }

  render() {
    const label = this.current
      ? html`<span aria-current="page"><slot></slot></span>`
      : this.href
        ? html`<a href=${ifDefined(this.href)} target=${ifDefined(this.target)} rel=${ifDefined(this.rel)}><slot></slot></a>`
        : html`<span><slot></slot></span>`;

    return html`
      <li class="breadcrumb-item">
        <span class="breadcrumb-item__label">${label}</span>
        ${!this.current ? html`
          <span class="breadcrumb-item__separator" aria-hidden="true">
            <slot name="separator">${iconChevronRight()}</slot>
          </span>
        ` : ''}
      </li>
    `;
  }
}

customElements.define('sm-breadcrumb-item', SmBreadcrumbItem);
