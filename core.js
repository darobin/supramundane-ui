
import { LitElement, defaultConverter } from 'lit';

export class SupramundaneElement extends LitElement {
  emit (name, options) {
    const event = new CustomEvent(name, {
      bubbles: true,
      cancelable: true,
      composed: true,
      detail: {},
      ...options,
    });
    this.dispatchEvent(event);
    return event;
  }
}

// We store a WeakMap of forms + controls so we can keep references to all Shoelace controls within a given form. As
// elements connect and disconnect to/from the DOM, their containing form is used as the key and the form control is
// added and removed from the form's set, respectively.
export const formCollections = new WeakMap();

// We store a WeakMap of reportValidity() overloads so we can override it when form controls connect to the DOM and
// restore the original behavior when they disconnect.
const reportValidityOverloads = new WeakMap();
const checkValidityOverloads = new WeakMap();

// We store a Set of controls that users have interacted with. This allows us to determine the interaction state
// without littering the DOM with additional data attributes.
const userInteractedControls = new WeakSet();

// We store a WeakMap of interactions for each form control so we can track when all conditions are met for validation.
const interactions = new WeakMap();

export class FormControlController {
  constructor (host, options) {
    (this.host = host).addController(this);
    this.options = {
      form: input => {
        // If there's a form attribute, use it to find the target form by id
        // Controls may not always reflect the 'form' property. For example, `<sm-button>` doesn't reflect.
        const formId = input.form;
        if (formId) {
          const root = input.getRootNode();
          const form = root.querySelector(`#${formId}`);
          if (form) return form;
        }
        return input.closest('form');
      },
      name: input => input.name,
      value: input => input.value,
      defaultValue: input => input.defaultValue,
      disabled: input => input.disabled ?? false,
      reportValidity: input => (typeof input.reportValidity === 'function' ? input.reportValidity() : true),
      checkValidity: input => (typeof input.checkValidity === 'function' ? input.checkValidity() : true),
      setValue: (input, value) => (input.value = value),
      assumeInteractionOn: ['sm-input'],
      ...options
    };
  }
  hostConnected () {
    const form = this.options.form(this.host);
    if (form) this.#attachForm(form);
    interactions.set(this.host, []);
    this.options.assumeInteractionOn.forEach(event => {
      this.host.addEventListener(event, this.#handleInteraction);
    });
  }
  hostDisconnected () {
    this.#detachForm();
    interactions.delete(this.host);
    this.options.assumeInteractionOn.forEach(event => {
      this.host.removeEventListener(event, this.#handleInteraction);
    });
  }
  hostUpdated () {
    const form = this.options.form(this.host);
    if (!form) this.#detachForm();
    if (form && this.form !== form) {
      this.#detachForm();
      this.#attachForm(form);
    }
    if (this.host.hasUpdated) {
      this.setValidity(this.host.validity.valid);
    }
  }
  #attachForm (form) {
    if (form) {
      this.form = form;
      if (formCollections.has(this.form)) {
        formCollections.get(this.form)?.add(this.host);
      }
      else {
        formCollections.set(this.form, new Set([this.host]));
      }
      this.form.addEventListener('formdata', this.#handleFormData);
      this.form.addEventListener('submit', this.#handleFormSubmit);
      this.form.addEventListener('reset', this.#handleFormReset);
      if (!reportValidityOverloads.has(this.form)) {
        reportValidityOverloads.set(this.form, this.form.reportValidity);
        this.form.reportValidity = () => this.#reportFormValidity();
      }
      if (!checkValidityOverloads.has(this.form)) {
        checkValidityOverloads.set(this.form, this.form.checkValidity);
        this.form.checkValidity = () => this.#checkFormValidity();
      }
    }
    else {
      this.form = undefined;
    }
  }
  #detachForm () {
    if (!this.form) return;
    const formCollection = formCollections.get(this.form);
    if (!formCollection) return;
    formCollection.delete(this.host);
    // Check to make sure there's no other form controls in the collection. If we do this
    // without checking if any other controls are still in the collection, then we will wipe out the
    // validity checks for all other elements.
    // see: https://github.com/shoelace-style/shoelace/issues/1703
    if (formCollection.size <= 0) {
      this.form.removeEventListener('formdata', this.#handleFormData);
      this.form.removeEventListener('submit', this.#handleFormSubmit);
      this.form.removeEventListener('reset', this.#handleFormReset);
      if (reportValidityOverloads.has(this.form)) {
        this.form.reportValidity = reportValidityOverloads.get(this.form);
        reportValidityOverloads.delete(this.form);
      }
      if (checkValidityOverloads.has(this.form)) {
        this.form.checkValidity = checkValidityOverloads.get(this.form);
        checkValidityOverloads.delete(this.form);
      }
      // So it looks weird here to not always set the form to undefined. But I _think_ if we unattach this.form here,
      // we end up in this fun spot where future validity checks don't have a reference to the form validity handler.
      // First form element in sets the validity handler. So we can't clean up `this.form` until there are no other form elements in the form.
      this.form = undefined;
    }
  }
  #handleFormData = (event) => {
    const disabled = this.options.disabled(this.host);
    const name = this.options.name(this.host);
    const value = this.options.value(this.host);
    // For buttons, we only submit the value if they were the submitter. This is currently done in doAction() by
    // injecting the name/value on a temporary button, so we can just skip them here.
    const isButton = this.host.tagName.toLowerCase() === 'sm-button';
    if (
      this.host.isConnected &&
      !disabled &&
      !isButton &&
      typeof name === 'string' &&
      name.length > 0 &&
      typeof value !== 'undefined'
    ) {
      if (Array.isArray(value)) {
        (value).forEach(val => {
          event.formData.append(name, (val).toString());
        });
      }
      else {
        event.formData.append(name, (value).toString());
      }
    }
  };
  #handleFormSubmit = (event) => {
    const disabled = this.options.disabled(this.host);
    const reportValidity = this.options.reportValidity;
    if (this.form && !this.form.noValidate) {
      formCollections.get(this.form)?.forEach(control => {
        this.#setUserInteracted(control, true);
      });
    }
    if (this.form && !this.form.noValidate && !disabled && !reportValidity(this.host)) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  };
  #handleFormReset = () => {
    this.options.setValue(this.host, this.options.defaultValue(this.host));
    this.#setUserInteracted(this.host, false);
    interactions.set(this.host, []);
  };
  #handleInteraction = (event) => {
    const emittedEvents = interactions.get(this.host);
    if (!emittedEvents.includes(event.type)) {
      emittedEvents.push(event.type);
    }
    // Mark it as user-interacted as soon as all associated events have been emitted
    if (emittedEvents.length === this.options.assumeInteractionOn.length) {
      this.#setUserInteracted(this.host, true);
    }
  };
  #checkFormValidity = () => {
    // This is very similar to the `reportFormValidity` function, but it does not trigger native constraint validation
    // Allow the user to simply check if the form is valid and handling validity in their own way.
    //
    // We preserve the original method in a WeakMap, but we don't call it from the overload because that would trigger
    // validations in an unexpected order. When the element disconnects, we revert to the original behavior. This won't
    // be necessary once we can use ElementInternals.
    //
    // Note that we're also honoring the form's novalidate attribute.
    if (this.form && !this.form.noValidate) {
      // This seems sloppy, but checking all elements will cover native inputs, Shoelace inputs, and other custom
      // elements that support the constraint validation API.
      const elements = this.form.querySelectorAll('*');
      for (const element of elements) {
        if (typeof element.checkValidity === 'function') {
          if (!element.checkValidity()) return false;
        }
      }
    }
    return true;
  };
  #reportFormValidity = () => {
    // Shoelace form controls work hard to act like regular form controls. They support the Constraint Validation API
    // and its associated methods such as setCustomValidity() and reportValidity(). However, the HTMLFormElement also
    // has a reportValidity() method that will trigger validation on all child controls. Since we're not yet using
    // ElementInternals, we need to overload this method so it looks for any element with the reportValidity() method.
    //
    // We preserve the original method in a WeakMap, but we don't call it from the overload because that would trigger
    // validations in an unexpected order. When the element disconnects, we revert to the original behavior. This won't
    // be necessary once we can use ElementInternals.
    //
    // Note that we're also honoring the form's novalidate attribute.
    if (this.form && !this.form.noValidate) {
      // This seems sloppy, but checking all elements will cover native inputs, Shoelace inputs, and other custom
      // elements that support the constraint validation API.
      const elements = this.form.querySelectorAll('*');
      for (const element of elements) {
        if (typeof element.reportValidity === 'function') {
          if (!element.reportValidity()) return false;
        }
      }
    }
    return true;
  };
  #setUserInteracted (el, hasInteracted) {
    if (hasInteracted) {
      userInteractedControls.add(el);
    }
    else {
      userInteractedControls.delete(el);
    }
    el.requestUpdate();
  }
  #doAction (type, submitter) {
    if (this.form) {
      const button = document.createElement('button');
      button.type = type;
      button.style.position = 'absolute';
      button.style.width = '0';
      button.style.height = '0';
      button.style.clipPath = 'inset(50%)';
      button.style.overflow = 'hidden';
      button.style.whiteSpace = 'nowrap';
      if (submitter) {
        button.name = submitter.name;
        button.value = submitter.value;
        ['formaction', 'formenctype', 'formmethod', 'formnovalidate', 'formtarget'].forEach(attr => {
          if (submitter.hasAttribute(attr)) {
            button.setAttribute(attr, submitter.getAttribute(attr));
          }
        });
      }
      this.form.append(button);
      button.click();
      button.remove();
    }
  }
  getForm () {
    return this.form ?? null;
  }
  reset (submitter) {
    this.#doAction('reset', submitter);
  }
  submit (submitter) {
    // Calling form.submit() bypasses the submit event and constraint validation. To prevent this, we can inject a
    // native submit button into the form, "click" it, then remove it to simulate a standard form submission.
    this.#doAction('submit', submitter);
  }
  setValidity (isValid) {
    const host = this.host;
    const hasInteracted = Boolean(userInteractedControls.has(host));
    const required = Boolean(host.required);
    // We're mapping the following "states" to data attributes. In the future, we can use ElementInternals.states to
    // create a similar mapping, but instead of [data-invalid] it will look like :--invalid.
    //
    // See this RFC for more details: https://github.com/shoelace-style/shoelace/issues/1011
    host.toggleAttribute('data-required', required);
    host.toggleAttribute('data-optional', !required);
    host.toggleAttribute('data-invalid', !isValid);
    host.toggleAttribute('data-valid', isValid);
    host.toggleAttribute('data-user-invalid', !isValid && hasInteracted);
    host.toggleAttribute('data-user-valid', isValid && hasInteracted);
  }
  /**
   * Updates the form control's validity based on the current value of `host.validity.valid`. Call this when anything
   * that affects constraint validation changes so the component receives the correct validity states.
   */
  updateValidity () {
    const host = this.host;
    this.setValidity(host.validity.valid);
  }
  /**
   * Dispatches a non-bubbling, cancelable custom event of type `sm-invalid`.
   * If the `sm-invalid` event will be cancelled then the original `invalid`
   * event (which may have been passed as argument) will also be cancelled.
   * If no original `invalid` event has been passed then the `sm-invalid`
   * event will be cancelled before being dispatched.
   */
  emitInvalidEvent (originalInvalidEvent) {
    const slInvalidEvent = new CustomEvent('sm-invalid', {
      bubbles: false,
      composed: false,
      cancelable: true,
      detail: {}
    });
    if (!originalInvalidEvent) slInvalidEvent.preventDefault();
    if (!this.host.dispatchEvent(slInvalidEvent)) originalInvalidEvent?.preventDefault();
  }
}

