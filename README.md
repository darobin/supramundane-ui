# @supramundane/ui

A Lit-based web component library with a `--sm-*` design token system.

## Installation

```sh
npm install @supramundane/ui
npm install lit   # peer dependency
```

## Setup

**From CSS** (Vite, PostCSS, or any bundler that resolves npm specifiers in CSS):

```css
@import "@supramundane/ui/tokens";
```

**From JavaScript:**

```js
import "@supramundane/ui/tokens";  /* requires CSS-capable bundler */
import "@supramundane/ui";         /* registers all custom elements */
```

## Theming

Light theme is the default on `:root`. Apply dark theme to any container:

```html
<div class="sm-theme-dark">…</div>
```

Import individual token sheets if you manage theming yourself:

```css
@import "@supramundane/ui/tokens/base";   /* spacings, fonts, radii, z-indexes … */
@import "@supramundane/ui/tokens/light";
@import "@supramundane/ui/tokens/dark";
```

---

## Components

### `<sm-avatar>`

Displays an avatar image, initials, or a fallback user icon.

```html
<sm-avatar image="/photo.jpg" label="Ada Lovelace"></sm-avatar>
<sm-avatar initials="AL" shape="rounded"></sm-avatar>
<sm-avatar size="large"></sm-avatar>
```

| Attribute | Values | Default |
|-----------|--------|---------|
| `image` | URL string | — |
| `label` | string (aria-label) | — |
| `initials` | string | — |
| `shape` | `circle` `square` `rounded` | `circle` |
| `size` | `small` `medium` `large` | `medium` |

---

### `<sm-breadcrumb>`, `<sm-breadcrumb-item>`

Navigation path. The last item is marked `current` automatically.

```html
<sm-breadcrumb label="Site navigation">
  <sm-breadcrumb-item href="/">Home</sm-breadcrumb-item>
  <sm-breadcrumb-item href="/products">Products</sm-breadcrumb-item>
  <sm-breadcrumb-item>Widget</sm-breadcrumb-item>
</sm-breadcrumb>
```

`sm-breadcrumb-item` attributes: `href`, `target`, `rel`. Custom separator via `slot="separator"`.

---

### `<sm-button>`

```html
<sm-button variant="primary" size="large">Save</sm-button>
<sm-button outline pill>Outline pill</sm-button>
<sm-button loading disabled>Saving…</sm-button>
<sm-button href="/dashboard">Link button</sm-button>
```

Variants: `default` `primary` `success` `neutral` `warning` `danger` `text`  
Sizes: `small` `medium` `large`  
Modifiers: `outline` `pill` `circle` `disabled` `loading`  
Slots: default, `prefix`, `suffix`  
Link mode: set `href` (also `target`, `download`)  
Form: `type`, `name`, `value`, `form`

---

### `<sm-icon-button>`

Circular icon-only button. Requires `label` for accessibility.

```html
<sm-icon-button label="Delete" variant="danger">
  <svg>…</svg>
</sm-icon-button>
```

Same `variant`, `size`, `disabled`, `loading`, `href` API as `<sm-button>`.

---

### `<sm-card>`

```html
<sm-card>
  <img slot="image" src="cover.jpg" alt="">
  <h2 slot="header">Card title</h2>
  Main body content.
  <div slot="footer">Footer actions</div>
</sm-card>
```

Slots: `image` (top), `header`, default (body), `footer`. Header and footer are hidden when their slot is empty.

---

### `<sm-checkbox>`

```html
<sm-checkbox name="agree" value="yes">I agree</sm-checkbox>
<sm-checkbox checked disabled>Pre-checked</sm-checkbox>
<sm-checkbox indeterminate>Partial</sm-checkbox>
```

Attributes: `name` `value` `checked` `indeterminate` `disabled` `required` `size` (`small`/`medium`/`large`)  
Events: `sm-change`, `sm-input`  
Form-associated.

---

### `<sm-color-picker>`

```html
<sm-color-picker value="#3b82f6"></sm-color-picker>
<sm-color-picker format="hsl" opacity></sm-color-picker>
```

Attributes: `value` (hex), `format` (`hex`/`rgb`/`hsl`), `disabled`, `opacity` (show alpha slider), `swatches` (JSON array of hex strings)  
Event: `sm-change` (detail: `{value}`)  
Form-associated.

---

### `<sm-copy-button>`

```html
<sm-copy-button value="Text to copy"></sm-copy-button>
<sm-copy-button value="npm install" success-label="Copied!" feedback-duration="2000"></sm-copy-button>
```

