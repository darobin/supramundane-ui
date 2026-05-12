import { fixture, expect, html, elementUpdated, oneEvent } from '@open-wc/testing';
import '../src/components/sm-button.js';

describe('sm-button', () => {
  it('renders; shadow root exists', async () => {
    const el = await fixture(html`<sm-button>Click</sm-button>`);
    expect(el.shadowRoot).to.exist;
  });

  it('defaults: variant=default, size=medium, disabled=false, loading=false', () => {
    const el = document.createElement('sm-button');
    expect(el.variant).to.equal('default');
    expect(el.size).to.equal('medium');
    expect(el.disabled).to.be.false;
    expect(el.loading).to.be.false;
  });

  it('variant attribute reflects', async () => {
    const el = await fixture(html`<sm-button variant="primary">Click</sm-button>`);
    expect(el.variant).to.equal('primary');
    expect(el.getAttribute('variant')).to.equal('primary');
  });

  it('size attribute reflects', async () => {
    const el = await fixture(html`<sm-button size="large">Click</sm-button>`);
    expect(el.size).to.equal('large');
    expect(el.getAttribute('size')).to.equal('large');
  });

  it('renders a button element in shadow root by default', async () => {
    const el = await fixture(html`<sm-button>Click</sm-button>`);
    const btn = el.shadowRoot.querySelector('button');
    expect(btn).to.exist;
    expect(el.shadowRoot.querySelector('a')).to.not.exist;
  });

  it('when href is set, renders an anchor element instead of button', async () => {
    const el = await fixture(html`<sm-button href="https://example.com">Link</sm-button>`);
    const anchor = el.shadowRoot.querySelector('a');
    expect(anchor).to.exist;
    expect(el.shadowRoot.querySelector('button')).to.not.exist;
  });

  it('disabled prevents click events from propagating', async () => {
    const el = await fixture(html`<sm-button disabled>Click</sm-button>`);
    let clicked = false;
    el.addEventListener('click', () => { clicked = true; });
    el.shadowRoot.querySelector('button').click();
    expect(clicked).to.be.false;
  });

  it('loading attribute reflects; shows spinner in shadow root', async () => {
    const el = await fixture(html`<sm-button loading>Click</sm-button>`);
    expect(el.loading).to.be.true;
    expect(el.getAttribute('loading')).to.not.be.null;
    const spinner = el.shadowRoot.querySelector('.button__spinner');
    expect(spinner).to.exist;
  });

  it('pill attribute reflects', async () => {
    const el = await fixture(html`<sm-button pill>Click</sm-button>`);
    expect(el.pill).to.be.true;
    expect(el.getAttribute('pill')).to.not.be.null;
  });

  it('outline attribute reflects', async () => {
    const el = await fixture(html`<sm-button outline variant="primary">Click</sm-button>`);
    expect(el.outline).to.be.true;
    expect(el.getAttribute('outline')).to.not.be.null;
  });

  it('slot content renders', async () => {
    const el = await fixture(html`<sm-button>Hello World</sm-button>`);
    const slot = el.shadowRoot.querySelector('slot:not([name])');
    expect(slot).to.exist;
    const assigned = slot.assignedNodes({ flatten: true });
    const text = assigned.map(n => n.textContent).join('');
    expect(text).to.contain('Hello World');
  });
});
