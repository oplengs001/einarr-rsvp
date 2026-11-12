import Image from "next/image";
import Link from "next/link";
import { EVENT_CONFIG } from "@/config/event";

export default function SiteFooter() {
  return (
    <footer className="bg-sea-dark text-white/70">
      <div className="rope" />
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 py-8 text-sm sm:flex-row sm:justify-between">
        <div className="flex items-center gap-3">
          <Image
            src="/op-icons/Sail.png"
            alt=""
            width={36}
            height={36}
            unoptimized
            className="h-9 w-9 rounded-md border-2 border-ink"
          />
          <p>
            <span className="font-extrabold text-white">
              {EVENT_CONFIG.honoreeDisplay}&apos;s Christening
            </span>
            <span className="mx-2 text-white/40">·</span>
            {EVENT_CONFIG.dateLong}
            <span className="mx-2 text-white/40">·</span>
            <a
              href={EVENT_CONFIG.venueMapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline-offset-4 hover:text-sun hover:underline"
            >
              {EVENT_CONFIG.venueDisplay}
            </a>
          </p>
        </div>
        <Link
          href="/captain"
          className="font-bold text-white/60 underline-offset-4 hover:text-sun hover:underline"
        >
          Host login
        </Link>
      </div>
    </footer>
  );
}

