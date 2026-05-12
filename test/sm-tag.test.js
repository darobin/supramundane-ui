import { fixture, expect, html, elementUpdated, oneEvent } from '@open-wc/testing';
import '../src/components/sm-tag.js';

describe('sm-tag', () => {
  it('renders', async () => {
    const el = await fixture(html`<sm-tag></sm-tag>`);
    expect(el.shadowRoot).to.exist;
  });

  it('defaults to variant=default, size=medium, removable=false, pill=false', () => {
    const el = document.createElement('sm-tag');
    expect(el.variant).to.equal('default');
    expect(el.size).to.equal('medium');
    expect(el.removable).to.be.false;
    expect(el.pill).to.be.false;
  });

  it('variant attribute reflects', async () => {
    const el = await fixture(html`<sm-tag variant="primary"></sm-tag>`);
    expect(el.variant).to.equal('primary');
    expect(el.getAttribute('variant')).to.equal('primary');
  });

  it('removable=true shows close button', async () => {
    const el = await fixture(html`<sm-tag removable></sm-tag>`);
    const btn = el.shadowRoot.querySelector('button.tag__remove');
    expect(btn).to.exist;
  });

  it('removable=false hides close button', async () => {
    const el = await fixture(html`<sm-tag></sm-tag>`);
    const btn = el.shadowRoot.querySelector('button.tag__remove');
    expect(btn).to.not.exist;
  });

  it('clicking close button dispatches sm-remove event', async () => {
    const el = await fixture(html`<sm-tag removable></sm-tag>`);
    const btn = el.shadowRoot.querySelector('button.tag__remove');
    const listener = oneEvent(el, 'sm-remove');
    btn.click();
    const event = await listener;
    expect(event).to.exist;
    expect(event.type).to.equal('sm-remove');
  });

  it('sm-remove event is cancelable', async () => {
    const el = await fixture(html`<sm-tag removable></sm-tag>`);
    const btn = el.shadowRoot.querySelector('button.tag__remove');
    let capturedEvent;
    el.addEventListener('sm-remove', (e) => {
      capturedEvent = e;
      e.preventDefault();
    });
    btn.click();
    await elementUpdated(el);
    expect(capturedEvent).to.exist;
    expect(capturedEvent.cancelable).to.be.true;
    expect(capturedEvent.defaultPrevented).to.be.true;
  });

  it('pill attribute reflects', async () => {
    const el = await fixture(html`<sm-tag pill></sm-tag>`);
    expect(el.pill).to.be.true;
    expect(el.hasAttribute('pill')).to.be.true;
  });

  it('slot content renders', async () => {
    const el = await fixture(html`<sm-tag>My Tag</sm-tag>`);
    expect(el.textContent.trim()).to.equal('My Tag');
  });
});
