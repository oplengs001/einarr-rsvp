import Image from "next/image";
import RsvpInteractive from "@/components/RsvpInteractive";
import SiteFooter from "@/components/SiteFooter";
import { Cloud, Waves } from "@/components/Scenery";
import { EVENT_CONFIG } from "@/config/event";

export default function HomePage() {
  return (
    <>
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden bg-azure">
          <Cloud className="absolute -left-10 top-8 w-44 animate-drift sm:w-64" />
          <Cloud className="absolute -right-8 top-28 w-36 animate-drift [animation-delay:-4s] sm:w-56" />
          <Cloud className="absolute bottom-32 left-[8%] hidden w-32 animate-drift [animation-delay:-2s] md:block" />
          <Cloud className="absolute bottom-40 right-[10%] hidden w-24 animate-drift [animation-delay:-6s] md:block" />

          <div className="relative mx-auto max-w-3xl px-6 pb-36 pt-14 text-center sm:pb-44 sm:pt-20">
            <Image
              src="/op-icons/Luffy.png"
              alt="Straw Hat Jolly Roger"
              width={72}
              height={72}
              priority
              unoptimized
              className="mx-auto h-16 w-16 rounded-xl border-[3px] border-ink shadow-ink-sm sm:h-[72px] sm:w-[72px]"
            />

            <p className="mt-6 text-lg font-extrabold text-ink/80">
              You&apos;re invited to the christening of
            </p>
            <h1 className="ink-title mt-3 text-7xl sm:text-9xl">
              {EVENT_CONFIG.honoreeDisplay}
            </h1>
            <p className="mx-auto mt-6 max-w-md text-lg font-semibold text-ink/75">
              A little rookie is setting sail. Come join the crew and celebrate
              with us.
            </p>

            <dl className="mx-auto mt-9 grid max-w-xl overflow-hidden rounded-xl border-[3px] border-ink bg-paper text-left shadow-ink sm:grid-cols-2">
              <div className="border-b-[3px] border-ink px-6 py-4 sm:border-b-0 sm:border-r-[3px]">
                <dt className="text-xs font-extrabold uppercase tracking-wider text-wood">
                  When
                </dt>
                <dd className="mt-1 text-lg font-extrabold">
                  {EVENT_CONFIG.dateLong}
                </dd>
              </div>
              <div className="px-6 py-4">
                <dt className="text-xs font-extrabold uppercase tracking-wider text-wood">
                  Where
                </dt>
                <dd className="mt-1 text-lg font-extrabold">
                  <a
                    href={EVENT_CONFIG.venueMapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 underline decoration-ink/35 decoration-2 underline-offset-4 transition hover:text-luffy hover:decoration-luffy"
                  >
                    <span>{EVENT_CONFIG.venueDisplay}</span>
                    <span className="text-xs font-bold text-wood">↗</span>
                  </a>
                </dd>
              </div>
            </dl>

            <a href="#rsvp" className="btn-plank mt-10">
              RSVP now
            </a>
          </div>

          <Waves className="absolute inset-x-0 bottom-0" />
        </section>

        {/* RSVP */}
        <section id="rsvp" className="bg-sea px-4 pb-24 pt-8 sm:px-6">
          <div className="mx-auto max-w-6xl">
            <header className="mb-12 text-center">
              <h2 className="ink-title text-5xl sm:text-6xl">Join the crew</h2>
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
