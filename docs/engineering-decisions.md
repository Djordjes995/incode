# Engineering Decisions

A few notes on decisions I made while building this, mostly to give context on tradeoffs rather than leaving them as unexplained choices.

## 1) Style isolation

I went with CSS Modules and a scoped class prefix rather than Shadow DOM. Shadow DOM gives you bulletproof style isolation, but it makes theming and overrides significantly more painful for host apps — you lose the ability to easily customize anything from outside. For this assignment, CSS Modules with a unique prefix is a clean middle ground: styles don't bleed out, and host apps can still override things if they need to. Not 100% conflict-proof in every edge case, but it keeps integration simple and debuggable.

If strict isolation ever became a hard requirement, switching to Shadow DOM is a contained change.

## 2) Monorepo dev flow

I linked the SDK as a workspace package so the demo app always runs against the live source. This means no manual rebuilds while iterating — the feedback loop stays fast. I still run `pnpm build` before any distribution-level check to make sure the compiled output is valid, but day-to-day the source link is much more ergonomic.

## 3) Types first, then components

I defined the SDK's TypeScript contracts (`IdentityInput`, `IdentityResult`, etc.) before writing any component code. SDK consumers depend on a stable API surface, so locking that down first meant the demo app integration didn't need to change every time I touched an internal implementation detail.

## 4) Headless SDK

The SDK exposes individual components — `SelfieCapture`, `PhoneInput`, `AddressForm` — and a `getIdentityData` function, but it doesn't own the step flow or orchestration. That lives in the host app (SkyRent).

The reason is flexibility. Different products will want different UX flows around identity capture — some linear, some in a modal, some with different step ordering. If the SDK baked in a fixed wizard, it would work fine for one use case and be annoying to work around for everything else. Keeping the SDK headless means each component is independently droppable into whatever flow the host needs.

The tradeoff is slightly more wiring on the host side, but clear typed contracts keep that manageable. If a team wanted a low-code option, a prebuilt `IdentityWizard` wrapper on top of these primitives would be straightforward to add later.

## 5) Uncontrolled inputs

The SDK components use `defaultValue` + `onChange` rather than being fully controlled. This was a deliberate call, especially for `PhoneInput` — if you make a phone input fully controlled, React re-renders on every keystroke and you end up fighting cursor-jump issues with any formatting logic. Uncontrolled inputs sidestep that entirely. The `onChange` payload is rich enough (`display`, `normalized`, `isValid`) that host apps get everything they need without managing internal input state themselves.

To reset a component, you remount it via React's `key` prop — which is idiomatic React and keeps the SDK's internal state model simple.

## 6) PhoneInput country list

I shipped a curated list of ~20 countries rather than exposing all ~250 that `libphonenumber-js` supports. Supporting all countries isn't just a data problem — it means building a searchable combobox with keyboard navigation, ARIA attributes, and filter state. That's a non-trivial component on its own and well outside the scope of this assignment.

The curated list covers common regions and everything the demo needs. `libphonenumber-js` already validates any country correctly, so extending the list is a one-liner per entry. A natural next step would be accepting a `countries` prop so host apps can override it.

## 7) Test scope

I wrote unit tests for the two pieces of pure business logic: `generateVerificationScore` and `getIdentityData`. These are the functions with actual spec-derived rules (the 30/70 split, the ≥50 threshold for "verified") — the tests that would catch a real regression.

I skipped component tests and E2E for this submission. Component tests here would mostly be asserting that React renders inputs and buttons, not testing any meaningful logic. The setup cost for `SelfieCapture` alone (jsdom, mocking `getUserMedia`) is significant relative to what you'd actually be testing. E2E tests need a running server and browser automation — reasonable for a production project, out of scope for an assignment.

If this were a production SDK, the next testing layer would be React Testing Library tests for the form validation behavior in `AddressForm` and `PhoneInput`, and Playwright smoke tests for the SkyRent flow end-to-end.

## 8) Styling scope in the demo app

The demo app is styled well enough to demonstrate the flow clearly, but I intentionally didn't go deep on UI polish — that felt like the wrong place to spend time on an assignment focused on SDK design.

A few things I'd add with more time:

- **Cart feedback** — right now adding a drone to the cart is silent. A snackbar or a brief animation on the cart count would make the interaction feel more responsive and confirm the action to the user.
- **Field and spacing refinement** — the form layouts work but could use another pass to tighten up spacing, alignment, and visual rhythm across steps.
- **SDK style overrides** — the SDK components bring their own styles, which keeps them self-contained, but in a real integration you'd want the verification steps to feel like part of the app rather than an embedded widget. The SDK exposes a `className` prop on each component for this reason — a production integration would use it to override tokens and match the host app's design system.
