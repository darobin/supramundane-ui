import { fixture, expect, html, elementUpdated, oneEvent } from '@open-wc/testing';
import '../src/components/sm-select.js';
import '../src/components/sm-option.js';

describe('sm-select', () => {
  it('renders', async () => {
    const el = await fixture(html`<sm-select></sm-select>`);
    expect(el.shadowRoot).to.exist;
  });

  it('shows placeholder text when no value is set', async () => {
    const el = await fixture(html`
      <sm-select placeholder="Choose one">
        <sm-option value="a">Option A</sm-option>
      </sm-select>
    `);
    const placeholder = el.shadowRoot.querySelector('.select__placeholder');
    expect(placeholder).to.exist;
    expect(placeholder.textContent.trim()).to.equal('Choose one');
  });

  it('default placeholder text shows when no placeholder attribute and no value', async () => {
    const el = await fixture(html`
      <sm-select>
        <sm-option value="a">Option A</sm-option>
      </sm-select>
    `);
    const placeholder = el.shadowRoot.querySelector('.select__placeholder');
    expect(placeholder).to.exist;
  });

  it('value attribute sets display to matching option label', async () => {
    const el = await fixture(html`
      <sm-select value="b">
        <sm-option value="a">Option A</sm-option>
        <sm-option value="b">Option B</sm-option>
      </sm-select>
    `);
    await elementUpdated(el);
    // placeholder should not be shown
    const placeholder = el.shadowRoot.querySelector('.select__placeholder');
    expect(placeholder).to.not.exist;
    // display value area should contain the label
    const valueEl = el.shadowRoot.querySelector('.select__value');
    expect(valueEl.textContent).to.include('Option B');
  });

  it('clicking trigger opens dropdown', async () => {
    const el = await fixture(html`
      <sm-select>
        <sm-option value="a">Option A</sm-option>
      </sm-select>
    `);
    const trigger = el.shadowRoot.querySelector('.select__trigger');
    trigger.click();
    await elementUpdated(el);
    expect(el._open).to.be.true;
    const dropdown = el.shadowRoot.querySelector('.select__dropdown');
    expect(dropdown).to.exist;
  });

  it('sm-option click sets value and closes dropdown', async () => {
    const el = await fixture(html`
      <sm-select>
        <sm-option value="a">Option A</sm-option>
        <sm-option value="b">Option B</sm-option>
      </sm-select>
    `);
    // open
    const trigger = el.shadowRoot.querySelector('.select__trigger');
    trigger.click();
    await elementUpdated(el);
    // click an option
    const optA = el.querySelector('sm-option[value="a"]');
    optA.dispatchEvent(new CustomEvent('sm-option-select', {
      detail: { value: 'a', label: 'Option A' },
      bubbles: true,
      composed: true,
    }));
    await elementUpdated(el);
    expect(el.value).to.equal('a');
    expect(el._open).to.be.false;
  });

  it('clearable=true shows clear button when value is set', async () => {
    const el = await fixture(html`
      <sm-select clearable value="a">
        <sm-option value="a">Option A</sm-option>
      </sm-select>
    `);
    await elementUpdated(el);
    const clearBtn = el.shadowRoot.querySelector('.select__clear');
    expect(clearBtn).to.exist;
  });

  it('clearable=true does not show clear button when no value', async () => {
    const el = await fixture(html`
      <sm-select clearable>
        <sm-option value="a">Option A</sm-option>
      </sm-select>
    `);
    await elementUpdated(el);
    const clearBtn = el.shadowRoot.querySelector('.select__clear');
    expect(clearBtn).to.not.exist;
  });

  it('clicking clear button clears value', async () => {
    const el = await fixture(html`
      <sm-select clearable value="a">
        <sm-option value="a">Option A</sm-option>
      </sm-select>
    `);
    await elementUpdated(el);
    const clearBtn = el.shadowRoot.querySelector('.select__clear');
    clearBtn.click();
    await elementUpdated(el);
    expect(el.value).to.equal('');
  });

  it('disabled attribute prevents opening the dropdown', async () => {
    const el = await fixture(html`
      <sm-select disabled>
        <sm-option value="a">Option A</sm-option>
      </sm-select>
    `);
    const trigger = el.shadowRoot.querySelector('.select__trigger');
    // Trigger is a button with disabled; clicking should not open
    trigger.click();
    await elementUpdated(el);
    expect(el._open).to.be.false;
  });

  it('multiple=false only allows one selection at a time', async () => {
    const el = await fixture(html`
      <sm-select>
        <sm-option value="a">Option A</sm-option>
        <sm-option value="b">Option B</sm-option>
      </sm-select>
    `);
    expect(el.multiple).to.be.false;
    // select a
    el.dispatchEvent(new CustomEvent('sm-option-select', {
      detail: { value: 'a', label: 'Option A' },
      bubbles: false,
    }));
    // simulate via internal handler by dispatching on the option element
    const optA = el.querySelector('sm-option[value="a"]');
    optA.dispatchEvent(new CustomEvent('sm-option-select', {
      detail: { value: 'a', label: 'Option A' },
      bubbles: true,
      composed: true,
    }));
    await elementUpdated(el);
    expect(el.value).to.equal('a');
    // select b
    const optB = el.querySelector('sm-option[value="b"]');
    optB.dispatchEvent(new CustomEvent('sm-option-select', {
      detail: { value: 'b', label: 'Option B' },
      bubbles: true,
      composed: true,
    }));
    await elementUpdated(el);
    expect(el.value).to.equal('b');
  });

  it('dispatches sm-change when value changes', async () => {
    const el = await fixture(html`
      <sm-select>
        <sm-option value="a">Option A</sm-option>
      </sm-select>
    `);
    const changeEvent = oneEvent(el, 'sm-change');
    const optA = el.querySelector('sm-option[value="a"]');
    optA.dispatchEvent(new CustomEvent('sm-option-select', {
      detail: { value: 'a', label: 'Option A' },
      bubbles: true,
      composed: true,
    }));
    const ev = await changeEvent;
    expect(ev.detail.value).to.equal('a');
  });
});
