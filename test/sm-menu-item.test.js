import { fixture, expect, html, elementUpdated, oneEvent } from '@open-wc/testing';
import '../src/components/sm-menu-item.js';

describe('sm-menu-item', () => {
  it('renders; shadow root exists', async () => {
    const el = await fixture(html`<sm-menu-item>Item</sm-menu-item>`);
    expect(el.shadowRoot).to.exist;
  });

  it('defaults: type=normal, checked=false, disabled=false', () => {
    const el = document.createElement('sm-menu-item');
    expect(el.type).to.equal('normal');
    expect(el.checked).to.be.false;
    expect(el.disabled).to.be.false;
  });

  it('value attribute', async () => {
    const el = await fixture(html`<sm-menu-item value="my-value">Item</sm-menu-item>`);
    expect(el.value).to.equal('my-value');
  });

  it('clicking fires sm-select (bubbles up)', async () => {
    const el = await fixture(html`<sm-menu-item value="x">Item</sm-menu-item>`);
    const selectPromise = oneEvent(el, 'sm-select');
    el.shadowRoot.querySelector('.menu-item').click();
    const event = await selectPromise;
    expect(event).to.exist;
  });

  it('sm-select detail contains value', async () => {
    const el = await fixture(html`<sm-menu-item value="test-val">Item</sm-menu-item>`);
    const selectPromise = oneEvent(el, 'sm-select');
    el.shadowRoot.querySelector('.menu-item').click();
    const event = await selectPromise;
    expect(event.detail.value).to.equal('test-val');
  });

  it('type=checkbox: clicking toggles checked; sm-select fires', async () => {
    const el = await fixture(html`<sm-menu-item type="checkbox" value="cb">Check me</sm-menu-item>`);
    expect(el.checked).to.be.false;
    const selectPromise = oneEvent(el, 'sm-select');
    el.shadowRoot.querySelector('.menu-item').click();
    await selectPromise;
    expect(el.checked).to.be.true;

    const selectPromise2 = oneEvent(el, 'sm-select');
    el.shadowRoot.querySelector('.menu-item').click();
    await selectPromise2;
    expect(el.checked).to.be.false;
  });

  it('type=radio: clicking sets checked=true; sm-select fires', async () => {
    const el = await fixture(html`<sm-menu-item type="radio" value="r1">Radio</sm-menu-item>`);
    expect(el.checked).to.be.false;
    const selectPromise = oneEvent(el, 'sm-select');
    el.shadowRoot.querySelector('.menu-item').click();
    await selectPromise;
    expect(el.checked).to.be.true;
  });

  it('disabled item does not fire sm-select', async () => {
    const el = await fixture(html`<sm-menu-item value="d" disabled>Disabled</sm-menu-item>`);
    let fired = false;
    el.addEventListener('sm-select', () => { fired = true; });
    el.shadowRoot.querySelector('.menu-item').click();
    await elementUpdated(el);
    expect(fired).to.be.false;
  });
});
