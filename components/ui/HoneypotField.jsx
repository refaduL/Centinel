/**
 * Paired with useSpamGuard.js. Positioned off-screen (not
 * `display: none` or `type="hidden"` — some bots specifically skip
 * those since they're common honeypot tells; an off-screen visible
 * input is harder for a naive bot to detect as a trap) and hidden
 * from assistive tech (`aria-hidden`, `tabIndex={-1}`) so a sighted
 * or screen-reader user never encounters it, but a bot that
 * mechanically fills every <input> on the page still finds it.
 * `name="company"` on purpose — it's a common real field name, which
 * is exactly why bots tend to autofill it.
 */
export default function HoneypotField({ value, onChange }) {
  return (
    <input
      type="text"
      name="company"
      value={value}
      onChange={onChange}
      tabIndex={-1}
      autoComplete="off"
      aria-hidden="true"
      className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden"
    />
  );
}
