import { fixture, expect, html, elementUpdated } from '@open-wc/testing';
import '../src/components/sm-breadcrumb-item.js';

describe('sm-breadcrumb-item', () => {
  it('renders', async () => {
    const el = await fixture(html`<sm-breadcrumb-item>Home</sm-breadcrumb-item>`);
    expect(el.shadowRoot).to.exist;
  });

  it('default slot content shows', async () => {
    const el = await fixture(html`<sm-breadcrumb-item>Home</sm-breadcrumb-item>`);
    expect(el.textContent.trim()).to.equal('Home');
  });

  it('when href is set, renders an anchor', async () => {
    const el = await fixture(html`<sm-breadcrumb-item href="/home">Home</sm-breadcrumb-item>`);
    const anchor = el.shadowRoot.querySelector('a');
    expect(anchor).to.exist;
    expect(anchor.getAttribute('href')).to.equal('/home');
  });

  it('when current=true, renders a span with aria-current="page" (not an anchor)', async () => {
    const el = await fixture(html`<sm-breadcrumb-item href="/home" current>Home</sm-breadcrumb-item>`);
    const anchor = el.shadowRoot.querySelector('a');
    expect(anchor).to.not.exist;
    const span = el.shadowRoot.querySelector('[aria-current="page"]');
    expect(span).to.exist;
  });

  it('separator is shown when not current', async () => {
    const el = await fixture(html`<sm-breadcrumb-item href="/home">Home</sm-breadcrumb-item>`);
    const separator = el.shadowRoot.querySelector('.breadcrumb-item__separator');
    expect(separator).to.exist;
  });

  it('separator is hidden when current=true', async () => {
    const el = await fixture(html`<sm-breadcrumb-item current>Home</sm-breadcrumb-item>`);
    const separator = el.shadowRoot.querySelector('.breadcrumb-item__separator');
    expect(separator).to.not.exist;
  });
});
