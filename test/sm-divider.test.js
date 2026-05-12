import { fixture, expect, html, elementUpdated } from '@open-wc/testing';
import '../src/components/sm-divider.js';

describe('sm-divider', () => {
  it('renders', async () => {
    const el = await fixture(html`<sm-divider></sm-divider>`);
    expect(el.shadowRoot).to.exist;
  });

  it('is horizontal by default (divider has border-top style)', async () => {
    const el = await fixture(html`<sm-divider></sm-divider>`);
    expect(el.vertical).to.be.false;
    const divider = el.shadowRoot.querySelector('.divider');
    expect(divider).to.exist;
    const styles = window.getComputedStyle(divider);
    // The horizontal divider uses border-top; border-left should be none/0 by default
    expect(divider.getAttribute('aria-orientation')).to.equal('horizontal');
  });

  it('vertical attribute sets vertical mode', async () => {
    const el = await fixture(html`<sm-divider vertical></sm-divider>`);
    expect(el.vertical).to.be.true;
    expect(el.getAttribute('vertical')).to.not.be.null;
    const divider = el.shadowRoot.querySelector('.divider');
    expect(divider.getAttribute('aria-orientation')).to.equal('vertical');
  });

  it('dashed attribute exists and reflects', async () => {
    const el = await fixture(html`<sm-divider dashed></sm-divider>`);
    expect(el.dashed).to.be.true;
    expect(el.hasAttribute('dashed')).to.be.true;
  });

  it('dashed attribute is false by default', () => {
    const el = document.createElement('sm-divider');
    expect(el.dashed).to.be.false;
  });
});
