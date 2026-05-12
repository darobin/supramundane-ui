import { fixture, expect, html, elementUpdated, oneEvent } from '@open-wc/testing';
import '../src/components/sm-drawer.js';

describe('sm-drawer', () => {
  it('renders; shadow root exists', async () => {
    const el = await fixture(html`<sm-drawer></sm-drawer>`);
    expect(el.shadowRoot).to.exist;
  });

  it('open=false by default', () => {
    const el = document.createElement('sm-drawer');
    expect(el.open).to.be.false;
  });

  it('placement=end by default', () => {
    const el = document.createElement('sm-drawer');
    expect(el.placement).to.equal('end');
  });

  it('calling show() opens; calling hide() closes', async () => {
    const el = await fixture(html`<sm-drawer label="Test"></sm-drawer>`);
    el.show();
    await elementUpdated(el);
    expect(el.open).to.be.true;
    el.hide();
    await elementUpdated(el);
    expect(el.open).to.be.false;
  });

  it('placement attribute reflects (top)', async () => {
    const el = await fixture(html`<sm-drawer placement="top"></sm-drawer>`);
    expect(el.placement).to.equal('top');
    expect(el.getAttribute('placement')).to.equal('top');
  });

  it('placement attribute reflects (bottom)', async () => {
    const el = await fixture(html`<sm-drawer placement="bottom"></sm-drawer>`);
    expect(el.placement).to.equal('bottom');
    expect(el.getAttribute('placement')).to.equal('bottom');
  });

  it('placement attribute reflects (start)', async () => {
    const el = await fixture(html`<sm-drawer placement="start"></sm-drawer>`);
    expect(el.placement).to.equal('start');
    expect(el.getAttribute('placement')).to.equal('start');
  });

  it('placement attribute reflects (end)', async () => {
    const el = await fixture(html`<sm-drawer placement="end"></sm-drawer>`);
    expect(el.placement).to.equal('end');
    expect(el.getAttribute('placement')).to.equal('end');
  });

  it('label attribute reflected', async () => {
    const el = await fixture(html`<sm-drawer label="My Drawer"></sm-drawer>`);
    expect(el.label).to.equal('My Drawer');
    const labelEl = el.shadowRoot.querySelector('.drawer__label');
    expect(labelEl.textContent.trim()).to.equal('My Drawer');
  });

  it('dispatches sm-show when opened', async () => {
    const el = await fixture(html`<sm-drawer label="Test"></sm-drawer>`);
    const showPromise = oneEvent(el, 'sm-show');
    el.show();
    const event = await showPromise;
    expect(event.type).to.equal('sm-show');
  });

  it('dispatches sm-hide when closed', async () => {
    const el = await fixture(html`<sm-drawer label="Test"></sm-drawer>`);
    el.show();
    await elementUpdated(el);
    const hidePromise = oneEvent(el, 'sm-hide');
    el.hide();
    const event = await hidePromise;
    expect(event.type).to.equal('sm-hide');
  });
});
