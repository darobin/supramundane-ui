
import { LitElement } from 'lit';

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
