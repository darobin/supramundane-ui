
import { LitElement, html, css } from 'lit';

export class SmTabPanel extends LitElement {
  static properties = {
    label: { type: String, reflect: true },
    active: { type: Boolean, reflect: true },
    disabled: { type: Boolean, reflect: true },
  };

  static styles = css`
    :host {
      display: block;
    }

    /* Icon is consumed here only so it doesn't render in the panel body.
       sm-tabbed-pane clones it from the light DOM for the tab button. */
    slot[name="icon"] {
      display: none;
    }

    .panel {
      padding: var(--sm-spacing-medium);
    }

    .panel[hidden] {
      display: none;
    }
  `;

  constructor() {
    super();
    this.active = false;
    this.disabled = false;
  }

  render() {
    return html`
      <slot name="icon"></slot>
      <div
        part="base"
        class="panel"
        role="tabpanel"
        ?hidden=${!this.active}
        aria-hidden=${this.active ? 'false' : 'true'}
      >
        <slot></slot>
      </div>
    `;
  }
}

customElements.define('sm-tab-panel', SmTabPanel);
