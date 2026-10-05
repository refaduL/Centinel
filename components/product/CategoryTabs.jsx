// The list of categories itself is NOT hardcoded — it's derived
// automatically from whatever `category` values exist across
// data/products.json, via getCategories() in lib/products.js. So
// adding a new category (e.g. "home-decor") to a product is enough
// for a new tab to appear here on its own.
//
// This LABELS map only controls the *display text* for a category's
// tab — without an entry, a tab still works fine, it just shows the
// raw category string (e.g. "outdoor" instead of "Outdoor"). Add a
// line here when you want a nicer label:
//   "outdoor": "Outdoor",
const LABELS = {
  all: "Everything",
  lamps: "Lamps",
  decor: "Decor",
  dining: "Dining",
};

export default function CategoryTabs({ categories, active, onChange }) {
  return (
    <div className="flex gap-2">
      {categories.map((category) => {
        const isActive = category === active;
        return (
          <button
            key={category}
            type="button"
            onClick={() => onChange(category)}
            aria-pressed={isActive}
            className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
              isActive
                ? "border-ink bg-ink text-paper"
                : "border-ink/20 text-ink/60 hover:border-ink/40"
            }`}
          >
            {LABELS[category] ?? category}
          </button>
        );
      })}
    </div>
  );
}
