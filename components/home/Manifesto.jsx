import { BRAND_NAME, BRAND_TAGLINE } from "@/lib/brand";

export default function Manifesto() {
  return (
    <section id="manifesto" className="bg-ink py-24 md:py-32">
      <div className="container-page">
        <p className="text-center text-xs uppercase tracking-widest text-cream/45">
          {BRAND_TAGLINE}
        </p>
        <p className="mx-auto mt-6 max-w-2xl text-balance text-center font-display text-2xl italic leading-relaxed text-paper/90 md:text-3xl">
          We started {BRAND_NAME} on a simple observation: the same room
          looks like a different place at 8am, 6pm, and midnight. We design
          for that change instead of ignoring it: lamps that earn their
          place once the sun goes down, and ceramics finished by hand so
          they hold color the way clay actually does.
        </p>
      </div>
    </section>
  );
}
