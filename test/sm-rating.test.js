import { fixture, expect, html, elementUpdated, oneEvent } from '@open-wc/testing';
import '../src/components/sm-rating.js';

describe('sm-rating', () => {
  it('renders', async () => {
    const el = await fixture(html`<sm-rating></sm-rating>`);
    expect(el.shadowRoot).to.exist;
  });

  it('defaults to value=0 and max=5', () => {
    const el = document.createElement('sm-rating');
    expect(el.value).to.equal(0);
    expect(el.max).to.equal(5);
  });

  it('value attribute sets value', async () => {
    const el = await fixture(html`<sm-rating value="3"></sm-rating>`);
    expect(el.value).to.equal(3);
  });

  it('readonly attribute reflects', async () => {
    const el = await fixture(html`<sm-rating readonly></sm-rating>`);
    expect(el.readonly).to.be.true;
    expect(el.hasAttribute('readonly')).to.be.true;
  });

  it('readonly prevents click changes', async () => {
    const el = await fixture(html`<sm-rating value="2" readonly></sm-rating>`);
    const stars = el.shadowRoot.querySelectorAll('.rating__symbol');
    stars[4].click();
    await elementUpdated(el);
    expect(el.value).to.equal(2);
  });

  it('clicking a star updates value and dispatches sm-change', async () => {
    const el = await fixture(html`<sm-rating value="0"></sm-rating>`);
    const stars = el.shadowRoot.querySelectorAll('.rating__symbol');
    const listener = oneEvent(el, 'sm-change');
    // Simulate click with a clientX in the right half of the star to avoid half-star
    const star = stars[2]; // 3rd star (index 2 = value 3)
    const rect = star.getBoundingClientRect();
    star.dispatchEvent(new MouseEvent('click', {
      bubbles: true,
      composed: true,
      clientX: rect.left + rect.width * 0.75,
      clientY: rect.top + rect.height / 2,
    }));
    const event = await listener;
    expect(event).to.exist;
    expect(el.value).to.be.greaterThan(0);
  });

  it('sm-change detail has value', async () => {
    const el = await fixture(html`<sm-rating value="0"></sm-rating>`);
    const stars = el.shadowRoot.querySelectorAll('.rating__symbol');
    const listener = oneEvent(el, 'sm-change');
    const star = stars[0];
    const rect = star.getBoundingClientRect();
    star.dispatchEvent(new MouseEvent('click', {
      bubbles: true,
      composed: true,
      clientX: rect.left + rect.width * 0.75,
      clientY: rect.top + rect.height / 2,
    }));
    const event = await listener;
    expect(event.detail).to.have.property('value');
    expect(typeof event.detail.value).to.equal('number');
  });

  it('disabled attribute reflects', async () => {
    const el = await fixture(html`<sm-rating disabled></sm-rating>`);
    expect(el.disabled).to.be.true;
    expect(el.hasAttribute('disabled')).to.be.true;
  });

  it('has role=slider', async () => {
    const el = await fixture(html`<sm-rating></sm-rating>`);
    const slider = el.shadowRoot.querySelector('[role="slider"]');
    expect(slider).to.exist;
  });

  it('aria-valuenow reflects value', async () => {
    const el = await fixture(html`<sm-rating value="3"></sm-rating>`);
    const slider = el.shadowRoot.querySelector('[role="slider"]');
    expect(slider.getAttribute('aria-valuenow')).to.equal('3');
  });
});
