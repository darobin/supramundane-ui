import { fixture, expect, html, elementUpdated, oneEvent } from '@open-wc/testing';
import '../src/components/sm-radio-group.js';
import '../src/components/sm-radio.js';

describe('sm-radio-group', () => {
  it('renders', async () => {
    const el = await fixture(html`<sm-radio-group></sm-radio-group>`);
    expect(el.shadowRoot).to.exist;
  });

  it('defaults orientation to vertical', () => {
    const el = document.createElement('sm-radio-group');
    expect(el.orientation).to.equal('vertical');
  });

  it('value property can be set', async () => {
    const el = await fixture(html`
      <sm-radio-group>
        <sm-radio value="a">A</sm-radio>
        <sm-radio value="b">B</sm-radio>
      </sm-radio-group>
    `);
    el.value = 'a';
    await elementUpdated(el);
    expect(el.value).to.equal('a');
  });

  it('child sm-radio elements receive name from radio-group', async () => {
    const el = await fixture(html`
      <sm-radio-group name="color">
        <sm-radio value="red">Red</sm-radio>
        <sm-radio value="blue">Blue</sm-radio>
      </sm-radio-group>
    `);
    await elementUpdated(el);
    const radios = el.querySelectorAll('sm-radio');
    for (const radio of radios) {
      expect(radio.name).to.equal('color');
    }
  });

  it('setting value on group checks matching radio', async () => {
    const el = await fixture(html`
      <sm-radio-group>
        <sm-radio value="a">A</sm-radio>
        <sm-radio value="b">B</sm-radio>
      </sm-radio-group>
    `);
    el.value = 'b';
    await elementUpdated(el);
    const radios = el.querySelectorAll('sm-radio');
    expect(radios[0].checked).to.be.false;
    expect(radios[1].checked).to.be.true;
  });

  it('selecting a radio updates group value and unchecks others', async () => {
    const el = await fixture(html`
      <sm-radio-group>
        <sm-radio value="a">A</sm-radio>
        <sm-radio value="b">B</sm-radio>
      </sm-radio-group>
    `);
    const radios = el.querySelectorAll('sm-radio');
    // Click first radio via its label
    const label = radios[0].shadowRoot.querySelector('.radio__label');
    label.click();
    await elementUpdated(el);
    expect(el.value).to.equal('a');
    expect(radios[0].checked).to.be.true;
    expect(radios[1].checked).to.be.false;
  });

  it('disabled on group disables all child radios', async () => {
    const el = await fixture(html`
      <sm-radio-group disabled>
        <sm-radio value="a">A</sm-radio>
        <sm-radio value="b">B</sm-radio>
      </sm-radio-group>
    `);
    await elementUpdated(el);
    const radios = el.querySelectorAll('sm-radio');
    for (const radio of radios) {
      expect(radio.disabled).to.be.true;
    }
  });

  it('orientation=horizontal applies the horizontal modifier class to options container', async () => {
    const el = await fixture(html`
      <sm-radio-group orientation="horizontal">
        <sm-radio value="a">A</sm-radio>
      </sm-radio-group>
    `);
    const options = el.shadowRoot.querySelector('.radio-group__options');
    expect(options).to.exist;
    expect(options.classList.contains('radio-group__options--horizontal')).to.be.true;
  });

  it('orientation=vertical does not apply horizontal modifier class', async () => {
    const el = await fixture(html`
      <sm-radio-group orientation="vertical">
        <sm-radio value="a">A</sm-radio>
      </sm-radio-group>
    `);
    const options = el.shadowRoot.querySelector('.radio-group__options');
    expect(options.classList.contains('radio-group__options--horizontal')).to.be.false;
  });
});
