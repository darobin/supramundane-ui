import { fixture, expect, html, elementUpdated, oneEvent } from '@open-wc/testing';
import '../src/components/sm-textarea.js';

describe('sm-textarea', () => {
  it('renders', async () => {
    const el = await fixture(html`<sm-textarea></sm-textarea>`);
    expect(el.shadowRoot).to.exist;
  });

  it('has a native textarea in shadow root', async () => {
    const el = await fixture(html`<sm-textarea></sm-textarea>`);
    const textarea = el.shadowRoot.querySelector('textarea');
    expect(textarea).to.exist;
  });

  it('defaults rows to 4', () => {
    const el = document.createElement('sm-textarea');
    expect(el.rows).to.equal(4);
  });

  it('native textarea has rows=4 by default', async () => {
    const el = await fixture(html`<sm-textarea></sm-textarea>`);
    const textarea = el.shadowRoot.querySelector('textarea');
    expect(Number(textarea.getAttribute('rows'))).to.equal(4);
  });

  it('value property syncs to native textarea value', async () => {
    const el = await fixture(html`<sm-textarea></sm-textarea>`);
    el.value = 'some text';
    await elementUpdated(el);
    const textarea = el.shadowRoot.querySelector('textarea');
    expect(textarea.value).to.equal('some text');
  });

  it('disabled attribute disables native textarea', async () => {
    const el = await fixture(html`<sm-textarea disabled></sm-textarea>`);
    const textarea = el.shadowRoot.querySelector('textarea');
    expect(textarea.disabled).to.be.true;
  });

  it('readonly attribute makes native textarea readonly', async () => {
    const el = await fixture(html`<sm-textarea readonly></sm-textarea>`);
    const textarea = el.shadowRoot.querySelector('textarea');
    expect(textarea.readOnly).to.be.true;
  });

  it('resize attribute defaults to vertical', () => {
    const el = document.createElement('sm-textarea');
    expect(el.resize).to.equal('vertical');
  });

  it('resize=none applies resize-none class to native textarea', async () => {
    const el = await fixture(html`<sm-textarea resize="none"></sm-textarea>`);
    const textarea = el.shadowRoot.querySelector('textarea');
    expect(textarea.classList.contains('textarea__control--resize-none')).to.be.true;
  });

  it('resize=vertical applies resize-vertical class to native textarea', async () => {
    const el = await fixture(html`<sm-textarea resize="vertical"></sm-textarea>`);
    const textarea = el.shadowRoot.querySelector('textarea');
    expect(textarea.classList.contains('textarea__control--resize-vertical')).to.be.true;
  });

  it('resize=auto applies resize-auto class to native textarea', async () => {
    const el = await fixture(html`<sm-textarea resize="auto"></sm-textarea>`);
    const textarea = el.shadowRoot.querySelector('textarea');
    expect(textarea.classList.contains('textarea__control--resize-auto')).to.be.true;
  });

  it('label attribute renders a label element in shadow root', async () => {
    const el = await fixture(html`<sm-textarea label="My label"></sm-textarea>`);
    const label = el.shadowRoot.querySelector('label');
    expect(label).to.exist;
    expect(label.textContent).to.include('My label');
  });

  it('help-text attribute renders a help-text element in shadow root', async () => {
    const el = await fixture(html`<sm-textarea help-text="Helpful hint"></sm-textarea>`);
    const helpText = el.shadowRoot.querySelector('.form-control__help-text');
    expect(helpText).to.exist;
    expect(helpText.textContent).to.include('Helpful hint');
  });

  it('dispatches sm-input on native input event', async () => {
    const el = await fixture(html`<sm-textarea></sm-textarea>`);
    const textarea = el.shadowRoot.querySelector('textarea');
    const smInputEvent = oneEvent(el, 'sm-input');
    textarea.dispatchEvent(new Event('input', { bubbles: true }));
    await smInputEvent;
  });

  it('dispatches sm-change on native change event', async () => {
    const el = await fixture(html`<sm-textarea></sm-textarea>`);
    const textarea = el.shadowRoot.querySelector('textarea');
    const smChangeEvent = oneEvent(el, 'sm-change');
    textarea.dispatchEvent(new Event('change', { bubbles: true }));
    await smChangeEvent;
  });
});
