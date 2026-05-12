import { fixture, expect, html, elementUpdated } from '@open-wc/testing';
import '../src/components/sm-breadcrumb.js';
import '../src/components/sm-breadcrumb-item.js';

describe('sm-breadcrumb', () => {
  it('renders', async () => {
    const el = await fixture(html`<sm-breadcrumb></sm-breadcrumb>`);
    expect(el.shadowRoot).to.exist;
  });

  it('contains a nav element', async () => {
    const el = await fixture(html`<sm-breadcrumb></sm-breadcrumb>`);
    const nav = el.shadowRoot.querySelector('nav');
    expect(nav).to.exist;
  });

  it('nav has an aria-label', async () => {
    const el = await fixture(html`<sm-breadcrumb label="Site navigation"></sm-breadcrumb>`);
    const nav = el.shadowRoot.querySelector('nav');
    expect(nav.getAttribute('aria-label')).to.equal('Site navigation');
  });

  it('nav defaults to aria-label="Breadcrumb"', async () => {
    const el = await fixture(html`<sm-breadcrumb></sm-breadcrumb>`);
    const nav = el.shadowRoot.querySelector('nav');
    expect(nav.getAttribute('aria-label')).to.equal('Breadcrumb');
  });

  it('last sm-breadcrumb-item gets current=true after render', async () => {
    const el = await fixture(html`
      <sm-breadcrumb>
        <sm-breadcrumb-item href="/">Home</sm-breadcrumb-item>
        <sm-breadcrumb-item href="/section">Section</sm-breadcrumb-item>
        <sm-breadcrumb-item>Current Page</sm-breadcrumb-item>
      </sm-breadcrumb>
    `);
    await elementUpdated(el);
    const items = el.querySelectorAll('sm-breadcrumb-item');
    expect(items[items.length - 1].current).to.be.true;
  });

  it('non-last items get current=false', async () => {
    const el = await fixture(html`
      <sm-breadcrumb>
        <sm-breadcrumb-item href="/">Home</sm-breadcrumb-item>
        <sm-breadcrumb-item href="/section">Section</sm-breadcrumb-item>
        <sm-breadcrumb-item>Current Page</sm-breadcrumb-item>
      </sm-breadcrumb>
    `);
    await elementUpdated(el);
    const items = el.querySelectorAll('sm-breadcrumb-item');
    expect(items[0].current).to.be.false;
    expect(items[1].current).to.be.false;
  });
});