Attributes: `value`, `label`, `success-label`, `error-label`, `feedback-duration` (ms)  
Events: `sm-copy`, `sm-error`

---

### `<sm-dialog>`

```html
<sm-dialog label="Confirm action">
  Are you sure?
  <div slot="footer">
    <sm-button variant="primary" @click=${() => dialog.hide()}>OK</sm-button>
  </div>
</sm-dialog>
```

```js
document.querySelector('sm-dialog').show();
```

Attributes: `open`, `label`, `no-header`  
Slots: `label`, default (body), `header`, `footer`  
Methods: `show()`, `hide()`  
Events: `sm-show`, `sm-hide`, `sm-initial-focus`, `sm-request-close` (cancelable — `e.preventDefault()` keeps dialog open)

---

### `<sm-divider>`

```html
<sm-divider></sm-divider>
<sm-divider vertical></sm-divider>
<sm-divider dashed></sm-divider>
```

Attributes: `vertical`, `dashed`

---

### `<sm-drawer>`

```html
<sm-drawer label="Settings" placement="end">
  Content here.
  <div slot="footer"><sm-button>Close</sm-button></div>
</sm-drawer>
```

Attributes: `open`, `label`, `placement` (`top`/`bottom`/`start`/`end`)  
Slots: `label`, default, `header`, `footer`  
Methods: `show()`, `hide()`  
Events: same as `sm-dialog`

---

### `<sm-dropdown>`, `<sm-menu>`, `<sm-menu-item>`

```html
<sm-dropdown>
  <sm-button slot="trigger">Options ▾</sm-button>
  <sm-menu>
    <sm-menu-item value="edit">Edit</sm-menu-item>
    <sm-menu-item value="delete" type="checkbox" checked>Checked item</sm-menu-item>
    <hr>
    <sm-menu-item value="archive" disabled>Archive</sm-menu-item>
  </sm-menu>
</sm-dropdown>
```

`sm-dropdown` attributes: `open`, `placement`, `distance`, `disabled`, `stay-open-on-select`  
`sm-menu-item` attributes: `value`, `type` (`normal`/`checkbox`/`radio`), `checked`, `disabled`  
`sm-menu-item` slots: default (label), `prefix`, `suffix`  
Events: `sm-select` (detail: `{item, value}`) bubbles from menu-item; `sm-show`/`sm-hide` on dropdown

---

### `<sm-format-bytes>`

```html
<sm-format-bytes value="1536"></sm-format-bytes>       <!-- 1.5 KB -->
<sm-format-bytes value="2048" display="long"></sm-format-bytes>
```

Attributes: `value` (Number), `unit` (`byte`/`bit`), `display` (`short`/`long`/`narrow`), `locale`

---

### `<sm-format-date>`

```html
<sm-format-date month="long" day="numeric" year="numeric"></sm-format-date>
<sm-format-date date="2025-01-15" hour="numeric" minute="numeric"></sm-format-date>
```

Attributes: `date`, `weekday`, `era`, `year`, `month`, `day`, `hour`, `minute`, `second`, `time-zone-name`, `time-zone`, `hour-format` (`auto`/`12`/`24`), `locale`

---

### `<sm-format-number>`

```html
<sm-format-number value="1234567.89" type="currency" currency="USD"></sm-format-number>
<sm-format-number value="0.42" type="percent"></sm-format-number>
```

Attributes: `value`, `type` (`decimal`/`currency`/`percent`/`unit`), `currency`, `currency-display`, `unit`, `unit-display`, `no-grouping`, `minimum-fraction-digits`, `maximum-fraction-digits`, `locale`

---

### `<sm-infinite-scroll>`

```html
<sm-infinite-scroll @sm-load-more=${loadMore}>
  <div>…items…</div>
</sm-infinite-scroll>
```

Attributes: `distance` (px before sentinel, default 0), `loading`, `disabled`  
Event: `sm-load-more`  
Shows a spinner when `loading=true`.

---

### `<sm-input>`

```html
<sm-input label="Email" type="email" placeholder="you@example.com" required></sm-input>
<sm-input type="password" password-toggle clearable></sm-input>
<sm-input size="small" filled pill>
  <svg slot="prefix">…</svg>
</sm-input>
```

Attributes: `type`, `name`, `value`, `placeholder`, `label`, `help-text`, `size`, `filled`, `pill`, `clearable`, `password-toggle`, `disabled`, `readonly`, `required`, `minlength`, `maxlength`, `min`, `max`, `step`, `pattern`, `autocomplete`  
Slots: `prefix`, `suffix`, `label`, `help-text`  
Events: `sm-input`, `sm-change`, `sm-focus`, `sm-blur`, `sm-clear`  
Form-associated.

