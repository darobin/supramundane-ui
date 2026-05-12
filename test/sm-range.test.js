import { fixture, expect, html, elementUpdated, oneEvent } from '@open-wc/testing';
import '../src/components/sm-range.js';

describe('sm-range', () => {
  it('renders', async () => {
    const el = await fixture(html`<sm-range></sm-range>`);
    expect(el.shadowRoot).to.exist;
  });

  it('has a native input[type=range] in shadow root', async () => {
    const el = await fixture(html`<sm-range></sm-range>`);
    const input = el.shadowRoot.querySelector('input[type="range"]');
    expect(input).to.exist;
  });

  it('defaults value to 0', () => {
    const el = document.createElement('sm-range');
    expect(el.value).to.equal(0);
  });

  it('defaults min to 0', () => {
    const el = document.createElement('sm-range');
    expect(el.min).to.equal(0);
  });

  it('defaults max to 100', () => {
    const el = document.createElement('sm-range');
    expect(el.max).to.equal(100);
  });

  it('defaults step to 1', () => {
    const el = document.createElement('sm-range');
    expect(el.step).to.equal(1);
  });

  it('value attribute reflects to property', async () => {
    const el = await fixture(html`<sm-range value="50"></sm-range>`);
    expect(el.value).to.equal(50);
  });

  it('min attribute sets native input min', async () => {
    const el = await fixture(html`<sm-range min="10"></sm-range>`);
    const input = el.shadowRoot.querySelector('input[type="range"]');
    expect(Number(input.min)).to.equal(10);
  });

  it('max attribute sets native input max', async () => {
    const el = await fixture(html`<sm-range max="200"></sm-range>`);
    const input = el.shadowRoot.querySelector('input[type="range"]');
    expect(Number(input.max)).to.equal(200);
  });

  it('min and max properties reflect to native input', async () => {
    const el = await fixture(html`<sm-range min="5" max="50"></sm-range>`);
    const input = el.shadowRoot.querySelector('input[type="range"]');
    expect(Number(input.min)).to.equal(5);
    expect(Number(input.max)).to.equal(50);
  });

  it('disabled attribute disables native input', async () => {
    const el = await fixture(html`<sm-range disabled></sm-range>`);
    const input = el.shadowRoot.querySelector('input[type="range"]');
    expect(input.disabled).to.be.true;
  });

  it('dispatches sm-input on native input event', async () => {
    const el = await fixture(html`<sm-range></sm-range>`);
    const input = el.shadowRoot.querySelector('input[type="range"]');
    const smInputEvent = oneEvent(el, 'sm-input');
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await smInputEvent;
  });

  it('dispatches sm-change on native change event', async () => {
    const el = await fixture(html`<sm-range></sm-range>`);
    const input = el.shadowRoot.querySelector('input[type="range"]');
    const smChangeEvent = oneEvent(el, 'sm-change');
    input.dispatchEvent(new Event('change', { bubbles: true }));
    await smChangeEvent;
  });

  it('tooltip=none hides the tooltip element', async () => {
    const el = await fixture(html`<sm-range tooltip="none"></sm-range>`);
    const tooltip = el.shadowRoot.querySelector('.range__tooltip');
    expect(tooltip).to.not.exist;
  });

  it('tooltip=top (default) shows the tooltip element', async () => {
    const el = await fixture(html`<sm-range></sm-range>`);
    const tooltip = el.shadowRoot.querySelector('.range__tooltip');
    expect(tooltip).to.exist;
  });

  it('tooltip=top renders tooltip without bottom modifier class', async () => {
    const el = await fixture(html`<sm-range tooltip="top"></sm-range>`);
    const tooltip = el.shadowRoot.querySelector('.range__tooltip');
    expect(tooltip).to.exist;
    expect(tooltip.classList.contains('range__tooltip--bottom')).to.be.false;
  });
});
