export const EVENT_CONFIG = {
  honoreeName: "EINARR",
  honoreeDisplay: "Einarr",
  occasion: "Christening",
  dateDisplay: "December 6",
  yearDisplay: "2026",
  dateLong: "Sunday, December 6, 2026",
  venueName: "GDLS KUBO RESIDENCES",
  venueDisplay: "GDLS Kubo Residences",
  venueMapUrl: "https://maps.app.goo.gl/J7jyT6yEiWi1Qfz9A",
  maxPlusOnes: 2,
} as const;

export interface PirateAvatar {
  id: string;
  shortName: string;
  label: string;
  iconSrc: string;
  quote: string;
}

export const PIRATE_AVATARS: PirateAvatar[] = [
  {
    id: "luffy",
    shortName: "Luffy",
    label: "Luffy (Captain)",
    iconSrc: "/op-icons/Luffy.png",
    quote: "Is there gonna be meat at the party?",
  },
  {
    id: "zoro",
    shortName: "Zoro",
    label: "Zoro (Swordsman)",
    iconSrc: "/op-icons/Zoro-2.png",
    quote: "I didn't get lost. The venue moved.",
  },
  {
    id: "nami",
    shortName: "Nami",
    label: "Nami (Navigator)",
    iconSrc: "/op-icons/Nami.png",
    quote: "I've already charted the fastest route to Kubo Residences.",
  },
  {
    id: "usopp",
    shortName: "Usopp",
    label: "Usopp (Sniper)",
    iconSrc: "/op-icons/Usopp.png",
    quote: "The great Captain Usopp will be there. Probably.",
  },
  {
    id: "sanji",
    shortName: "Sanji",
    label: "Sanji (Cook)",
    iconSrc: "/op-icons/Sanji.png",
    quote: "Nobody leaves this party hungry.",
  },
  {
    id: "chopper",
    shortName: "Chopper",
    label: "Chopper (Doctor)",
    iconSrc: "/op-icons/Chopper-2.png",
    quote: "Calling me cute won't make me happy, you jerk!",
  },
  {
    id: "robin",
    shortName: "Robin",
    label: "Robin (Archaeologist)",
    iconSrc: "/op-icons/Robin.png",
    quote: "What a lovely day for a christening.",
  },
  {
    id: "franky",
    shortName: "Franky",
    label: "Franky (Shipwright)",
    iconSrc: "/op-icons/Franky.png",
    quote: "This party's gonna be SUUUPER!",
  },
  {
    id: "brook",
    shortName: "Brook",
    label: "Brook (Musician)",
    iconSrc: "/op-icons/Brook-2.png",
    quote: "Yohohoho! May I see the dessert table?",
  },
  {
    id: "sunny",
    shortName: "Sunny",
    label: "Thousand Sunny",
    iconSrc: "/op-icons/Sunny.png",
    quote: "All sails set for Einarr's first voyage.",
  },
  {
    id: "ace",
    shortName: "Ace",
    label: "Ace (Commander)",
    iconSrc: "/op-icons/Ace.png",
    quote: "Thanks for looking out for the little one.",
  },
];

export const PIRATE_EPITHETS: string[] = [
  "Conqueror of the Buffet",
  "Guardian of Baby Einarr",
  "The Lumpia Bandit",
  "Master of the Milk Bottle",
  "First Mate of the Feast",
  "Emperor of Extra Rice",
  "Naptime Defender",
  "The Smiling Buccaneer",
  "Never Misses a Party",
  "Legend of Kubo Harbor",
  "Sovereign of Second Helpings",
  "Captain of Good Vibes",
  "Haki of the Dance Floor",
  "Einarr's Favorite Nakama",
  "Dessert Hunter",
];

/**
 * Picks an epithet from the guest's name; `seedOffset` lets them shuffle.
 */
export function getEpithetForName(name: string, seedOffset = 0): string {
  const clean = name.trim().toLowerCase();
  if (!clean) {
    return PIRATE_EPITHETS[seedOffset % PIRATE_EPITHETS.length];
  }
  let hash = 0;
  for (let i = 0; i < clean.length; i++) {
    hash = (hash * 31 + clean.charCodeAt(i)) >>> 0;
  }
  return PIRATE_EPITHETS[(hash + seedOffset) % PIRATE_EPITHETS.length];
}

/**
 * Bounty grows with every letter typed, plus bonuses for plus-ones and attending.
 */
export function calculateBounty(
  name: string,
  plusOnes: number,
  attending: "yes" | "no",
  rerollCount = 0
): number {
  const trimmed = name.trim();
  if (!trimmed) return 0;

  let base = 30_000_000; // Luffy's first bounty
  for (let i = 0; i < trimmed.length; i++) {
    const code = trimmed.charCodeAt(i);
    base += (i + 1) * 14_500_000 + (code % 17) * 850_000;
  }

  base += plusOnes * 125_000_000;
  if (attending === "yes") base += 100_000_000;
  base += rerollCount * 7_770_000;

  return Math.round(base / 10_000) * 10_000;
}
