
import { LitElement, html, css, nothing } from 'lit';

// ---- Color conversion helpers ----

function hexToRgb(hex) {
  const clean = hex.replace('#', '');
  const full = clean.length === 3
    ? clean.split('').map(c => c + c).join('')
    : clean;
  const n = parseInt(full.slice(0, 6), 16);
  return {
    r: (n >> 16) & 255,
    g: (n >> 8) & 255,
    b: n & 255,
    a: full.length === 8 ? parseInt(full.slice(6, 8), 16) / 255 : 1,
  };
}

function rgbToHsv(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const d = max - min;
  let h = 0, s = max === 0 ? 0 : d / max, v = max;
  if (d !== 0) {
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    else if (max === g) h = ((b - r) / d + 2) / 6;
    else h = ((r - g) / d + 4) / 6;
  }
  return { h: h * 360, s, v };
}

function hsvToRgb(h, s, v) {
  h = h / 360;
  let r, g, b;
  const i = Math.floor(h * 6);
  const f = h * 6 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);
  switch (i % 6) {
    case 0: r = v; g = t; b = p; break;
    case 1: r = q; g = v; b = p; break;
    case 2: r = p; g = v; b = t; break;
    case 3: r = p; g = q; b = v; break;
    case 4: r = t; g = p; b = v; break;
    case 5: r = v; g = p; b = q; break;
  }
  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

function clamp(v, min, max) { return Math.min(max, Math.max(min, v)); }

function componentToHex(c) { return Math.round(c).toString(16).padStart(2, '0'); }

function rgbToHex(r, g, b, a = 1) {
  const hex = '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
  return a < 1 ? hex + componentToHex(a * 255) : hex;
}

function hexToHsv(hex) {
  const { r, g, b, a } = hexToRgb(hex);
  const hsv = rgbToHsv(r, g, b);
  return { ...hsv, a };
}

export class SmColorPicker extends LitElement {
  static formAssociated = true;

  static properties = {
    value: { type: String },
    format: { type: String },
    disabled: { type: Boolean, reflect: true },
    opacity: { type: Boolean, reflect: true },
    swatches: { type: Array },
    _h: { state: true },
    _s: { state: true },
    _v: { state: true },
    _a: { state: true },
    _inputValue: { state: true },
  };