---

### `<sm-option>`

Used inside `<sm-select>`. Renders as a `role="option"` list item.

```html
<sm-option value="cat">Cat</sm-option>
<sm-option value="dog" disabled>Dog (unavailable)</sm-option>
```

Attributes: `value`, `disabled`, `selected`

---

### `<sm-progress-bar>`

```html
<sm-progress-bar value="60"></sm-progress-bar>
<sm-progress-bar indeterminate label="Loading content"></sm-progress-bar>
```

Attributes: `value`, `max` (default 100), `indeterminate`, `label`  
CSS custom property: `--sm-progress-bar-height` (default 4px)

---

### `<sm-radio>`, `<sm-radio-group>`

```html
<sm-radio-group name="size" value="m" label="T-shirt size">
  <sm-radio value="s">Small</sm-radio>
  <sm-radio value="m">Medium</sm-radio>
  <sm-radio value="l">Large</sm-radio>
</sm-radio-group>
```

`sm-radio-group` attributes: `name`, `value`, `label`, `required`, `disabled`, `orientation` (`horizontal`/`vertical`), `help-text`  
`sm-radio` attributes: `value`, `checked`, `disabled`, `size`  
Events: `sm-change` (on radio-group)  
Form-associated.

---

### `<sm-range>`

```html
<sm-range label="Volume" min="0" max="100" value="50"></sm-range>
<sm-range step="0.1" tooltip="bottom"></sm-range>
```

Attributes: `name`, `value`, `min`, `max`, `step`, `disabled`, `label`, `help-text`, `tooltip` (`top`/`bottom`/`none`)  
Events: `sm-change`, `sm-input`  
Form-associated.

---

### `<sm-rating>`

```html
<sm-rating value="3.5" precision="0.5"></sm-rating>
<sm-rating value="4" max="10" readonly></sm-rating>
```

Attributes: `value`, `max` (default 5), `precision` (`1`/`0.5`), `readonly`, `disabled`, `label`  
Event: `sm-change`  
CSS custom property: `--sm-rating-symbol-size`

---

### `<sm-relative-time>`

```html
<sm-relative-time date="2024-01-01"></sm-relative-time>  <!-- e.g. "last year" -->
<sm-relative-time date=${new Date()} sync format="short"></sm-relative-time>
```

Attributes: `date` (Date/string/timestamp), `format` (`long`/`short`/`narrow`), `numeric` (`always`/`auto`), `locale`, `sync` (auto-update every minute)

---

### `<sm-select>`

```html
<sm-select label="Country" placeholder="Choose a country" name="country">
  <sm-option value="us">United States</sm-option>
  <sm-option value="uk">United Kingdom</sm-option>
  <sm-option value="ca">Canada</sm-option>
</sm-select>

<sm-select multiple clearable>…</sm-select>
```

Attributes: `name`, `value`, `multiple`, `size`, `placeholder`, `disabled`, `clearable`, `required`, `max-options-visible`  
Events: `sm-change`  
Form-associated.

---

### `<sm-split-panel>`

```html
<sm-split-panel position="30">
  <div slot="start">Sidebar</div>
  <div slot="end">Main content</div>
</sm-split-panel>

<sm-split-panel vertical>…</sm-split-panel>
```

Attributes: `position` (0–100, default 50), `primary` (`start`/`end`), `vertical`, `disabled`, `snap-threshold` (px)  
Event: `sm-reposition` (detail: `{position}`)  
Slot: `divider` (custom handle)

---

### `<sm-tabbed-pane>`, `<sm-tab-panel>`

```html
<sm-tabbed-pane closable>
  <sm-tab-panel label="General">
    <svg slot="icon">…</svg>
    Content here.
  </sm-tab-panel>
  <sm-tab-panel label="Advanced" disabled>…</sm-tab-panel>
</sm-tabbed-pane>
```

`sm-tab-panel` attributes: `label`, `active`, `disabled`  
`sm-tab-panel` slot: `icon` (appears in tab button)  
`sm-tabbed-pane` attributes: `closable` (shows close × per tab)  
Event: `sm-tab-close` (cancelable, detail: `{panel}`)  
Keyboard: Arrow keys, Home, End

---

### `<sm-tag>`

