import HeroAnimations from "@/components/HeroAnimations";
import RsvpInteractive from "@/components/RsvpInteractive";
import SiteFooter from "@/components/SiteFooter";
import {
  Cloud,
  JollyRoger,
  Seagulls,
  ShipHelmBadge,
  TornMapCard,
  Waves,
  WindWisps,
} from "@/components/Scenery";
import { EVENT_CONFIG } from "@/config/event";

export default function HomePage() {
  return (
    <>
      <main>
        {/* Hero */}
        <HeroAnimations className="relative overflow-hidden bg-azure">
          <Cloud className="absolute -left-16 top-4 w-36 sm:-left-10 sm:top-8 sm:w-64" />
          <Cloud className="absolute -right-12 top-24 w-32 sm:-right-8 sm:top-28 sm:w-56" />
          <Cloud className="absolute bottom-32 left-[8%] hidden w-32 md:block" />
          <Cloud className="absolute right-[10%] top-56 hidden w-24 md:block" />

          <Seagulls className="absolute inset-0 z-10" />
          <WindWisps className="absolute inset-0 z-10" />

          <div className="relative z-20 mx-auto max-w-3xl px-4 pb-36 pt-0 text-center sm:px-6 sm:pb-44">
            <JollyRoger className="mb-2 sm:mb-3" />

            <p className="mt-5 text-base font-extrabold text-ink/80 sm:mt-7 sm:text-lg">
              You&apos;re invited to the christening of
            </p>
            <h1 className="ink-title mt-2 text-6xl sm:mt-3 sm:text-9xl">
              {EVENT_CONFIG.honoreeDisplay}
            </h1>
            <p className="mx-auto mt-4 max-w-md text-base font-semibold text-ink/75 sm:mt-6 sm:text-lg">
              A little rookie is setting sail. Come join the crew and celebrate
              with us.
            </p>

            {/* Torn treasure-map style When & Where banner (horizontal on all devices) */}
            <TornMapCard className="mt-8 sm:mt-9">
              <dl className="relative grid grid-cols-2 text-left">
                {/* Sketchy vertical divider between When and Where */}
                <svg
                  viewBox="0 0 6 100"
                  preserveAspectRatio="none"
                  className="pointer-events-none absolute bottom-3 left-1/2 top-3 h-[calc(100%-1.5rem)] w-1.5 -translate-x-1/2"
                  aria-hidden="true"
                >
                  <path
                    d="M3 2 Q 2 35, 3.5 55 Q 4.5 78, 2.5 98"
                    stroke="#3a2914"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    fill="none"
                    opacity="0.75"
                    vectorEffect="non-scaling-stroke"
                  />
                </svg>

                <div className="py-3 pl-4 pr-3 sm:py-5 sm:pl-9 sm:pr-6">
                  <dt className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-wood sm:text-[11px]">
                    When
                  </dt>
                  <dd className="mt-0.5 text-xs font-extrabold leading-tight text-ink sm:mt-1 sm:text-lg">
                    {EVENT_CONFIG.dateLong}
                  </dd>
                </div>
                <div className="py-3 pl-3 pr-4 sm:py-5 sm:pl-6 sm:pr-9">
                  <dt className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-wood sm:text-[11px]">
                    Where
                  </dt>
                  <dd className="mt-0.5 text-xs font-extrabold leading-tight text-ink sm:mt-1 sm:text-lg">
                    <a
                      href={EVENT_CONFIG.venueMapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 underline decoration-ink/40 decoration-2 underline-offset-4 transition hover:text-luffy hover:decoration-luffy"
                    >
                      <span>{EVENT_CONFIG.venueDisplay}</span>
                      <span className="text-[10px] font-bold text-wood sm:text-xs">↗</span>
                    </a>
                  </dd>
                </div>
              </dl>
            </TornMapCard>

            <div className="mt-8 flex justify-center sm:mt-10">
              <a href="#rsvp" className="btn-plank btn-plank-helm relative">
                <ShipHelmBadge className="pointer-events-none absolute -left-5 top-1/2 h-11 w-11 -translate-y-1/2 drop-shadow-[2px_2px_0_#1b1b1f] sm:-left-6 sm:h-12 sm:w-12" />
                <span>RSVP now</span>
              </a>
            </div>
          </div>

          <Waves showShip className="absolute inset-x-0 bottom-0 z-10" />
        </HeroAnimations>

        {/* RSVP */}
        <section
          id="rsvp"
          className="bg-sea px-4 pb-20 pt-6 sm:px-6 sm:pb-24 sm:pt-8"
        >
          <div className="mx-auto max-w-6xl">
            <header className="mb-8 text-center sm:mb-12">
              <h2 className="ink-title text-4xl sm:text-6xl">Join the crew</h2>
              <p className="mt-4 font-semibold text-white/75">
                Fill in your details and we&apos;ll print your bounty poster.
              </p>
            </header>
            <RsvpInteractive />
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