  static styles = css`
    :host {
      display: inline-block;
    }

    .color-picker {
      display: inline-flex;
      flex-direction: column;
      gap: var(--sm-spacing-small);
      padding: var(--sm-spacing-medium);
      background: var(--sm-panel-background-color);
      border: var(--sm-panel-border-width) solid var(--sm-panel-border-color);
      border-radius: var(--sm-border-radius-large);
      box-shadow: var(--sm-shadow-medium);
      font-family: var(--sm-input-font-family);
      user-select: none;
    }

    :host([disabled]) .color-picker {
      opacity: 0.5;
      pointer-events: none;
    }

    /* SV Gradient */
    .color-picker__sv {
      position: relative;
      width: 100%;
      min-width: 200px;
      height: 200px;
      border-radius: var(--sm-border-radius-medium);
      cursor: crosshair;
      touch-action: none;
    }

    .color-picker__sv-white {
      position: absolute;
      inset: 0;
      border-radius: inherit;
      background: linear-gradient(to right, #fff, transparent);
    }

    .color-picker__sv-black {
      position: absolute;
      inset: 0;
      border-radius: inherit;
      background: linear-gradient(to bottom, transparent, #000);
    }

    .color-picker__sv-thumb {
      position: absolute;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      border: 2px solid #fff;
      box-shadow: var(--sm-shadow-small), 0 0 0 1px rgba(0,0,0,0.2);
      transform: translate(-50%, -50%);
      pointer-events: none;
    }

    /* Sliders */
    .color-picker__sliders {
      display: flex;
      flex-direction: column;
      gap: var(--sm-spacing-x-small);
    }

    .color-picker__slider-wrapper {
      position: relative;
      width: 100%;
      height: 12px;
      border-radius: var(--sm-border-radius-pill);
      cursor: pointer;
      touch-action: none;
    }

    .color-picker__hue-track {
      position: absolute;
      inset: 0;
      border-radius: inherit;
      background: linear-gradient(to right,
        hsl(0,100%,50%), hsl(30,100%,50%), hsl(60,100%,50%),
        hsl(90,100%,50%), hsl(120,100%,50%), hsl(150,100%,50%),
        hsl(180,100%,50%), hsl(210,100%,50%), hsl(240,100%,50%),
        hsl(270,100%,50%), hsl(300,100%,50%), hsl(330,100%,50%),
        hsl(360,100%,50%));
    }

    .color-picker__alpha-track {
      position: absolute;
      inset: 0;
      border-radius: inherit;
      background-image:
        linear-gradient(45deg, var(--sm-color-neutral-300) 25%, transparent 25%),
        linear-gradient(-45deg, var(--sm-color-neutral-300) 25%, transparent 25%),
        linear-gradient(45deg, transparent 75%, var(--sm-color-neutral-300) 75%),
        linear-gradient(-45deg, transparent 75%, var(--sm-color-neutral-300) 75%);
      background-size: 8px 8px;
      background-position: 0 0, 0 4px, 4px -4px, -4px 0px;
    }

    .color-picker__alpha-gradient {
      position: absolute;
      inset: 0;
      border-radius: inherit;
    }

    .color-picker__slider-thumb {
      position: absolute;
      width: 18px;
      height: 18px;
      top: 50%;
      border-radius: 50%;
      border: 2px solid #fff;
      box-shadow: var(--sm-shadow-small), 0 0 0 1px rgba(0,0,0,0.2);
      transform: translate(-50%, -50%);
      pointer-events: none;
      background: currentColor;
    }

    /* Input row */
    .color-picker__input-row {
      display: flex;
      align-items: center;
      gap: var(--sm-spacing-x-small);
    }

    .color-picker__preview {
      width: 2rem;
      height: 2rem;
      border-radius: var(--sm-border-radius-medium);
      border: var(--sm-input-border-width) solid var(--sm-input-border-color);
      flex-shrink: 0;
      background-image:
        linear-gradient(45deg, var(--sm-color-neutral-300) 25%, transparent 25%),
        linear-gradient(-45deg, var(--sm-color-neutral-300) 25%, transparent 25%),
        linear-gradient(45deg, transparent 75%, var(--sm-color-neutral-300) 75%),
        linear-gradient(-45deg, transparent 75%, var(--sm-color-neutral-300) 75%);
      background-size: 8px 8px;
      background-position: 0 0, 0 4px, 4px -4px, -4px 0px;
      position: relative;
      overflow: hidden;
    }

    .color-picker__preview-inner {
      position: absolute;
      inset: 0;
    }

    .color-picker__hex-input {
      flex: 1;
      height: var(--sm-input-height-small);
      padding: 0 var(--sm-input-spacing-small);
      border: var(--sm-input-border-width) solid var(--sm-input-border-color);
      border-radius: var(--sm-border-radius-medium);
      background: var(--sm-input-background-color);
      color: var(--sm-input-color);
      font-family: var(--sm-font-mono);
      font-size: var(--sm-font-size-small);
      transition: border-color var(--sm-transition-fast);
    }

    .color-picker__hex-input:hover {
      border-color: var(--sm-input-border-color-hover);
    }

    .color-picker__hex-input:focus {
      outline: var(--sm-focus-ring);
      outline-offset: var(--sm-focus-ring-offset);
      border-color: var(--sm-input-border-color-focus);
    }

    /* Swatches */
    .color-picker__swatches {
      display: flex;
      flex-wrap: wrap;
      gap: var(--sm-spacing-x-small);
      padding-top: var(--sm-spacing-2x-small);
      border-top: var(--sm-panel-border-width) solid var(--sm-panel-border-color);
    }

    .color-picker__swatch {
      width: 1.5rem;
      height: 1.5rem;
      border-radius: var(--sm-border-radius-small);
      border: var(--sm-input-border-width) solid var(--sm-input-border-color);
      cursor: pointer;
      transition: transform var(--sm-transition-fast), box-shadow var(--sm-transition-fast);
    }

    .color-picker__swatch:hover {
      transform: scale(1.15);
      box-shadow: var(--sm-shadow-medium);
    }

    .color-picker__swatch:focus-visible {
      outline: var(--sm-focus-ring);
      outline-offset: var(--sm-focus-ring-offset);
    }
  `;

  #internals;
  #svDragging = false;
  #hueDragging = false;
  #alphaDragging = false;

