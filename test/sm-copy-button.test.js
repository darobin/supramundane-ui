import { fixture, expect, html, elementUpdated, oneEvent } from '@open-wc/testing';
import '../src/components/sm-copy-button.js';

describe('sm-copy-button', () => {
  beforeEach(() => {
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: async () => {} },
      configurable: true,
      writable: true,
    });
  });

  it('renders', async () => {
    const el = await fixture(html`<sm-copy-button></sm-copy-button>`);
    expect(el.shadowRoot).to.exist;
  });

  it('has a button in the shadow root', async () => {
    const el = await fixture(html`<sm-copy-button></sm-copy-button>`);
    const btn = el.shadowRoot.querySelector('button');
    expect(btn).to.exist;
  });

  it('value attribute is reflected on the property', async () => {
    const el = await fixture(html`<sm-copy-button value="hello world"></sm-copy-button>`);
    expect(el.value).to.equal('hello world');
  });

  it('label attribute sets button label', async () => {
    const el = await fixture(html`<sm-copy-button label="Copy text"></sm-copy-button>`);
    const btn = el.shadowRoot.querySelector('button');
    expect(btn.getAttribute('aria-label')).to.equal('Copy text');
  });

  it('dispatches sm-copy event when clicked', async () => {
    const el = await fixture(html`<sm-copy-button value="test"></sm-copy-button>`);
    const listener = oneEvent(el, 'sm-copy');
    el.shadowRoot.querySelector('button').click();
    const event = await listener;
    expect(event).to.exist;
    expect(event.type).to.equal('sm-copy');
  });

  it('after click, status changes to success and label updates', async () => {
    const el = await fixture(html`<sm-copy-button value="test" success-label="Copied!"></sm-copy-button>`);
    el.shadowRoot.querySelector('button').click();
    await oneEvent(el, 'sm-copy');
    await elementUpdated(el);
    const labelSpan = el.shadowRoot.querySelector('.copy-button__label');
    expect(labelSpan.textContent).to.equal('Copied!');
  });
});
