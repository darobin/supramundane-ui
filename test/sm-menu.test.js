import { fixture, expect, html, elementUpdated, oneEvent } from '@open-wc/testing';
import '../src/components/sm-menu.js';
import '../src/components/sm-menu-item.js';

describe('sm-menu', () => {
  it('renders; shadow root exists', async () => {
    const el = await fixture(html`<sm-menu></sm-menu>`);
    expect(el.shadowRoot).to.exist;
  });

  it('role=menu on inner element', async () => {
    const el = await fixture(html`<sm-menu></sm-menu>`);
    const menuEl = el.shadowRoot.querySelector('[role="menu"]');
    expect(menuEl).to.exist;
  });

  it('sm-menu-item children render', async () => {
    const el = await fixture(html`
      <sm-menu>
        <sm-menu-item value="a">Item A</sm-menu-item>
        <sm-menu-item value="b">Item B</sm-menu-item>
      </sm-menu>
    `);
    const items = el.querySelectorAll('sm-menu-item');
    expect(items.length).to.equal(2);
  });

  it('clicking sm-menu-item dispatches sm-select with value in detail', async () => {
    const el = await fixture(html`
      <sm-menu>
        <sm-menu-item value="foo">Foo</sm-menu-item>
      </sm-menu>
    `);
    const selectPromise = oneEvent(el, 'sm-select');
    const item = el.querySelector('sm-menu-item');
    item.shadowRoot.querySelector('.menu-item').click();
    const event = await selectPromise;
    expect(event.detail.value).to.equal('foo');
  });

  it('keydown ArrowDown on menu moves focus to next item', async () => {
    const el = await fixture(html`
      <sm-menu>
        <sm-menu-item value="a">Item A</sm-menu-item>
        <sm-menu-item value="b">Item B</sm-menu-item>
      </sm-menu>
    `);
    const items = [...el.querySelectorAll('sm-menu-item')];
    // Focus first item's inner div
    items[0].shadowRoot.querySelector('.menu-item').focus();

    const menuInner = el.shadowRoot.querySelector('[role="menu"]');
    menuInner.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    await elementUpdated(el);

    // The second item should now be focused
    const focused = document.activeElement;
    expect(focused).to.equal(items[1]);
  });

  it('disabled menu-item does not fire sm-select on click', async () => {
    const el = await fixture(html`
      <sm-menu>
        <sm-menu-item value="disabled-val" disabled>Disabled</sm-menu-item>
      </sm-menu>
    `);
    let fired = false;
    el.addEventListener('sm-select', () => { fired = true; });
    const item = el.querySelector('sm-menu-item');
    item.shadowRoot.querySelector('.menu-item').click();
    await elementUpdated(el);
    expect(fired).to.be.false;
  });
});