export class HasSlotController {
  host;
  slotNames = [];
  constructor (host, ...slotNames) {
    (this.host = host).addController(this);
    this.slotNames = slotNames;
  }
  #hasDefaultSlot () {
    return [...this.host.childNodes].some(node => {
      if (node.nodeType === node.TEXT_NODE && node.textContent?.trim() !== '') {
        return true;
      }
      if (node.nodeType === node.ELEMENT_NODE) {
        const el = node;
        const tagName = el.tagName.toLowerCase();
        if (tagName === 'sl-visually-hidden') return false;
        if (!el.hasAttribute('slot')) return true;
      }
      return false;
    });
  }
  #hasNamedSlot (name) {
    return this.host.querySelector(`:scope > [slot="${name}"]`) !== null;
  }
  test (slotName) {
    return slotName === '[default]' ? this.#hasDefaultSlot() : this.#hasNamedSlot(slotName);
  }
  hostConnected () {
    this.host.shadowRoot?.addEventListener('slotchange', this.#handleSlotChange);
  }
  hostDisconnected () {
    this.host.shadowRoot?.removeEventListener('slotchange', this.#handleSlotChange);
  }
  #handleSlotChange = (event) => {
    const slot = event.target;
    if ((this.slotNames.includes('[default]') && !slot.name) || (slot.name && this.slotNames.includes(slot.name))) {
      this.host.requestUpdate();
    }
  };
}

