import { fixture, expect, html, elementUpdated } from '@open-wc/testing';
import '../src/components/sm-tooltip.js';

describe('sm-tooltip', () => {
  it('renders; shadow root exists', async () => {
    const el = await fixture(html`<sm-tooltip content="Hello"><button>Trigger</button></sm-tooltip>`);
    expect(el.shadowRoot).to.exist;
  });

  it('content attribute', async () => {
    const el = await fixture(html`<sm-tooltip content="Tooltip text"><button>Trigger</button></sm-tooltip>`);
    expect(el.content).to.equal('Tooltip text');
    const popup = el.shadowRoot.querySelector('.tooltip__popup');
    expect(popup.textContent.trim()).to.contain('Tooltip text');
  });

  it('disabled attribute reflects', async () => {
    const el = await fixture(html`<sm-tooltip content="Hello" disabled><button>Trigger</button></sm-tooltip>`);
    expect(el.disabled).to.be.true;
    expect(el.getAttribute('disabled')).to.not.be.null;
  });

  it('placement attribute reflects', async () => {
    const el = await fixture(html`<sm-tooltip content="Hello" placement="bottom"><button>Trigger</button></sm-tooltip>`);
    expect(el.placement).to.equal('bottom');
  });

  it('trigger slot content renders', async () => {
    const el = await fixture(html`
      <sm-tooltip content="Hello">
        <button id="my-trigger">Click me</button>
      </sm-tooltip>
    `);
    const trigger = el.shadowRoot.querySelector('.tooltip__trigger');
    expect(trigger).to.exist;
    const slot = trigger.querySelector('slot');
    expect(slot).to.exist;
    const assigned = slot.assignedElements({ flatten: true });
    expect(assigned.length).to.be.greaterThan(0);
    expect(assigned[0].id).to.equal('my-trigger');
  });

  it('tooltip popup is not visible initially', async () => {
    const el = await fixture(html`<sm-tooltip content="Hello"><button>Trigger</button></sm-tooltip>`);
    const popup = el.shadowRoot.querySelector('.tooltip__popup');
    expect(popup).to.exist;
    expect(popup.classList.contains('tooltip__popup--visible')).to.be.false;
  });

  it('firing pointerenter on trigger wrapper shows tooltip', async () => {
    const el = await fixture(html`<sm-tooltip content="Hello"><button>Trigger</button></sm-tooltip>`);
    const trigger = el.shadowRoot.querySelector('.tooltip__trigger');
    trigger.dispatchEvent(new PointerEvent('pointerenter', { bubbles: true }));
    await elementUpdated(el);
    const popup = el.shadowRoot.querySelector('.tooltip__popup');
    expect(popup.classList.contains('tooltip__popup--visible')).to.be.true;
  });
});
