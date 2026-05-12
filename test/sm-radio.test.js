import { fixture, expect, html, elementUpdated, oneEvent } from '@open-wc/testing';
import '../src/components/sm-radio.js';

describe('sm-radio', () => {
  it('renders', async () => {
    const el = await fixture(html`<sm-radio>Option A</sm-radio>`);
    expect(el.shadowRoot).to.exist;
  });

  it('defaults checked to false', () => {
    const el = document.createElement('sm-radio');
    expect(el.checked).to.be.false;
  });

  it('defaults disabled to false', () => {
    const el = document.createElement('sm-radio');
    expect(el.disabled).to.be.false;
  });

  it('checked attribute reflects to property', async () => {
    const el = await fixture(html`<sm-radio checked>Option</sm-radio>`);
    expect(el.checked).to.be.true;
    expect(el.hasAttribute('checked')).to.be.true;
  });

  it('setting checked property reflects to attribute', async () => {
    const el = await fixture(html`<sm-radio>Option</sm-radio>`);
    el.checked = true;
    await elementUpdated(el);
    expect(el.hasAttribute('checked')).to.be.true;
  });

  it('disabled attribute reflects to property', async () => {
    const el = await fixture(html`<sm-radio disabled>Option</sm-radio>`);
    expect(el.disabled).to.be.true;
    expect(el.hasAttribute('disabled')).to.be.true;
  });

  it('slot content renders as label text', async () => {
    const el = await fixture(html`<sm-radio>My Option</sm-radio>`);
    const labelText = el.shadowRoot.querySelector('.radio__label-text');
    expect(labelText).to.exist;
    // slot content is projected, check the slot exists
    const slot = el.shadowRoot.querySelector('slot');
    expect(slot).to.exist;
  });

  it('dispatches sm-change when clicked and not disabled', async () => {
    const el = await fixture(html`<sm-radio value="a">Option A</sm-radio>`);
    const label = el.shadowRoot.querySelector('.radio__label');
    const changeEvent = oneEvent(el, 'sm-change');
    label.click();
    await changeEvent;
    expect(el.checked).to.be.true;
  });

  it('disabled radio does not change checked on click', async () => {
    const el = await fixture(html`<sm-radio disabled>Option</sm-radio>`);
    const label = el.shadowRoot.querySelector('.radio__label');
    label.click();
    await elementUpdated(el);
    expect(el.checked).to.be.false;
  });

  it('disabled radio does not dispatch sm-change on click', async () => {
    const el = await fixture(html`<sm-radio disabled>Option</sm-radio>`);
    let fired = false;
    el.addEventListener('sm-change', () => { fired = true; });
    const label = el.shadowRoot.querySelector('.radio__label');
    label.click();
    await elementUpdated(el);
    expect(fired).to.be.false;
  });
});
