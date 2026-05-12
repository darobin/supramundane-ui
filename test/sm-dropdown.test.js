import { fixture, expect, html, elementUpdated, oneEvent } from '@open-wc/testing';
import '../src/components/sm-dropdown.js';
import '../src/components/sm-button.js';
import '../src/components/sm-menu.js';
import '../src/components/sm-menu-item.js';

describe('sm-dropdown', () => {
  it('renders; shadow root exists', async () => {
    const el = await fixture(html`
      <sm-dropdown>
        <sm-button slot="trigger">Open</sm-button>
        <sm-menu><sm-menu-item value="a">Item A</sm-menu-item></sm-menu>
      </sm-dropdown>
    `);
    expect(el.shadowRoot).to.exist;
  });

  it('open=false by default', () => {
    const el = document.createElement('sm-dropdown');
    expect(el.open).to.be.false;
  });

  it('clicking trigger slot sets open=true and dispatches sm-show', async () => {
    const el = await fixture(html`
      <sm-dropdown>
        <sm-button slot="trigger">Open</sm-button>
        <sm-menu><sm-menu-item value="a">Item A</sm-menu-item></sm-menu>
      </sm-dropdown>
    `);
    const showPromise = oneEvent(el, 'sm-show');
    const triggerWrapper = el.shadowRoot.querySelector('.dropdown__trigger');
    triggerWrapper.click();
    await showPromise;
    expect(el.open).to.be.true;
  });

  it('clicking outside dispatches sm-hide', async () => {
    const el = await fixture(html`
      <sm-dropdown>
        <sm-button slot="trigger">Open</sm-button>
        <sm-menu><sm-menu-item value="a">Item A</sm-menu-item></sm-menu>
      </sm-dropdown>
    `);
    const triggerWrapper = el.shadowRoot.querySelector('.dropdown__trigger');
    triggerWrapper.click();
    await elementUpdated(el);
    expect(el.open).to.be.true;

    const hidePromise = oneEvent(el, 'sm-hide');
    document.body.click();
    await hidePromise;
    expect(el.open).to.be.false;
  });

  it('Escape key closes dropdown when open', async () => {
    const el = await fixture(html`
      <sm-dropdown>
        <sm-button slot="trigger">Open</sm-button>
        <sm-menu><sm-menu-item value="a">Item A</sm-menu-item></sm-menu>
      </sm-dropdown>
    `);
    const triggerWrapper = el.shadowRoot.querySelector('.dropdown__trigger');
    triggerWrapper.click();
    await elementUpdated(el);
    expect(el.open).to.be.true;

    const hidePromise = oneEvent(el, 'sm-hide');
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await hidePromise;
    expect(el.open).to.be.false;
  });

  it('placement attribute reflects', async () => {
    const el = await fixture(html`
      <sm-dropdown placement="top-end">
        <sm-button slot="trigger">Open</sm-button>
        <sm-menu><sm-menu-item value="a">Item A</sm-menu-item></sm-menu>
      </sm-dropdown>
    `);
    expect(el.placement).to.equal('top-end');
  });

  it('disabled prevents opening', async () => {
    const el = await fixture(html`
      <sm-dropdown disabled>
        <sm-button slot="trigger">Open</sm-button>
        <sm-menu><sm-menu-item value="a">Item A</sm-menu-item></sm-menu>
      </sm-dropdown>
    `);
    const triggerWrapper = el.shadowRoot.querySelector('.dropdown__trigger');
    triggerWrapper.click();
    await elementUpdated(el);
    expect(el.open).to.be.false;
  });
});
