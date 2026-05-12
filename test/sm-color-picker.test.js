import { fixture, expect, html, elementUpdated, oneEvent } from '@open-wc/testing';
import '../src/components/sm-color-picker.js';

describe('sm-color-picker', () => {
  it('renders', async () => {
    const el = await fixture(html`<sm-color-picker></sm-color-picker>`);
    expect(el.shadowRoot).to.exist;
  });

  it('default value is a valid hex color', () => {
    const el = document.createElement('sm-color-picker');
    expect(el.value).to.match(/^#[0-9a-fA-F]{6}([0-9a-fA-F]{2})?$/);
  });

  it('value attribute sets initial color', async () => {
    const el = await fixture(html`<sm-color-picker value="#ff0000"></sm-color-picker>`);
    expect(el.value).to.equal('#ff0000');
  });

  it('hex input exists in shadow root', async () => {
    const el = await fixture(html`<sm-color-picker></sm-color-picker>`);
    const hexInput = el.shadowRoot.querySelector('.color-picker__hex-input');
    expect(hexInput).to.exist;
  });

  it('hex input displays the current color value', async () => {
    const el = await fixture(html`<sm-color-picker value="#336699"></sm-color-picker>`);
    await elementUpdated(el);
    const hexInput = el.shadowRoot.querySelector('.color-picker__hex-input');
    expect(hexInput.value.toLowerCase()).to.equal('#336699');
  });

  it('changing hex input to a valid value updates color and dispatches sm-change', async () => {
    const el = await fixture(html`<sm-color-picker value="#000000"></sm-color-picker>`);
    await elementUpdated(el);
    const hexInput = el.shadowRoot.querySelector('.color-picker__hex-input');
    const changeEvent = oneEvent(el, 'sm-change');
    // Simulate typing a valid hex value
    hexInput.value = '#ff0000';
    hexInput.dispatchEvent(new Event('input', { bubbles: true }));
    const ev = await changeEvent;
    expect(ev.detail).to.have.property('value');
    expect(ev.detail.value.toLowerCase()).to.include('ff');
  });

  it('sm-change event detail has a value property', async () => {
    const el = await fixture(html`<sm-color-picker value="#000000"></sm-color-picker>`);
    await elementUpdated(el);
    const hexInput = el.shadowRoot.querySelector('.color-picker__hex-input');
    const changeEvent = oneEvent(el, 'sm-change');
    hexInput.value = '#00ff00';
    hexInput.dispatchEvent(new Event('input', { bubbles: true }));
    const ev = await changeEvent;
    expect(ev.detail).to.exist;
    expect(ev.detail.value).to.be.a('string');
  });

  it('disabled attribute reflects to property', async () => {
    const el = await fixture(html`<sm-color-picker disabled></sm-color-picker>`);
    expect(el.disabled).to.be.true;
    expect(el.hasAttribute('disabled')).to.be.true;
  });

  it('disabled attribute reflects from property', async () => {
    const el = await fixture(html`<sm-color-picker></sm-color-picker>`);
    el.disabled = true;
    await elementUpdated(el);
    expect(el.hasAttribute('disabled')).to.be.true;
  });

  it('opacity=true shows an alpha slider in shadow root', async () => {
    const el = await fixture(html`<sm-color-picker opacity></sm-color-picker>`);
    await elementUpdated(el);
    const alphaSlider = el.shadowRoot.querySelector('.color-picker__slider-wrapper--alpha');
    expect(alphaSlider).to.exist;
  });

  it('opacity=false (default) does not show alpha slider', async () => {
    const el = await fixture(html`<sm-color-picker></sm-color-picker>`);
    await elementUpdated(el);
    const alphaSlider = el.shadowRoot.querySelector('.color-picker__slider-wrapper--alpha');
    expect(alphaSlider).to.not.exist;
  });

  it('form participation: after a commit, FormData contains the color value', async () => {
    const form = await fixture(html`
      <form>
        <sm-color-picker name="accent" value="#000000"></sm-color-picker>
      </form>
    `);
    const picker = form.querySelector('sm-color-picker');
    await elementUpdated(picker);
    // Trigger a commit by entering a valid hex in the input
    const hexInput = picker.shadowRoot.querySelector('.color-picker__hex-input');
    hexInput.value = '#abcdef';
    hexInput.dispatchEvent(new Event('input', { bubbles: true }));
    await elementUpdated(picker);
    const data = new FormData(form);
    expect(data.get('accent')).to.match(/^#[0-9a-fA-F]{6}$/);
  });
});
