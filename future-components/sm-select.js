
import { LitElement, html, css, nothing } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { iconChevronDown, iconX } from '../icons.js';

export class SmSelect extends LitElement {
  static formAssociated = true;

  static properties = {
    name: { type: String },
    value: { type: String },
    multiple: { type: Boolean, reflect: true },
    size: { type: String, reflect: true },
    placeholder: { type: String },
    disabled: { type: Boolean, reflect: true },
    clearable: { type: Boolean, reflect: true },
    required: { type: Boolean, reflect: true },
    maxOptionsVisible: { type: Number, attribute: 'max-options-visible' },
    _open: { state: true },
    _displayLabel: { state: true },
    _selectedValues: { state: true },
  };

  static styles = css`
    :host {
      display: block;
    }

    .select {
      position: relative;
    }

    .select__trigger {
      display: flex;
      align-items: center;
      width: 100%;
      padding: 0 var(--sm-input-spacing-medium);
      gap: var(--sm-spacing-x-small);
      border: var(--sm-input-border-width) solid var(--sm-input-border-color);
      border-radius: var(--sm-border-radius-medium);
      background: var(--sm-input-background-color);
      color: var(--sm-input-color);
      font-family: var(--sm-input-font-family);
      cursor: pointer;
      text-align: left;
      transition:
        var(--sm-transition-fast) border-color,
        var(--sm-transition-fast) box-shadow;
      -webkit-appearance: none;
    }

    .select__trigger:hover:not(:disabled) {
      border-color: var(--sm-input-border-color-hover);
    }

    .select__trigger:focus-visible {
      outline: var(--sm-focus-ring);
      outline-offset: var(--sm-focus-ring-offset);
      border-color: var(--sm-input-border-color-focus);
    }

    :host(:not([disabled])) .select--open .select__trigger {
      border-color: var(--sm-input-border-color-focus);
    }

    .select__trigger:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      background: var(--sm-input-background-color-disabled);
    }

    /* Sizes */
    :host([size="small"]) .select__trigger,
    :host(:not([size])) .select__trigger {
      height: var(--sm-input-height-small);
      font-size: var(--sm-input-font-size-small);
      padding: 0 var(--sm-input-spacing-small);
    }

    :host([size="medium"]) .select__trigger {
      height: var(--sm-input-height-medium);
      font-size: var(--sm-input-font-size-medium);
      padding: 0 var(--sm-input-spacing-medium);
    }

    :host([size="large"]) .select__trigger {
      height: var(--sm-input-height-large);
      font-size: var(--sm-input-font-size-large);
      padding: 0 var(--sm-input-spacing-large);
    }

    .select__value {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .select__placeholder {
      color: var(--sm-input-placeholder-color);
    }

    .select__tags {
      display: flex;
      flex-wrap: wrap;
      gap: var(--sm-spacing-2x-small);
      flex: 1;
      overflow: hidden;
    }

    .select__tag {
      display: inline-flex;
      align-items: center;
      gap: var(--sm-spacing-2x-small);
      padding: 0 var(--sm-spacing-x-small);
      height: 1.375rem;
      background: var(--sm-color-accent-100);
      color: var(--sm-color-accent-700);
      border-radius: var(--sm-border-radius-small);
      font-size: var(--sm-font-size-x-small);
      font-weight: var(--sm-font-weight-semibold);
      white-space: nowrap;
    }

    .select__tag-remove {
      display: inline-flex;
      border: none;
      background: none;
      padding: 0;
      cursor: pointer;
      color: inherit;
      opacity: 0.7;
      line-height: 1;
    }

    .select__tag-remove:hover {
      opacity: 1;
    }

    .select__tag-remove svg {
      width: 0.75rem;
      height: 0.75rem;
    }

    .select__tags-more {
      font-size: var(--sm-font-size-x-small);
      color: var(--sm-color-neutral-500);
      white-space: nowrap;
      align-self: center;
    }

    .select__icon {
      flex-shrink: 0;
      display: flex;
      align-items: center;
      color: var(--sm-input-icon-color);
      transition: transform var(--sm-transition-fast);
    }

    .select__icon svg {
      width: 1rem;
      height: 1rem;
    }

    .select--open .select__icon {
      transform: rotate(180deg);
    }

    .select__clear {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border: none;
      background: none;
      padding: 0;
      cursor: pointer;
      color: var(--sm-input-icon-color);
      flex-shrink: 0;
    }

    .select__clear:hover {
      color: var(--sm-input-icon-color-hover);
    }

    .select__clear svg {
      width: 0.875rem;
      height: 0.875rem;
    }

    .select__dropdown {
      position: fixed;
      z-index: var(--sm-z-index-dropdown);
      background: var(--sm-panel-background-color);
      border: var(--sm-panel-border-width) solid var(--sm-panel-border-color);
      border-radius: var(--sm-border-radius-medium);
      box-shadow: var(--sm-shadow-large);
      overflow-y: auto;
      max-height: 20rem;
      padding: var(--sm-spacing-2x-small) 0;
    }
  `;

