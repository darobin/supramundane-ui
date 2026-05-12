import { fixture, expect, html, elementUpdated } from '@open-wc/testing';
import '../src/components/sm-format-date.js';

describe('sm-format-date', () => {
  it('renders inline', async () => {
    const el = await fixture(html`<sm-format-date date="2024-01-15"></sm-format-date>`);
    expect(el.shadowRoot).to.exist;
    expect(getComputedStyle(el).display).to.equal('inline');
  });

  it('renders a time element', async () => {
    const el = await fixture(html`<sm-format-date date="2024-01-15"></sm-format-date>`);
    const time = el.shadowRoot.querySelector('time');
    expect(time).to.exist;
  });

  it('time element has a datetime attribute', async () => {
    const el = await fixture(html`<sm-format-date date="2024-01-15"></sm-format-date>`);
    const time = el.shadowRoot.querySelector('time');
    expect(time.hasAttribute('datetime')).to.be.true;
    expect(time.getAttribute('datetime')).to.contain('2024-01-15');
  });

  it('changing date property updates the rendered text', async () => {
    const el = await fixture(html`<sm-format-date date="2024-01-15" year="numeric" month="long" day="numeric"></sm-format-date>`);
    const time = el.shadowRoot.querySelector('time');
    const original = time.textContent;
    el.date = '2025-06-20';
    await elementUpdated(el);
    expect(time.textContent).to.not.equal(original);
  });

  it('with year+month+day options renders a human-readable date string', async () => {
    const el = await fixture(html`
      <sm-format-date
        date="2024-07-04"
        year="numeric"
        month="long"
        day="numeric"
        locale="en-US"
      ></sm-format-date>
    `);
    const time = el.shadowRoot.querySelector('time');
    // Should produce something like "July 4, 2024"
    expect(time.textContent).to.match(/July/i);
    expect(time.textContent).to.match(/2024/);
    expect(time.textContent).to.match(/4/);
  });
});
