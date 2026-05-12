import { fixture, expect, html, elementUpdated, oneEvent } from '@open-wc/testing';
import '../src/components/sm-tabbed-pane.js';
import '../src/components/sm-tab-panel.js';

describe('sm-tabbed-pane', () => {
  it('renders with panels', async () => {
    const el = await fixture(html`
      <sm-tabbed-pane>
        <sm-tab-panel label="Tab 1">Panel 1</sm-tab-panel>
        <sm-tab-panel label="Tab 2">Panel 2</sm-tab-panel>
      </sm-tabbed-pane>
    `);
    expect(el.shadowRoot).to.exist;
    const panels = el.querySelectorAll('sm-tab-panel');
    expect(panels.length).to.equal(2);
  });

  it('first non-disabled panel is activated after render', async () => {
    const el = await fixture(html`
      <sm-tabbed-pane>
        <sm-tab-panel label="Tab 1">Panel 1</sm-tab-panel>
        <sm-tab-panel label="Tab 2">Panel 2</sm-tab-panel>
      </sm-tabbed-pane>
    `);
    const panels = [...el.querySelectorAll('sm-tab-panel')];
    expect(panels[0].active).to.be.true;
    expect(panels[1].active).to.be.false;
  });

  it('clicking a tab activates that panel and deactivates others', async () => {
    const el = await fixture(html`
      <sm-tabbed-pane>
        <sm-tab-panel label="Tab 1">Panel 1</sm-tab-panel>
        <sm-tab-panel label="Tab 2">Panel 2</sm-tab-panel>
      </sm-tabbed-pane>
    `);
    const tabs = el.shadowRoot.querySelectorAll('[role="tab"]');
    tabs[1].click();
    await elementUpdated(el);
    const panels = [...el.querySelectorAll('sm-tab-panel')];
    expect(panels[1].active).to.be.true;
    expect(panels[0].active).to.be.false;
  });

  it('closable=true shows close buttons in tabs', async () => {
    const el = await fixture(html`
      <sm-tabbed-pane closable>
        <sm-tab-panel label="Tab 1">Panel 1</sm-tab-panel>
      </sm-tabbed-pane>
    `);
    const closeBtn = el.shadowRoot.querySelector('.tab__close');
    expect(closeBtn).to.exist;
  });

  it('clicking close button removes panel and dispatches sm-tab-close', async () => {
    const el = await fixture(html`
      <sm-tabbed-pane closable>
        <sm-tab-panel label="Tab 1">Panel 1</sm-tab-panel>
        <sm-tab-panel label="Tab 2">Panel 2</sm-tab-panel>
      </sm-tabbed-pane>
    `);
    const closePromise = oneEvent(el, 'sm-tab-close');
    const closeBtn = el.shadowRoot.querySelector('.tab__close');
    closeBtn.click();
    const event = await closePromise;
    expect(event).to.exist;
    await elementUpdated(el);
    const panels = el.querySelectorAll('sm-tab-panel');
    expect(panels.length).to.equal(1);
  });

  it('sm-tab-close is cancelable (preventDefault keeps panel)', async () => {
    const el = await fixture(html`
      <sm-tabbed-pane closable>
        <sm-tab-panel label="Tab 1">Panel 1</sm-tab-panel>
        <sm-tab-panel label="Tab 2">Panel 2</sm-tab-panel>
      </sm-tabbed-pane>
    `);
    el.addEventListener('sm-tab-close', (e) => e.preventDefault());
    const closeBtn = el.shadowRoot.querySelector('.tab__close');
    closeBtn.click();
    await elementUpdated(el);
    const panels = el.querySelectorAll('sm-tab-panel');
    expect(panels.length).to.equal(2);
  });

  it('disabled panel cannot be activated by click', async () => {
    const el = await fixture(html`
      <sm-tabbed-pane>
        <sm-tab-panel label="Tab 1">Panel 1</sm-tab-panel>
        <sm-tab-panel label="Tab 2" disabled>Panel 2</sm-tab-panel>
      </sm-tabbed-pane>
    `);
    const tabs = el.shadowRoot.querySelectorAll('[role="tab"]');
    tabs[1].click();
    await elementUpdated(el);
    const panels = [...el.querySelectorAll('sm-tab-panel')];
    expect(panels[0].active).to.be.true;
    expect(panels[1].active).to.be.false;
  });

  it('keyboard ArrowRight moves to next tab', async () => {
    const el = await fixture(html`
      <sm-tabbed-pane>
        <sm-tab-panel label="Tab 1">Panel 1</sm-tab-panel>
        <sm-tab-panel label="Tab 2">Panel 2</sm-tab-panel>
      </sm-tabbed-pane>
    `);
    const navEl = el.shadowRoot.querySelector('[role="tablist"]');
    navEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    await elementUpdated(el);
    const panels = [...el.querySelectorAll('sm-tab-panel')];
    expect(panels[1].active).to.be.true;
    expect(panels[0].active).to.be.false;
  });
});