  constructor() {
    super();
    this.#internals = this.attachInternals();
    this.value = '#000000';
    this.format = 'hex';
    this.disabled = false;
    this.opacity = false;
    this.swatches = [];
    this._h = 0;
    this._s = 0;
    this._v = 0;
    this._a = 1;
    this._inputValue = '#000000';
  }

  updated(changed) {
    if (changed.has('value')) {
      this.#parseValue();
    }
  }

  #parseValue() {
    try {
      const { h, s, v, a } = hexToHsv(this.value);
      this._h = h;
      this._s = s;
      this._v = v;
      this._a = a;
      this._inputValue = this.#formatValue();
    } catch (e) {
      // ignore invalid
    }
  }

  #formatValue() {
    const { r, g, b } = hsvToRgb(this._h, this._s, this._v);
    const a = this._a;
    if (this.format === 'rgb') {
      return a < 1 ? `rgba(${r}, ${g}, ${b}, ${a.toFixed(2)})` : `rgb(${r}, ${g}, ${b})`;
    } else if (this.format === 'hsl') {
      const hsl = this.#hsvToHsl(this._h, this._s, this._v);
      return a < 1
        ? `hsla(${Math.round(hsl.h)}, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%, ${a.toFixed(2)})`
        : `hsl(${Math.round(hsl.h)}, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%)`;
    }
    return rgbToHex(r, g, b, a);
  }

  #hsvToHsl(h, s, v) {
    const l = v * (1 - s / 2);
    const sl = l === 0 || l === 1 ? 0 : (v - l) / Math.min(l, 1 - l);
    return { h, s: sl * 100, l: l * 100 };
  }

  #commit() {
    const formatted = this.#formatValue();
    this.value = this.format === 'hex'
      ? rgbToHex(...Object.values(hsvToRgb(this._h, this._s, this._v)), this._a)
      : formatted;
    this._inputValue = formatted;
    this.#internals.setFormValue(this.value);
    this.dispatchEvent(new CustomEvent('sm-change', {
      detail: { value: formatted },
      bubbles: true,
      composed: true,
    }));
  }

  // SV area drag
  #handleSvPointerDown(e) {
    if (this.disabled) return;
    const el = this.shadowRoot?.querySelector('.color-picker__sv');
    if (!el) return;
    el.setPointerCapture(e.pointerId);
    this.#svDragging = true;
    this.#updateSv(e, el);
  }

  #handleSvPointerMove(e) {
    if (!this.#svDragging) return;
    const el = this.shadowRoot?.querySelector('.color-picker__sv');
    if (el) this.#updateSv(e, el);
  }

  #handleSvPointerUp() {
    this.#svDragging = false;
    this.#commit();
  }

  #updateSv(e, el) {
    const rect = el.getBoundingClientRect();
    this._s = clamp((e.clientX - rect.left) / rect.width, 0, 1);
    this._v = 1 - clamp((e.clientY - rect.top) / rect.height, 0, 1);
    this.requestUpdate();
  }

  // Hue slider drag
  #handleHuePointerDown(e) {
    if (this.disabled) return;
    const el = this.shadowRoot?.querySelector('.color-picker__slider-wrapper--hue');
    if (!el) return;
    el.setPointerCapture(e.pointerId);
    this.#hueDragging = true;
    this.#updateHue(e, el);
  }

  #handleHuePointerMove(e) {
    if (!this.#hueDragging) return;
    const el = this.shadowRoot?.querySelector('.color-picker__slider-wrapper--hue');
    if (el) this.#updateHue(e, el);
  }

  #handleHuePointerUp() {
    this.#hueDragging = false;
    this.#commit();
  }

  #updateHue(e, el) {
    const rect = el.getBoundingClientRect();
    this._h = clamp((e.clientX - rect.left) / rect.width, 0, 1) * 360;
    this.requestUpdate();
  }

  // Alpha slider drag
  #handleAlphaPointerDown(e) {
    if (this.disabled) return;
    const el = this.shadowRoot?.querySelector('.color-picker__slider-wrapper--alpha');
    if (!el) return;
    el.setPointerCapture(e.pointerId);
    this.#alphaDragging = true;
    this.#updateAlpha(e, el);
  }

  #handleAlphaPointerMove(e) {
    if (!this.#alphaDragging) return;
    const el = this.shadowRoot?.querySelector('.color-picker__slider-wrapper--alpha');
    if (el) this.#updateAlpha(e, el);
  }

  #handleAlphaPointerUp() {
    this.#alphaDragging = false;
    this.#commit();
  }

  #updateAlpha(e, el) {
    const rect = el.getBoundingClientRect();
    this._a = clamp((e.clientX - rect.left) / rect.width, 0, 1);
    this.requestUpdate();
  }

  #handleHexInput(e) {
    const val = e.target.value.trim();
    this._inputValue = val;
    if (/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(val)) {
      const { h, s, v, a } = hexToHsv(val);
      this._h = h; this._s = s; this._v = v; this._a = a;
      this.#commit();
    }
  }

  #handleSwatchClick(hex) {
    const { h, s, v } = hexToHsv(hex);
    this._h = h; this._s = s; this._v = v;
    this.#commit();
  }

  render() {
    const { r, g, b } = hsvToRgb(this._h, this._s, this._v);
    const currentColor = `rgba(${r}, ${g}, ${b}, ${this._a})`;
    const hueColor = `hsl(${this._h}, 100%, 50%)`;
    const svBg = hueColor;
    const svThumbX = this._s * 100;
    const svThumbY = (1 - this._v) * 100;
    const hueThumbX = (this._h / 360) * 100;
    const alphaThumbX = this._a * 100;

    return html`
      <div class="color-picker" part="base">
        <!-- SV gradient -->
        <div
          class="color-picker__sv"
          part="sv-container"
          style="background: ${svBg};"
          @pointerdown=${this.#handleSvPointerDown}
          @pointermove=${this.#handleSvPointerMove}
          @pointerup=${this.#handleSvPointerUp}
        >
          <div class="color-picker__sv-white"></div>
          <div class="color-picker__sv-black"></div>
          <div
            class="color-picker__sv-thumb"
            style="left:${svThumbX}%;top:${svThumbY}%;background:${currentColor};"
            part="sv-thumb"
          ></div>
        </div>

        <!-- Sliders -->
        <div class="color-picker__sliders">
          <!-- Hue -->
          <div
            class="color-picker__slider-wrapper color-picker__slider-wrapper--hue"
            part="hue-slider"
            @pointerdown=${this.#handleHuePointerDown}
            @pointermove=${this.#handleHuePointerMove}
            @pointerup=${this.#handleHuePointerUp}
          >
            <div class="color-picker__hue-track"></div>
            <div
              class="color-picker__slider-thumb"
              style="left:${hueThumbX}%;color:${hueColor};"
              part="hue-thumb"
            ></div>
          </div>

          <!-- Alpha -->
          ${this.opacity ? html`
            <div
              class="color-picker__slider-wrapper color-picker__slider-wrapper--alpha"
              part="alpha-slider"
              @pointerdown=${this.#handleAlphaPointerDown}
              @pointermove=${this.#handleAlphaPointerMove}
              @pointerup=${this.#handleAlphaPointerUp}
            >
              <div class="color-picker__alpha-track"></div>
              <div
                class="color-picker__alpha-gradient"
                style="background:linear-gradient(to right, transparent, ${hueColor});"
              ></div>
              <div
                class="color-picker__slider-thumb"
                style="left:${alphaThumbX}%;color:${currentColor};"
                part="alpha-thumb"
              ></div>
            </div>
          ` : nothing}
        </div>

        <!-- Input row -->
        <div class="color-picker__input-row">
          <div class="color-picker__preview" part="preview">
            <div class="color-picker__preview-inner" style="background:${currentColor};"></div>
          </div>
          <input
            class="color-picker__hex-input"
            part="input"
            type="text"
            spellcheck="false"
            .value=${this._inputValue}
            aria-label="Color value"
            @input=${this.#handleHexInput}
            @change=${this.#handleHexInput}
          />
        </div>

        <!-- Swatches -->
        ${this.swatches?.length > 0 ? html`
          <div class="color-picker__swatches" part="swatches">
            ${this.swatches.map(hex => html`
              <div
                class="color-picker__swatch"
                part="swatch"
                style="background:${hex};"
                title="${hex}"
                tabindex="0"
                role="button"
                aria-label="Select color ${hex}"
                @click=${() => this.#handleSwatchClick(hex)}
                @keydown=${(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.#handleSwatchClick(hex);
                  }
                }}
              ></div>
            `)}
          </div>
        ` : nothing}
      </div>
    `;
  }
}

customElements.define('sm-color-picker', SmColorPicker);
