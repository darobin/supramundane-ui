import { fixture, expect, html, elementUpdated, oneEvent } from '@open-wc/testing';
import '../src/components/sm-checkbox.js';

describe('sm-checkbox', () => {
  it('renders', async () => {
    const el = await fixture(html`<sm-checkbox>Label</sm-checkbox>`);
    expect(el.shadowRoot).to.exist;
  });

  it('defaults to unchecked', () => {
    const el = document.createElement('sm-checkbox');
    expect(el.checked).to.be.false;
  });

  it('defaults indeterminate to false', () => {
    const el = document.createElement('sm-checkbox');
    expect(el.indeterminate).to.be.false;
  });

  it('defaults disabled to false', () => {
    const el = document.createElement('sm-checkbox');
    expect(el.disabled).to.be.false;
  });

  it('defaults size to medium', () => {
    const el = document.createElement('sm-checkbox');
    expect(el.size).to.equal('medium');
  });

  it('reflects checked attribute to property', async () => {
    const el = await fixture(html`<sm-checkbox checked></sm-checkbox>`);
    expect(el.checked).to.be.true;
    expect(el.hasAttribute('checked')).to.be.true;
  });

  it('reflects checked property to attribute', async () => {
    const el = await fixture(html`<sm-checkbox></sm-checkbox>`);
    el.checked = true;
    await elementUpdated(el);
    expect(el.hasAttribute('checked')).to.be.true;
  });

  it('reflects indeterminate attribute to property', async () => {
    const el = await fixture(html`<sm-checkbox indeterminate></sm-checkbox>`);
    expect(el.indeterminate).to.be.true;
  });

  it('reflects indeterminate property to attribute', async () => {
    const el = await fixture(html`<sm-checkbox></sm-checkbox>`);
    el.indeterminate = true;
    await elementUpdated(el);
    expect(el.hasAttribute('indeterminate')).to.be.true;
  });

  it('disabled prevents click from toggling checked', async () => {
    const el = await fixture(html`<sm-checkbox disabled></sm-checkbox>`);
    const input = el.shadowRoot.querySelector('.checkbox__input');
    input.click();
    await elementUpdated(el);
    expect(el.checked).to.be.false;
  });

  it('clicking the label area toggles checked', async () => {
    const el = await fixture(html`<sm-checkbox>Test</sm-checkbox>`);
    const label = el.shadowRoot.querySelector('.checkbox__label');
    const input = el.shadowRoot.querySelector('.checkbox__input');
    // Simulate clicking the native input (label click delegates to input)
    input.click();
    await elementUpdated(el);
    expect(el.checked).to.be.true;
  });

  it('dispatches sm-change on toggle', async () => {
    const el = await fixture(html`<sm-checkbox>Test</sm-checkbox>`);
    const input = el.shadowRoot.querySelector('.checkbox__input');
    const changeEvent = oneEvent(el, 'sm-change');
    input.click();
    await changeEvent;
    expect(el.checked).to.be.true;
  });

  it('sm-change event fires with updated checked state', async () => {
    const el = await fixture(html`<sm-checkbox>Test</sm-checkbox>`);
    const input = el.shadowRoot.querySelector('.checkbox__input');
    let captured = null;
    el.addEventListener('sm-change', (e) => { captured = e; });
    input.click();
    await elementUpdated(el);
    expect(captured).to.exist;
    expect(el.checked).to.be.true;
  });

  it('reflects size attribute', async () => {
    const el = await fixture(html`<sm-checkbox size="large"></sm-checkbox>`);
    expect(el.size).to.equal('large');
    expect(el.getAttribute('size')).to.equal('large');
  });

  it('form participation: clicking to check contributes value to FormData', async () => {
    const form = await fixture(html`
      <form>
        <sm-checkbox name="agree"></sm-checkbox>
      </form>
    `);
    const cb = form.querySelector('sm-checkbox');
    const input = cb.shadowRoot.querySelector('.checkbox__input');
    input.click();
    await elementUpdated(cb);
    const data = new FormData(form);
    expect(data.get('agree')).to.equal('on');
  });

  it('form participation: unchecked checkbox does not contribute to FormData', async () => {
    const form = await fixture(html`
      <form>
        <sm-checkbox name="agree"></sm-checkbox>
      </form>
    `);
    const cb = form.querySelector('sm-checkbox');
    await elementUpdated(cb);
    const data = new FormData(form);
    expect(data.get('agree')).to.be.null;
  });
});