```html
<sm-tag variant="primary">New</sm-tag>
<sm-tag variant="success" pill removable @sm-remove=${handleRemove}>Beta</sm-tag>
```

Attributes: `variant` (`default`/`primary`/`success`/`warning`/`danger`/`neutral`), `size`, `removable`, `pill`  
Event: `sm-remove` (cancelable)  
Slot: default, `prefix`

---

### `<sm-textarea>`

```html
<sm-textarea label="Message" rows="6" resize="auto"></sm-textarea>
<sm-textarea placeholder="Notes…" filled disabled></sm-textarea>
```

Attributes: `name`, `value`, `rows`, `resize` (`none`/`vertical`/`auto`), `label`, `help-text`, `placeholder`, `disabled`, `readonly`, `required`, `minlength`, `maxlength`, `autocomplete`, `size`, `filled`  
Events: `sm-input`, `sm-change`, `sm-focus`, `sm-blur`  
Form-associated.

---

### `<sm-toolbar>`

```html
<sm-toolbar>
  <sm-icon-button label="Bold"><svg>…</svg></sm-icon-button>
  <sm-icon-button label="Italic"><svg>…</svg></sm-icon-button>
  <hr>
  <sm-icon-button label="Save"><svg>…</svg></sm-icon-button>
</sm-toolbar>
```

`<hr>` children are styled as vertical dividers.

---

### `<sm-tooltip>`

```html
<sm-tooltip content="This is a tooltip">
  <sm-button>Hover me</sm-button>
</sm-tooltip>

<sm-tooltip placement="right" trigger="click">
  <span slot="content">Rich <strong>HTML</strong> content</span>
  <sm-button>Click me</sm-button>
</sm-tooltip>
```

Attributes: `content`, `placement` (`top`/`top-start`/`top-end`/`bottom`/… /`left`/`right`), `trigger` (`hover focus`/`hover`/`focus`/`click`/`manual`), `disabled`, `distance`, `skidding`, `hoist`  
Slots: default (trigger), `content` (overrides `content` attr)  
Events: `sm-show`, `sm-hide`

---

### `<sm-tree>`, `<sm-tree-item>`

```html
<sm-tree selection="single">
  <sm-tree-item>
    Documents
    <sm-tree-item>Reports</sm-tree-item>
    <sm-tree-item expanded>
      Archive
      <sm-tree-item>2023</sm-tree-item>
      <sm-tree-item>2024</sm-tree-item>
    </sm-tree-item>
  </sm-tree-item>
  <sm-tree-item lazy @sm-lazy-load=${loadChildren}>Remote folder</sm-tree-item>
</sm-tree>
```

`sm-tree` attributes: `selection` (`none`/`single`/`multiple`), `indent-guides`  
`sm-tree-item` attributes: `expanded`, `selected`, `disabled`, `lazy`, `loading`  
`sm-tree-item` events: `sm-expand`, `sm-collapse`, `sm-lazy-load`  
`sm-tree` event: `sm-selection-change` (detail: `{selection: [...items]}`)

---

## Icons

Icons are named exports and are **functions** — call them to get a Lit `TemplateResult`. Pass `{ slot }` to add a `slot` attribute, which lets you slot an icon directly into any component that accepts one.

```js
import { iconCheck, iconSearch, iconUser } from "@supramundane/ui";

// Plain usage (no slot)
html`<span>${iconCheck()}</span>`

// With a slot attribute — works anywhere a slotted icon is accepted
html`
  <sm-button>
    ${iconCheck({ slot: 'prefix' })}
    Save
  </sm-button>

  <sm-tab-panel label="Search">
    ${iconSearch({ slot: 'icon' })}
    Search content here.
  </sm-tab-panel>
`
```

Available icons:

```js
import {
  iconCheck, iconX, iconChevronDown, iconChevronUp, iconChevronLeft, iconChevronRight,
  iconSearch, iconPlus, iconMinus, iconCopy, iconStar, iconStarFilled,
  iconEye, iconEyeSlash, iconGripVertical, iconUser, iconMenu, iconSettings,
  iconSpinner, iconDownload, iconUpload, iconExternalLink,
  iconExclamationCircle, iconInfoCircle, iconExclamationTriangle,
} from "@supramundane/ui";
```

## Testing

```sh
npm test          # run once (Chromium via Playwright)
npm run test:watch
```

Tests are in `test/` and use [`@web/test-runner`](https://modern-web.dev/docs/test-runner/overview/) with `@open-wc/testing` (Mocha + Chai) against a real Chromium browser.

## License

Apache-2.0
