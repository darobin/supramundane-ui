import { fixture, expect, html, elementUpdated, oneEvent } from '@open-wc/testing';
import '../src/components/sm-tree-item.js';

describe('sm-tree-item', () => {
  it('renders; shadow root exists', async () => {
    const el = await fixture(html`<sm-tree-item><span slot="label">Item</span></sm-tree-item>`);
    expect(el.shadowRoot).to.exist;
  });

  it('default expanded=false, selected=false, disabled=false', () => {
    const el = document.createElement('sm-tree-item');
    expect(el.expanded).to.be.false;
    expect(el.selected).to.be.false;
    expect(el.disabled).to.be.false;
  });

  it('expanded attribute reflects', async () => {
    const el = await fixture(html`
      <sm-tree-item expanded>
        <span slot="label">Item</span>
        <sm-tree-item><span slot="label">Child</span></sm-tree-item>
      </sm-tree-item>
    `);
    expect(el.expanded).to.be.true;
    expect(el.getAttribute('expanded')).to.not.be.null;
  });

  it('clicking expand toggle sets expanded=true and dispatches sm-expand', async () => {
    const el = await fixture(html`
      <sm-tree-item>
        <span slot="label">Item</span>
        <sm-tree-item><span slot="label">Child</span></sm-tree-item>
      </sm-tree-item>
    `);
    // Wait for slot change to detect children
    await elementUpdated(el);
    const expandBtn = el.shadowRoot.querySelector('.tree-item__expand');
    expect(expandBtn).to.exist;

    const expandPromise = oneEvent(el, 'sm-expand');
    expandBtn.click();
    await expandPromise;
    expect(el.expanded).to.be.true;
  });

  it('clicking again sets expanded=false and dispatches sm-collapse', async () => {
    const el = await fixture(html`
      <sm-tree-item>
        <span slot="label">Item</span>
        <sm-tree-item><span slot="label">Child</span></sm-tree-item>
      </sm-tree-item>
    `);
    await elementUpdated(el);
    const expandBtn = el.shadowRoot.querySelector('.tree-item__expand');

    // Expand first
    const expandPromise = oneEvent(el, 'sm-expand');
    expandBtn.click();
    await expandPromise;
    expect(el.expanded).to.be.true;

    // Collapse
    const collapsePromise = oneEvent(el, 'sm-collapse');
    expandBtn.click();
    await collapsePromise;
    expect(el.expanded).to.be.false;
  });

  it('children hidden when expanded=false', async () => {
    const el = await fixture(html`
      <sm-tree-item>
        <span slot="label">Item</span>
        <sm-tree-item><span slot="label">Child</span></sm-tree-item>
      </sm-tree-item>
    `);
    await elementUpdated(el);
    const children = el.shadowRoot.querySelector('.tree-item__children');
    expect(children.classList.contains('tree-item__children--expanded')).to.be.false;
  });

  it('children visible when expanded=true', async () => {
    const el = await fixture(html`
      <sm-tree-item>
        <span slot="label">Item</span>
        <sm-tree-item><span slot="label">Child</span></sm-tree-item>
      </sm-tree-item>
    `);
    await elementUpdated(el);
    const expandBtn = el.shadowRoot.querySelector('.tree-item__expand');
    expandBtn.click();
    await elementUpdated(el);
    const children = el.shadowRoot.querySelector('.tree-item__children');
    expect(children.classList.contains('tree-item__children--expanded')).to.be.true;
  });

  it('lazy=true + first expand dispatches sm-lazy-load', async () => {
    const el = await fixture(html`
      <sm-tree-item lazy>
        <span slot="label">Lazy Item</span>
      </sm-tree-item>
    `);
    await elementUpdated(el);
    const expandBtn = el.shadowRoot.querySelector('.tree-item__expand');
    expect(expandBtn).to.exist;

    const lazyLoadPromise = oneEvent(el, 'sm-lazy-load');
    expandBtn.click();
    const event = await lazyLoadPromise;
    expect(event.type).to.equal('sm-lazy-load');
  });

  it('loading=true shows spinner', async () => {
    const el = await fixture(html`<sm-tree-item loading><span slot="label">Loading</span></sm-tree-item>`);
    await elementUpdated(el);
    const spinner = el.shadowRoot.querySelector('.tree-item__spinner');
    expect(spinner).to.exist;
  });
});
