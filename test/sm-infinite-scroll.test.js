import { fixture, expect, html, elementUpdated } from '@open-wc/testing';
import '../src/components/sm-infinite-scroll.js';

describe('sm-infinite-scroll', () => {
  it('renders', async () => {
    const el = await fixture(html`<sm-infinite-scroll></sm-infinite-scroll>`);
    expect(el.shadowRoot).to.exist;
  });

  it('loading is false by default', () => {
    const el = document.createElement('sm-infinite-scroll');
    expect(el.loading).to.be.false;
  });

  it('disabled is false by default', () => {
    const el = document.createElement('sm-infinite-scroll');
    expect(el.disabled).to.be.false;
  });

  it('spinner is not shown when loading=false', async () => {
    const el = await fixture(html`<sm-infinite-scroll></sm-infinite-scroll>`);
    const spinner = el.shadowRoot.querySelector('.spinner');
    expect(spinner).to.not.exist;
  });

  it('spinner is shown when loading=true', async () => {
    const el = await fixture(html`<sm-infinite-scroll loading></sm-infinite-scroll>`);
    const spinner = el.shadowRoot.querySelector('.spinner');
    expect(spinner).to.exist;
  });

  it('spinner appears after loading property is set to true', async () => {
    const el = await fixture(html`<sm-infinite-scroll></sm-infinite-scroll>`);
    expect(el.shadowRoot.querySelector('.spinner')).to.not.exist;
    el.loading = true;
    await elementUpdated(el);
    expect(el.shadowRoot.querySelector('.spinner')).to.exist;
  });
});
