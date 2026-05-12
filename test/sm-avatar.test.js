import { fixture, expect, html, elementUpdated } from '@open-wc/testing';
import '../src/components/sm-avatar.js';

describe('sm-avatar', () => {
  it('renders', async () => {
    const el = await fixture(html`<sm-avatar></sm-avatar>`);
    expect(el.shadowRoot).to.exist;
  });

  it('defaults to circle shape and medium size', () => {
    const el = document.createElement('sm-avatar');
    expect(el.shape).to.equal('circle');
    expect(el.size).to.equal('medium');
  });

  it('shows image when image attribute is set', async () => {
    const el = await fixture(html`<sm-avatar image="/test.jpg" label="Test"></sm-avatar>`);
    const img = el.shadowRoot.querySelector('img');
    expect(img).to.exist;
    expect(img.src).to.contain('/test.jpg');
  });

  it('shows initials span when initials set and no image', async () => {
    const el = await fixture(html`<sm-avatar initials="AB"></sm-avatar>`);
    const img = el.shadowRoot.querySelector('img');
    expect(img).to.not.exist;
    const spans = el.shadowRoot.querySelectorAll('span');
    const initialsSpan = [...spans].find((s) => s.textContent.trim() === 'AB');
    expect(initialsSpan).to.exist;
  });

  it('shows fallback icon when neither image nor initials are set', async () => {
    const el = await fixture(html`<sm-avatar></sm-avatar>`);
    const img = el.shadowRoot.querySelector('img');
    expect(img).to.not.exist;
    const iconSpan = el.shadowRoot.querySelector('.avatar__icon');
    expect(iconSpan).to.exist;
  });

  it('shape attribute reflects', async () => {
    const el = await fixture(html`<sm-avatar shape="square"></sm-avatar>`);
    expect(el.shape).to.equal('square');
    expect(el.getAttribute('shape')).to.equal('square');
  });

  it('size attribute reflects', async () => {
    const el = await fixture(html`<sm-avatar size="large"></sm-avatar>`);
    expect(el.size).to.equal('large');
    expect(el.getAttribute('size')).to.equal('large');
  });

  it('label is used as aria-label on the container', async () => {
    const el = await fixture(html`<sm-avatar label="User photo"></sm-avatar>`);
    const container = el.shadowRoot.querySelector('[role="img"]');
    expect(container).to.exist;
    expect(container.getAttribute('aria-label')).to.equal('User photo');
  });
});
