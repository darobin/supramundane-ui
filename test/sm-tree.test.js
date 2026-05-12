import { fixture, expect, html, elementUpdated, oneEvent } from '@open-wc/testing';
import '../src/components/sm-tree.js';
import '../src/components/sm-tree-item.js';

describe('sm-tree', () => {
  it('renders; shadow root exists', async () => {
    const el = await fixture(html`<sm-tree></sm-tree>`);
    expect(el.shadowRoot).to.exist;
  });

  it('role=tree on inner element', async () => {
    const el = await fixture(html`<sm-tree></sm-tree>`);
    const treeEl = el.shadowRoot.querySelector('[role="tree"]');
    expect(treeEl).to.exist;
  });

  it('sm-tree-item children render', async () => {
    const el = await fixture(html`
      <sm-tree>
        <sm-tree-item><span slot="label">Item A</span></sm-tree-item>
        <sm-tree-item><span slot="label">Item B</span></sm-tree-item>
      </sm-tree>
    `);
    const items = el.querySelectorAll('sm-tree-item');
    expect(items.length).to.equal(2);
  });

  it('selection=none by default', () => {
    const el = document.createElement('sm-tree');
    expect(el.selection).to.equal('none');
  });

  it('selection=single: clicking an item selects it', async () => {
    const el = await fixture(html`
      <sm-tree selection="single">
        <sm-tree-item><span slot="label">Item A</span></sm-tree-item>
        <sm-tree-item><span slot="label">Item B</span></sm-tree-item>
      </sm-tree>
    `);
    const items = [...el.querySelectorAll('sm-tree-item')];
    items[0].shadowRoot.querySelector('.tree-item__item').click();
    await elementUpdated(el);
    expect(items[0].selected).to.be.true;
  });

  it('selection=single: clicking another item deselects first', async () => {
    const el = await fixture(html`
      <sm-tree selection="single">
        <sm-tree-item><span slot="label">Item A</span></sm-tree-item>
        <sm-tree-item><span slot="label">Item B</span></sm-tree-item>
      </sm-tree>
    `);
    const items = [...el.querySelectorAll('sm-tree-item')];
    items[0].shadowRoot.querySelector('.tree-item__item').click();
    await elementUpdated(el);
    expect(items[0].selected).to.be.true;

    items[1].shadowRoot.querySelector('.tree-item__item').click();
    await elementUpdated(el);
    expect(items[1].selected).to.be.true;
    expect(items[0].selected).to.be.false;
  });

  it('selection=multiple: clicking items toggles their selection', async () => {
    const el = await fixture(html`
      <sm-tree selection="multiple">
        <sm-tree-item><span slot="label">Item A</span></sm-tree-item>
        <sm-tree-item><span slot="label">Item B</span></sm-tree-item>
      </sm-tree>
    `);
    const items = [...el.querySelectorAll('sm-tree-item')];
    items[0].shadowRoot.querySelector('.tree-item__item').click();
    await elementUpdated(el);
    items[1].shadowRoot.querySelector('.tree-item__item').click();
    await elementUpdated(el);
    expect(items[0].selected).to.be.true;
    expect(items[1].selected).to.be.true;

    // Toggle first off
    items[0].shadowRoot.querySelector('.tree-item__item').click();
    await elementUpdated(el);
    expect(items[0].selected).to.be.false;
    expect(items[1].selected).to.be.true;
  });

  it('dispatches sm-selection-change with selection array', async () => {
    const el = await fixture(html`
      <sm-tree selection="single">
        <sm-tree-item><span slot="label">Item A</span></sm-tree-item>
      </sm-tree>
    `);
    const changePromise = oneEvent(el, 'sm-selection-change');
    const item = el.querySelector('sm-tree-item');
    item.shadowRoot.querySelector('.tree-item__item').click();
    const event = await changePromise;
    expect(event.detail.selection).to.be.an('array');
    expect(event.detail.selection.length).to.equal(1);
    expect(event.detail.selection[0]).to.equal(item);
  });
});
