import { fixture, expect, html, elementUpdated } from '@open-wc/testing';
import '../src/components/sm-card.js';

describe('sm-card', () => {
  it('renders', async () => {
    const el = await fixture(html`<sm-card></sm-card>`);
    expect(el.shadowRoot).to.exist;
  });

  it('default slot content appears', async () => {
    const el = await fixture(html`<sm-card><p id="body-content">Hello</p></sm-card>`);
    const p = el.querySelector('#body-content');
    expect(p).to.exist;
    expect(p.textContent).to.equal('Hello');
  });

  it('header slot container is hidden when empty', async () => {
    const el = await fixture(html`<sm-card></sm-card>`);
    const header = el.shadowRoot.querySelector('.card__header');
    expect(header).to.exist;
    expect(header.hidden).to.be.true;
  });

  it('header slot container is visible when populated', async () => {
    const el = await fixture(html`
      <sm-card>
        <span slot="header">My Header</span>
      </sm-card>
    `);
    await elementUpdated(el);
    const header = el.shadowRoot.querySelector('.card__header');
    expect(header.hidden).to.be.false;
  });

  it('footer slot container is hidden when empty', async () => {
    const el = await fixture(html`<sm-card></sm-card>`);
    const footer = el.shadowRoot.querySelector('.card__footer');
    expect(footer).to.exist;
    expect(footer.hidden).to.be.true;
  });

  it('footer slot container is visible when populated', async () => {
    const el = await fixture(html`
      <sm-card>
        <span slot="footer">My Footer</span>
      </sm-card>
    `);
    await elementUpdated(el);
    const footer = el.shadowRoot.querySelector('.card__footer');
    expect(footer.hidden).to.be.false;
  });

  it('image slot appears at top', async () => {
    const el = await fixture(html`
      <sm-card>
        <img slot="image" src="/photo.jpg" alt="Photo" />
      </sm-card>
    `);
    const imageContainer = el.shadowRoot.querySelector('.card__image');
    expect(imageContainer).to.exist;
    const imageSlot = imageContainer.querySelector('slot[name="image"]');
    expect(imageSlot).to.exist;
    const assigned = imageSlot.assignedElements();
    expect(assigned.length).to.equal(1);
    expect(assigned[0].getAttribute('slot')).to.equal('image');
  });
});
