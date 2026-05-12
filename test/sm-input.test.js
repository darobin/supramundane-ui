import { fixture, expect, html, elementUpdated, oneEvent } from '@open-wc/testing';
import '../src/components/sm-input.js';

describe('sm-input', () => {
  it('renders', async () => {
    const el = await fixture(html`<sm-input></sm-input>`);
    expect(el.shadowRoot).to.exist;
  });

  it('has a native input in shadow root', async () => {
    const el = await fixture(html`<sm-input></sm-input>`);
    const input = el.shadowRoot.querySelector('input');
    expect(input).to.exist;
  });

  it('defaults type to text', () => {
    const el = document.createElement('sm-input');
    expect(el.type).to.equal('text');
  });

  it('native input has type text by default', async () => {
    const el = await fixture(html`<sm-input></sm-input>`);
    const input = el.shadowRoot.querySelector('input');
    expect(input.type).to.equal('text');
  });

  it('value property syncs to native input value', async () => {
    const el = await fixture(html`<sm-input value="hello"></sm-input>`);
    const input = el.shadowRoot.querySelector('input');
    expect(el.value).to.equal('hello');
    expect(input.value).to.equal('hello');
  });

  it('setting value property updates native input', async () => {
    const el = await fixture(html`<sm-input></sm-input>`);
    el.value = 'world';
    await elementUpdated(el);
    const input = el.shadowRoot.querySelector('input');
    expect(input.value).to.equal('world');
  });

  it('placeholder attribute sets native input placeholder', async () => {
    const el = await fixture(html`<sm-input placeholder="Enter text"></sm-input>`);
    const input = el.shadowRoot.querySelector('input');
    expect(input.placeholder).to.equal('Enter text');
  });

  it('disabled attribute disables native input', async () => {
    const el = await fixture(html`<sm-input disabled></sm-input>`);
    const input = el.shadowRoot.querySelector('input');
    expect(input.disabled).to.be.true;
  });

  it('readonly attribute makes native input readonly', async () => {
    const el = await fixture(html`<sm-input readonly></sm-input>`);
    const input = el.shadowRoot.querySelector('input');
    expect(input.readOnly).to.be.true;
  });

  it('required attribute reflects', async () => {
    const el = await fixture(html`<sm-input required></sm-input>`);
    expect(el.required).to.be.true;
    expect(el.hasAttribute('required')).to.be.true;
  });

  it('size attribute reflects', async () => {
    const el = await fixture(html`<sm-input size="large"></sm-input>`);
    expect(el.size).to.equal('large');
    expect(el.getAttribute('size')).to.equal('large');
  });

  it('clearable=true shows clear button when value is non-empty', async () => {
    const el = await fixture(html`<sm-input clearable value="hello"></sm-input>`);
    await elementUpdated(el);
    const clearBtn = el.shadowRoot.querySelector('button[aria-label="Clear"]');
    expect(clearBtn).to.exist;
  });

  it('clearable=true hides clear button when value is empty', async () => {
    const el = await fixture(html`<sm-input clearable value=""></sm-input>`);
    await elementUpdated(el);
    const clearBtn = el.shadowRoot.querySelector('button[aria-label="Clear"]');
    expect(clearBtn).to.not.exist;
  });

  it('clicking clear button sets value to empty string', async () => {
    const el = await fixture(html`<sm-input clearable value="hello"></sm-input>`);
    await elementUpdated(el);
    const clearBtn = el.shadowRoot.querySelector('button[aria-label="Clear"]');
    clearBtn.click();
    await elementUpdated(el);
    expect(el.value).to.equal('');
  });

  it('clicking clear button dispatches sm-clear event', async () => {
    const el = await fixture(html`<sm-input clearable value="hello"></sm-input>`);
    await elementUpdated(el);
    const clearBtn = el.shadowRoot.querySelector('button[aria-label="Clear"]');
    const clearEvent = oneEvent(el, 'sm-clear');
    clearBtn.click();
    await clearEvent;
    expect(el.value).to.equal('');
  });

  it('password-toggle shows toggle button when type=password', async () => {
    const el = await fixture(html`<sm-input type="password" password-toggle></sm-input>`);
    await elementUpdated(el);
    const toggleBtn = el.shadowRoot.querySelector('button[aria-label="Show password"]');
    expect(toggleBtn).to.exist;
  });

  it('password-toggle: clicking toggle switches input type to text', async () => {
    const el = await fixture(html`<sm-input type="password" password-toggle></sm-input>`);
    await elementUpdated(el);
    const toggleBtn = el.shadowRoot.querySelector('button[aria-label="Show password"]');
    toggleBtn.click();
    await elementUpdated(el);
    const input = el.shadowRoot.querySelector('input');
    expect(input.type).to.equal('text');
  });

  it('dispatches sm-input on native input event', async () => {
    const el = await fixture(html`<sm-input></sm-input>`);
    const input = el.shadowRoot.querySelector('input');
    const smInputEvent = oneEvent(el, 'sm-input');
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await smInputEvent;
  });

  it('dispatches sm-change on native change event', async () => {
    const el = await fixture(html`<sm-input></sm-input>`);
    const input = el.shadowRoot.querySelector('input');
    const smChangeEvent = oneEvent(el, 'sm-change');
    input.dispatchEvent(new Event('change', { bubbles: true }));
    await smChangeEvent;
  });

  it('label attribute renders a label element in shadow root', async () => {
    const el = await fixture(html`<sm-input label="My label"></sm-input>`);
    const label = el.shadowRoot.querySelector('label');
    expect(label).to.exist;
    expect(label.textContent).to.include('My label');
  });

  it('help-text attribute renders a help-text element in shadow root', async () => {
    const el = await fixture(html`<sm-input help-text="Helper text here"></sm-input>`);
    const helpText = el.shadowRoot.querySelector('.form-control__help-text');
    expect(helpText).to.exist;
    expect(helpText.textContent).to.include('Helper text here');
  });
});
