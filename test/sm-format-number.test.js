import { fixture, expect, html, elementUpdated } from '@open-wc/testing';
import '../src/components/sm-format-number.js';

describe('sm-format-number', () => {
  it('renders inline', async () => {
    const el = await fixture(html`<sm-format-number value="0"></sm-format-number>`);
    expect(el.shadowRoot).to.exist;
    expect(getComputedStyle(el).display).to.equal('inline');
  });

  it('renders a span', async () => {
    const el = await fixture(html`<sm-format-number value="42"></sm-format-number>`);
    const span = el.shadowRoot.querySelector('span');
    expect(span).to.exist;
  });

  it('value=1234 renders with grouping separator (e.g. "1,234")', async () => {
    const el = await fixture(html`<sm-format-number value="1234" locale="en-US"></sm-format-number>`);
    const span = el.shadowRoot.querySelector('span');
    expect(span.textContent).to.equal('1,234');
  });

  it('value=0.5 with type=percent renders "50%"', async () => {
    const el = await fixture(html`<sm-format-number value="0.5" type="percent" locale="en-US"></sm-format-number>`);
    const span = el.shadowRoot.querySelector('span');
    expect(span.textContent).to.match(/50\s*%/);
  });

  it('no-grouping removes comma separators', async () => {
    const el = await fixture(html`<sm-format-number value="1234567" no-grouping locale="en-US"></sm-format-number>`);
    const span = el.shadowRoot.querySelector('span');
    expect(span.textContent).to.not.contain(',');
    expect(span.textContent).to.contain('1234567');
  });
});
