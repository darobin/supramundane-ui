import { fixture, expect, html, elementUpdated, oneEvent } from '@open-wc/testing';
import '../src/components/sm-option.js';

describe('sm-option', () => {
  it('renders; shadow root exists', async () => {
    const el = await fixture(html`<sm-option value="a">Option A</sm-option>`);
    expect(el.shadowRoot).to.exist;
  });

  it('role=option', async () => {
    const el = await fixture(html`<sm-option value="a">Option A</sm-option>`);
    const optionEl = el.shadowRoot.querySelector('[role="option"]');
    expect(optionEl).to.exist;
  });

  it('value attribute', async () => {
    const el = await fixture(html`<sm-option value="my-option">Option</sm-option>`);
    expect(el.value).to.equal('my-option');
  });

  it('disabled attribute reflects', async () => {
    const el = await fixture(html`<sm-option value="a" disabled>Option</sm-option>`);
    expect(el.disabled).to.be.true;
    expect(el.getAttribute('disabled')).to.not.be.null;
  });

  it('selected attribute reflects', async () => {
    const el = await fixture(html`<sm-option value="a" selected>Option</sm-option>`);
    expect(el.selected).to.be.true;
    expect(el.getAttribute('selected')).to.not.be.null;
  });

  it('clicking dispatches sm-option-select with {value, label}', async () => {
    const el = await fixture(html`<sm-option value="pick-me">Pick Me</sm-option>`);
    const selectPromise = oneEvent(el, 'sm-option-select');
    el.shadowRoot.querySelector('.option').click();
    const event = await selectPromise;
    expect(event.detail.value).to.equal('pick-me');
    expect(event.detail.label).to.equal('Pick Me');
  });

  it('disabled item does not dispatch sm-option-select', async () => {
    const el = await fixture(html`<sm-option value="d" disabled>Disabled</sm-option>`);
    let fired = false;
    el.addEventListener('sm-option-select', () => { fired = true; });
    el.shadowRoot.querySelector('.option').click();
    await elementUpdated(el);
    expect(fired).to.be.false;
  });
});
