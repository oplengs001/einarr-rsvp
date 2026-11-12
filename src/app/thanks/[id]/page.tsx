import Link from "next/link";
import { getRsvpById } from "@/lib/store";
import ThanksPosterClient from "@/components/ThanksPosterClient";
import SiteFooter from "@/components/SiteFooter";
import { EVENT_CONFIG } from "@/config/event";

export const dynamic = "force-dynamic";

export default async function ThanksPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const rsvp = await getRsvpById(id);

  return (
    <>
      <main className="min-h-screen bg-sea px-4 pb-24 pt-10 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <Link href="/" className="mx-auto mb-12 block w-fit">
            <span className="ink-title text-3xl sm:text-4xl">
              {EVENT_CONFIG.honoreeDisplay}&apos;s Christening
            </span>
          </Link>

          {rsvp ? (
            <ThanksPosterClient rsvp={rsvp} />
          ) : (
            <div className="mx-auto max-w-md rounded-2xl border-[3px] border-ink bg-paper p-8 text-center shadow-ink-lg">
              <h1 className="font-display text-3xl tracking-wide">
                Lost at sea
              </h1>
              <p className="mt-3 text-ink/70">
                We couldn&apos;t find that poster. The link may be wrong or the
                RSVP was removed.
              </p>
              <Link href="/" className="btn-plank mt-7">
                Back to the invitation
              </Link>
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
