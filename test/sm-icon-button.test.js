import { fixture, expect, html, elementUpdated } from '@open-wc/testing';
import '../src/components/sm-icon-button.js';

describe('sm-icon-button', () => {
  it('renders; shadow root exists', async () => {
    const el = await fixture(html`<sm-icon-button label="Action"></sm-icon-button>`);
    expect(el.shadowRoot).to.exist;
  });

  it('defaults: variant=default, size=medium', () => {
    const el = document.createElement('sm-icon-button');
    expect(el.variant).to.equal('default');
    expect(el.size).to.equal('medium');
  });

  it('label attribute sets aria-label on inner button', async () => {
    const el = await fixture(html`<sm-icon-button label="Close dialog"></sm-icon-button>`);
    const btn = el.shadowRoot.querySelector('button');
    expect(btn).to.exist;
    expect(btn.getAttribute('aria-label')).to.equal('Close dialog');
  });

  it('renders a button in shadow root', async () => {
    const el = await fixture(html`<sm-icon-button label="Action"></sm-icon-button>`);
    const btn = el.shadowRoot.querySelector('button');
    expect(btn).to.exist;
    expect(el.shadowRoot.querySelector('a')).to.not.exist;
  });

  it('href causes anchor rendering', async () => {
    const el = await fixture(html`<sm-icon-button label="Go" href="https://example.com"></sm-icon-button>`);
    const anchor = el.shadowRoot.querySelector('a');
    expect(anchor).to.exist;
    expect(el.shadowRoot.querySelector('button')).to.not.exist;
  });

  it('disabled reflects', async () => {
    const el = await fixture(html`<sm-icon-button label="Action" disabled></sm-icon-button>`);
    expect(el.disabled).to.be.true;
    expect(el.getAttribute('disabled')).to.not.be.null;
    const btn = el.shadowRoot.querySelector('button');
    expect(btn.disabled).to.be.true;
  });
});
