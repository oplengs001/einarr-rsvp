import CaptainBabyEinarr from "@/components/CaptainBabyEinarr";
import HeroAnimations from "@/components/HeroAnimations";
import RsvpInteractive from "@/components/RsvpInteractive";
import SiteFooter from "@/components/SiteFooter";
import {
  Cloud,
  JollyRoger,
  MapPinBadge,
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

          <div className="relative z-20 mx-auto max-w-4xl px-3 pb-28 pt-0 text-center sm:px-6 sm:pb-40">
            <JollyRoger className="mb-1 sm:mb-3" />

            {/* Baby Einarr + Hero Title paired like the invitation card */}
            <div className="mx-auto mt-2 flex max-w-2xl flex-col items-center sm:mt-4 md:flex-row md:items-end md:gap-6 md:pl-2">
              <div className="relative z-10 order-2 -mb-4 mt-2 w-32 shrink-0 sm:w-40 md:order-1 md:-mb-7 md:mt-0 md:w-52 lg:w-56">
                <CaptainBabyEinarr className="w-full" />
              </div>

              <div className="order-1 flex-1 md:order-2 md:pb-7 md:text-left">
                <p className="text-sm font-extrabold text-ink/80 sm:text-lg">
                  You&apos;re invited to the christening of
                </p>
                <h1 className="ink-title mt-1.5 text-[3.25rem] sm:mt-2 sm:text-7xl lg:text-8xl">
                  {EVENT_CONFIG.honoreeDisplay}
                </h1>
                <p className="mx-auto mt-2 max-w-md text-sm font-semibold text-ink/75 sm:mt-4 sm:text-lg md:mx-0">
                  A little rookie is setting sail. Come join the crew and
                  celebrate with us.
                </p>
              </div>
            </div>

            {/* Compact, on-theme torn treasure-map details card */}
            <TornMapCard className="relative z-20">
              <div className="px-4 pb-5 pt-5 sm:px-9 sm:pb-8 sm:pt-7">
                {/* Highlighted Date Banner */}
                <div className="border-b border-ink/20 pb-2 text-center sm:pb-3">
                  <p className="text-base font-black tracking-tight text-ink sm:text-2xl">
                    {EVENT_CONFIG.dateLong}
                  </p>
                </div>

                <dl className="relative mt-2.5 grid grid-cols-2 gap-3 text-center sm:mt-4 sm:gap-6">
                  {/* Sketchy vertical divider between Baptismal and Reception */}
                  <svg
                    viewBox="0 0 6 100"
                    preserveAspectRatio="none"
                    className="pointer-events-none absolute bottom-0.5 left-1/2 top-0.5 h-[calc(100%-0.25rem)] w-1.5 -translate-x-1/2"
                    aria-hidden="true"
                  >
                    <path
                      d="M3 2 Q 2 35, 3.5 55 Q 4.5 78, 2.5 98"
                      stroke="#3a2914"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      fill="none"
                      opacity="0.7"
                      vectorEffect="non-scaling-stroke"
                    />
                  </svg>

                  {[
                    {
                      label: "Baptismal",
                      time: EVENT_CONFIG.baptismalTime,
                      venue: EVENT_CONFIG.baptismalVenue,
                      mapUrl: EVENT_CONFIG.baptismalMapUrl,
                      colClass: "pr-1 sm:pr-2",
                    },
                    {
                      label: "Reception",
                      time: EVENT_CONFIG.receptionTime,
                      venue: EVENT_CONFIG.venueDisplay,
                      mapUrl: EVENT_CONFIG.venueMapUrl,
                      colClass: "pl-1 sm:pl-2",
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className={`flex flex-col items-center ${item.colClass}`}
                    >
                      <dt className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-wood sm:text-xs">
                        {item.label}
                      </dt>
                      <dd className="mt-0.5 text-base font-black tracking-tight text-ink sm:text-xl">
                        {item.time}
                      </dd>
                      <dd className="mt-1.5 flex w-full flex-1 items-center justify-center py-0.5 sm:mt-2.5 sm:py-1">
                        <a
                          href={item.mapUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-plank btn-plank-map group relative ml-2 max-w-[calc(100%-0.5rem)] sm:ml-3 sm:max-w-none"
                        >
                          <MapPinBadge className="pointer-events-none absolute -left-3 top-1/2 h-6 w-6 -translate-y-1/2 drop-shadow-[1.5px_1.5px_0_#1b1b1f] transition-transform group-hover:scale-105 sm:-left-4 sm:h-8 sm:w-8" />
                          <span>
                            {item.venue}{" "}
                            <span
                              className="inline-block text-[10px] font-black text-sun sm:text-xs"
                              aria-hidden="true"
                            >
                              ↗
                            </span>
                          </span>
                        </a>
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </TornMapCard>

            <div className="mt-6 flex justify-center sm:mt-9">
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
