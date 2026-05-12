import { fixture, expect, html, elementUpdated } from '@open-wc/testing';
import '../src/components/sm-relative-time.js';

describe('sm-relative-time', () => {
  it('renders inline', async () => {
    const el = await fixture(html`<sm-relative-time></sm-relative-time>`);
    expect(el.shadowRoot).to.exist;
    expect(getComputedStyle(el).display).to.equal('inline');
  });

  it('renders a time element', async () => {
    const el = await fixture(html`<sm-relative-time date="2024-01-01"></sm-relative-time>`);
    const time = el.shadowRoot.querySelector('time');
    expect(time).to.exist;
  });

  it('time element has a datetime attribute', async () => {
    const isoDate = '2024-03-10T12:00:00.000Z';
    const el = await fixture(html`<sm-relative-time date="${isoDate}"></sm-relative-time>`);
    const time = el.shadowRoot.querySelector('time');
    expect(time.hasAttribute('datetime')).to.be.true;
    expect(time.getAttribute('datetime')).to.not.equal('');
  });

  it('a date a few seconds ago shows "just now" or similar relative string', async () => {
    const recentDate = new Date(Date.now() - 3000).toISOString();
    const el = await fixture(html`<sm-relative-time date="${recentDate}" locale="en-US"></sm-relative-time>`);
    const time = el.shadowRoot.querySelector('time');
    const text = time.textContent.toLowerCase();
    // Intl.RelativeTimeFormat with numeric=auto renders "just now" for ~0 seconds,
    // or "3 seconds ago" etc. Both are acceptable.
    expect(text).to.match(/just now|second/i);
  });

  it('a date 2 years ago shows a year-relative string', async () => {
    const oldDate = new Date(Date.now() - 2 * 365.25 * 24 * 3600 * 1000).toISOString();
    const el = await fixture(html`<sm-relative-time date="${oldDate}" locale="en-US"></sm-relative-time>`);
    const time = el.shadowRoot.querySelector('time');
    const text = time.textContent.toLowerCase();
    expect(text).to.match(/year/i);
  });
});
