import { fixture, expect, html, elementUpdated } from '@open-wc/testing';
import '../src/components/sm-format-bytes.js';

describe('sm-format-bytes', () => {
  it('renders inline', async () => {
    const el = await fixture(html`<sm-format-bytes value="0"></sm-format-bytes>`);
    expect(el.shadowRoot).to.exist;
    expect(getComputedStyle(el).display).to.equal('inline');
  });

  it('formats 0 as "0 B" or similar', async () => {
    const el = await fixture(html`<sm-format-bytes value="0"></sm-format-bytes>`);
    const text = el.shadowRoot.querySelector('span').textContent;
    expect(text).to.match(/^0\s*[Bb]/);
  });

  it('formats 1024 as approximately "1 KB"', async () => {
    const el = await fixture(html`<sm-format-bytes value="1024"></sm-format-bytes>`);
    const text = el.shadowRoot.querySelector('span').textContent;
    expect(text).to.match(/1\s*(KB|kB|kilobyte)/i);
  });

  it('formats 1048576 as approximately "1 MB"', async () => {
    const el = await fixture(html`<sm-format-bytes value="1048576"></sm-format-bytes>`);
    const text = el.shadowRoot.querySelector('span').textContent;
    expect(text).to.match(/1\s*(MB|megabyte)/i);
  });

  it('changing value updates display', async () => {
    const el = await fixture(html`<sm-format-bytes value="0"></sm-format-bytes>`);
    const span = el.shadowRoot.querySelector('span');
    const original = span.textContent;
    el.value = 1024;
    await elementUpdated(el);
    expect(span.textContent).to.not.equal(original);
    expect(span.textContent).to.match(/1\s*(KB|kB|kilobyte)/i);
  });
});
