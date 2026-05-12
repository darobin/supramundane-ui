import { fixture, expect, html, elementUpdated } from '@open-wc/testing';
import '../src/components/sm-progress-bar.js';

describe('sm-progress-bar', () => {
  it('renders', async () => {
    const el = await fixture(html`<sm-progress-bar></sm-progress-bar>`);
    expect(el.shadowRoot).to.exist;
  });

  it('has default value=0 and max=100', () => {
    const el = document.createElement('sm-progress-bar');
    expect(el.value).to.equal(0);
    expect(el.max).to.equal(100);
  });

  it('has role=progressbar', async () => {
    const el = await fixture(html`<sm-progress-bar></sm-progress-bar>`);
    const bar = el.shadowRoot.querySelector('[role="progressbar"]');
    expect(bar).to.exist;
  });

  it('aria-valuenow reflects value', async () => {
    const el = await fixture(html`<sm-progress-bar value="42"></sm-progress-bar>`);
    const bar = el.shadowRoot.querySelector('[role="progressbar"]');
    expect(bar.getAttribute('aria-valuenow')).to.equal('42');
  });

  it('aria-valuemax reflects max', async () => {
    const el = await fixture(html`<sm-progress-bar max="200"></sm-progress-bar>`);
    const bar = el.shadowRoot.querySelector('[role="progressbar"]');
    expect(bar.getAttribute('aria-valuemax')).to.equal('200');
  });

  it('indeterminate attribute removes aria-valuenow', async () => {
    const el = await fixture(html`<sm-progress-bar indeterminate value="50"></sm-progress-bar>`);
    const bar = el.shadowRoot.querySelector('[role="progressbar"]');
    expect(bar.hasAttribute('aria-valuenow')).to.be.false;
  });

  it('label attribute sets aria-label', async () => {
    const el = await fixture(html`<sm-progress-bar label="Uploading file"></sm-progress-bar>`);
    const bar = el.shadowRoot.querySelector('[role="progressbar"]');
    expect(bar.getAttribute('aria-label')).to.equal('Uploading file');
  });
});