export const defaultValue =
  (propertyName = 'value') =>
  (proto, key) => {
    const ctor = proto.constructor;
    const attributeChangedCallback = ctor.prototype.attributeChangedCallback;
    ctor.prototype.attributeChangedCallback = function (self, name, old, value) {
      const options = ctor.getPropertyOptions(propertyName);
      const attributeName = typeof options.attribute === 'string' ? options.attribute : propertyName;
      if (name === attributeName) {
        const converter = options.converter || defaultConverter;
        const fromAttribute = typeof converter === 'function' ? converter : (converter?.fromAttribute ?? defaultConverter.fromAttribute);
        const newValue = fromAttribute(value, options.type);
        if (self[propertyName] !== newValue) self[key] = newValue;
      }
      attributeChangedCallback.call(self, name, old, value);
    };
  }
;

/**
 * Runs when observed properties change, e.g. @property or @state, but before the component updates. To wait for an
 * update to complete after a change occurs, use `await this.updateComplete` in the handler. To start watching after the
 * initial update/render, use `{ waitUntilFirstUpdate: true }` or `this.hasUpdated` in the handler.
 */
export function watch (propertyName, options) {
  const resolvedOptions = {
    waitUntilFirstUpdate: false,
    ...options
  };
  return (proto, decoratedFnName) => {
    const { update } = proto;
    const watchedProperties = Array.isArray(propertyName) ? propertyName : [propertyName];
    proto.update = function (self, changedProps) {
      watchedProperties.forEach(property => {
        const key = property;
        if (changedProps.has(key)) {
          const oldValue = changedProps.get(key);
          const newValue = self[key];
          if (oldValue !== newValue) {
            if (!resolvedOptions.waitUntilFirstUpdate || self.hasUpdated) {
              (self[decoratedFnName])(oldValue, newValue);
            }
          }
        }
      });
      update.call(self, changedProps);
    };
  };
}
