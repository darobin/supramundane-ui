import { fixture, expect, html, elementUpdated, oneEvent } from '@open-wc/testing';
import '../src/components/sm-dialog.js';

describe('sm-dialog', () => {
  it('renders; shadow root exists', async () => {
    const el = await fixture(html`<sm-dialog></sm-dialog>`);
    expect(el.shadowRoot).to.exist;
  });

  it('open=false by default', () => {
    const el = document.createElement('sm-dialog');
    expect(el.open).to.be.false;
  });

  it('calling show() sets open=true and opens the native dialog', async () => {
    const el = await fixture(html`<sm-dialog label="Test"></sm-dialog>`);
    el.show();
    await elementUpdated(el);
    expect(el.open).to.be.true;
    const dialog = el.shadowRoot.querySelector('dialog');
    expect(dialog.open).to.be.true;
  });

  it('calling hide() sets open=false', async () => {
    const el = await fixture(html`<sm-dialog label="Test"></sm-dialog>`);
    el.show();
    await elementUpdated(el);
    el.hide();
    await elementUpdated(el);
    expect(el.open).to.be.false;
  });

  it('label attribute appears in shadow root header', async () => {
    const el = await fixture(html`<sm-dialog label="My Dialog"></sm-dialog>`);
    const labelEl = el.shadowRoot.querySelector('.dialog__label');
    expect(labelEl).to.exist;
    expect(labelEl.textContent.trim()).to.equal('My Dialog');
  });

  it('no-header attribute hides the header area', async () => {
    const el = await fixture(html`<sm-dialog no-header label="Hidden"></sm-dialog>`);
    const header = el.shadowRoot.querySelector('.dialog__header');
    expect(header).to.not.exist;
  });

  it('dispatches sm-show when opened', async () => {
    const el = await fixture(html`<sm-dialog label="Test"></sm-dialog>`);
    const showPromise = oneEvent(el, 'sm-show');
    el.show();
    const event = await showPromise;
    expect(event).to.exist;
    expect(event.type).to.equal('sm-show');
  });

  it('dispatches sm-hide when closed', async () => {
    const el = await fixture(html`<sm-dialog label="Test"></sm-dialog>`);
    el.show();
    await elementUpdated(el);
    const hidePromise = oneEvent(el, 'sm-hide');
    el.hide();
    const event = await hidePromise;
    expect(event).to.exist;
    expect(event.type).to.equal('sm-hide');
  });

  it('has a close button in shadow root header', async () => {
    const el = await fixture(html`<sm-dialog label="Test"></sm-dialog>`);
    const closeBtn = el.shadowRoot.querySelector('.dialog__close');
    expect(closeBtn).to.exist;
  });

  it('Escape key dispatches sm-request-close', async () => {
    const el = await fixture(html`<sm-dialog label="Test"></sm-dialog>`);
    el.show();
    await elementUpdated(el);
    const requestClosePromise = oneEvent(el, 'sm-request-close');
    const dialog = el.shadowRoot.querySelector('dialog');
    dialog.dispatchEvent(new Event('cancel'));
    const event = await requestClosePromise;
    expect(event).to.exist;
    expect(event.type).to.equal('sm-request-close');
  });
});