  #internals;
  #dropdownX = 0;
  #dropdownY = 0;
  #dropdownWidth = 0;

  constructor() {
    super();
    this.#internals = this.attachInternals();
    this.name = '';
    this.value = '';
    this.multiple = false;
    this.size = 'medium';
    this.placeholder = 'Select an option';
    this.disabled = false;
    this.clearable = false;
    this.required = false;
    this.maxOptionsVisible = 3;
    this._open = false;
    this._displayLabel = '';
    this._selectedValues = [];
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('sm-option-select', this.#handleOptionSelect);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('sm-option-select', this.#handleOptionSelect);
    document.removeEventListener('pointerdown', this.#handleOutsideClick);
    document.removeEventListener('keydown', this.#handleKeyDown);
  }

  get #options() {
    return [...this.querySelectorAll('sm-option')];
  }

  #syncOptions() {
    const vals = this.multiple ? this._selectedValues : [this.value];
    this.#options.forEach(opt => {
      opt.selected = vals.includes(opt.value);
    });
    this.#internals.setFormValue(this.value);
  }

  #updateDisplayLabel() {
    if (this.multiple) {
      this._selectedValues = this.#options.filter(o => o.selected).map(o => o.value);
    } else {
      const selected = this.#options.find(o => o.value === this.value);
      this._displayLabel = selected ? (selected.textContent?.trim() || selected.value) : '';
    }
  }

  updated(changed) {
    if (changed.has('value') || changed.has('_open')) {
      this.#syncOptions();
      this.#updateDisplayLabel();
    }
  }

  #handleOptionSelect = (e) => {
    const option = e.target;
    if (this.multiple) {
      const vals = new Set(this._selectedValues);
      if (vals.has(option.value)) {
        vals.delete(option.value);
      } else {
        vals.add(option.value);
      }
      this._selectedValues = [...vals];
      this.value = this._selectedValues.join(',');
      this.#syncOptions();
      this.#updateDisplayLabel();
    } else {
      this.value = option.value;
      this._displayLabel = option.textContent?.trim() || option.value;
      this.#closeDropdown();
    }
    this.dispatchEvent(new CustomEvent('sm-change', {
      detail: { value: this.value },
      bubbles: true,
      composed: true,
    }));
    this.#internals.setFormValue(this.value);
  };

  #openDropdown() {
    if (this.disabled) return;
    const trigger = this.shadowRoot?.querySelector('.select__trigger');
    if (trigger) {
      const rect = trigger.getBoundingClientRect();
      this.#dropdownX = rect.left;
      this.#dropdownY = rect.bottom + 4;
      this.#dropdownWidth = rect.width;
    }
    this._open = true;
    document.addEventListener('pointerdown', this.#handleOutsideClick);
    document.addEventListener('keydown', this.#handleKeyDown);
  }

  #closeDropdown() {
    this._open = false;
    document.removeEventListener('pointerdown', this.#handleOutsideClick);
    document.removeEventListener('keydown', this.#handleKeyDown);
  }

  #toggleDropdown() {
    this._open ? this.#closeDropdown() : this.#openDropdown();
  }

  #handleOutsideClick = (e) => {
    if (!this.contains(e.target) && !this.shadowRoot?.contains(e.target)) {
      this.#closeDropdown();
    }
  };

  #handleKeyDown = (e) => {
    if (!this._open) return;
    const options = this.#options.filter(o => !o.disabled);
    const focused = options.findIndex(o => o === document.activeElement || o.matches(':focus'));

    if (e.key === 'Escape') {
      e.preventDefault();
      this.#closeDropdown();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = options[focused + 1] ?? options[0];
      next?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prev = options[focused - 1] ?? options[options.length - 1];
      prev?.focus();
    } else if (e.key === 'Enter' || e.key === ' ') {
      if (focused >= 0) {
        e.preventDefault();
        options[focused]?.click();
      }
    }
  };

  #handleClear(e) {
    e.stopPropagation();
    this.value = '';
    this._selectedValues = [];
    this._displayLabel = '';
    this.#syncOptions();
    this.#internals.setFormValue('');
    this.dispatchEvent(new CustomEvent('sm-change', {
      detail: { value: '' },
      bubbles: true,
      composed: true,
    }));
  }

  #removeTag(e, val) {
    e.stopPropagation();
    this._selectedValues = this._selectedValues.filter(v => v !== val);
    this.value = this._selectedValues.join(',');
    this.#syncOptions();
    this.#internals.setFormValue(this.value);
    this.dispatchEvent(new CustomEvent('sm-change', {
      detail: { value: this.value },
      bubbles: true,
      composed: true,
    }));
  }

  #handleSlotChange() {
    this.#syncOptions();
    this.#updateDisplayLabel();
  }

  #renderTags() {
    const opts = this.#options.filter(o => this._selectedValues.includes(o.value));
    const visible = opts.slice(0, this.maxOptionsVisible);
    const overflow = opts.length - visible.length;
    return html`
      <div class="select__tags">
        ${visible.map(opt => html`
          <span class="select__tag">
            ${opt.textContent?.trim() || opt.value}
            <button
              class="select__tag-remove"
              aria-label="Remove ${opt.textContent?.trim() || opt.value}"
              @click=${(e) => this.#removeTag(e, opt.value)}
              tabindex="-1"
            >${iconX()}</button>
          </span>
        `)}
        ${overflow > 0 ? html`<span class="select__tags-more">+${overflow} more</span>` : nothing}
      </div>
    `;
  }

  render() {
    const hasValue = this.multiple ? this._selectedValues.length > 0 : !!this.value;
    return html`
      <div class=${classMap({ select: true, 'select--open': this._open })}>
        <button
          class="select__trigger"
          part="trigger"
          ?disabled=${this.disabled}
          aria-haspopup="listbox"
          aria-expanded=${this._open ? 'true' : 'false'}
          @click=${this.#toggleDropdown}
        >
          <span class="select__value">
            ${this.multiple
              ? (this._selectedValues.length > 0
                  ? this.#renderTags()
                  : html`<span class="select__placeholder">${this.placeholder}</span>`)
              : (this.value
                  ? html`${this._displayLabel}`
                  : html`<span class="select__placeholder">${this.placeholder}</span>`)}
          </span>
          ${this.clearable && hasValue ? html`
            <button class="select__clear" aria-label="Clear" @click=${this.#handleClear} tabindex="-1">
              ${iconX()}
            </button>
          ` : nothing}
          <span class="select__icon" aria-hidden="true">${iconChevronDown()}</span>
        </button>

        ${this._open ? html`
          <div
            class="select__dropdown"
            part="listbox"
            role="listbox"
            aria-multiselectable=${this.multiple ? 'true' : 'false'}
            style="left:${this.#dropdownX}px;top:${this.#dropdownY}px;width:${this.#dropdownWidth}px;"
          >
            <slot @slotchange=${this.#handleSlotChange}></slot>
          </div>
        ` : html`<slot @slotchange=${this.#handleSlotChange} style="display:none"></slot>`}
      </div>
    `;
  }
}

customElements.define('sm-select', SmSelect);
