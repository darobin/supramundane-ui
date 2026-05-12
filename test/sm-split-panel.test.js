import { fixture, expect, html, elementUpdated, oneEvent } from '@open-wc/testing';
import '../src/components/sm-split-panel.js';

describe('sm-split-panel', () => {
  it('renders; shadow root exists', async () => {
    const el = await fixture(html`
      <sm-split-panel style="height:200px">
        <div slot="start">Start</div>
        <div slot="end">End</div>
      </sm-split-panel>
    `);
    expect(el.shadowRoot).to.exist;
  });

  it('default position=50', () => {
    const el = document.createElement('sm-split-panel');
    expect(el.position).to.equal(50);
  });

  it('has start and end slots', async () => {
    const el = await fixture(html`
      <sm-split-panel style="height:200px">
        <div slot="start">Start</div>
        <div slot="end">End</div>
      </sm-split-panel>
    `);
    const startSlot = el.shadowRoot.querySelector('slot[name="start"]');
    const endSlot = el.shadowRoot.querySelector('slot[name="end"]');
    expect(startSlot).to.exist;
    expect(endSlot).to.exist;
  });

  it('vertical attribute reflects', async () => {
    const el = await fixture(html`
      <sm-split-panel vertical style="height:200px">
        <div slot="start">Start</div>
        <div slot="end">End</div>
      </sm-split-panel>
    `);
    expect(el.vertical).to.be.true;
    expect(el.getAttribute('vertical')).to.not.be.null;
  });

  it('position attribute reflects (set position=30)', async () => {
    const el = await fixture(html`
      <sm-split-panel position="30" style="height:200px">
        <div slot="start">Start</div>
        <div slot="end">End</div>
      </sm-split-panel>
    `);
    expect(el.position).to.equal(30);
  });

  it('disabled prevents drag (pointerdown + pointermove does not change position)', async () => {
    const el = await fixture(html`
      <sm-split-panel disabled style="width:400px;height:200px">
        <div slot="start">Start</div>
        <div slot="end">End</div>
      </sm-split-panel>
    `);
    const divider = el.shadowRoot.querySelector('.split-panel__divider');
    const initialPosition = el._position;

    divider.dispatchEvent(new PointerEvent('pointerdown', { clientX: 200, bubbles: true }));
    divider.dispatchEvent(new PointerEvent('pointermove', { clientX: 100, bubbles: true }));
    await elementUpdated(el);

    expect(el._position).to.equal(initialPosition);
  });

  it('dispatches sm-reposition when position changes via keyboard', async () => {
    const el = await fixture(html`
      <sm-split-panel style="width:400px;height:200px">
        <div slot="start">Start</div>
        <div slot="end">End</div>
      </sm-split-panel>
    `);
    const divider = el.shadowRoot.querySelector('.split-panel__divider');
    const repositionPromise = oneEvent(el, 'sm-reposition');
    divider.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    const event = await repositionPromise;
    expect(event).to.exist;
    expect(event.detail.position).to.be.a('number');
  });
});
