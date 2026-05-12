import { fixture, expect, html } from '@open-wc/testing';
import '../src/components/sm-toolbar.js';
import '../src/components/sm-button.js';

describe('sm-toolbar', () => {
  it('renders; shadow root exists', async () => {
    const el = await fixture(html`<sm-toolbar></sm-toolbar>`);
    expect(el.shadowRoot).to.exist;
  });

  it('slot content renders', async () => {
    const el = await fixture(html`
      <sm-toolbar>
        <sm-button>One</sm-button>
        <sm-button>Two</sm-button>
      </sm-toolbar>
    `);
    const slot = el.shadowRoot.querySelector('slot');
    expect(slot).to.exist;
    const assigned = slot.assignedElements({ flatten: true });
    expect(assigned.length).to.equal(2);
  });

  it('has display inline-flex style on host', async () => {
    const el = await fixture(html`<sm-toolbar></sm-toolbar>`);
    const style = getComputedStyle(el);
    expect(style.display).to.equal('inline-flex');
  });
});
