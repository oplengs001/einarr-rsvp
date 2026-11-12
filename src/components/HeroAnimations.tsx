"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";

export default function HeroAnimations({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const rootRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // Clouds: slow horizontal drift + subtle vertical float
      const clouds = gsap.utils.toArray<HTMLElement>(
        "[data-gsap='cloud']",
        root
      );
      clouds.forEach((cloud, i) => {
        const dir = i % 2 === 0 ? 1 : -1;
        gsap.to(cloud, {
          x: dir * (24 + i * 6),
          y: -6,
          duration: 12 + i * 2.5,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });
      });

      // Seagulls: gentle soaring drift across the sky
      const gulls = gsap.utils.toArray<HTMLElement>("[data-gsap='gull']", root);
      gulls.forEach((gull, i) => {
        const dir = i % 2 === 0 ? 1 : -1;
        gsap.to(gull, {
          x: dir * (16 + i * 4),
          y: -8,
          rotation: dir * 4,
          duration: 5.5 + i * 1.1,
          delay: i * 0.35,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });
      });

      // Hanging Jolly Roger sign: gentle pendulum sway from the top ropes
      gsap.fromTo(
        "[data-gsap='jolly']",
        { rotation: -1.4 },
        {
          rotation: 1.4,
          transformOrigin: "50% 0%",
          duration: 3.8,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        }
      );

      // Wind wisps: gentle horizontal drift
      const wisps = gsap.utils.toArray<HTMLElement>("[data-gsap='wisp']", root);
      wisps.forEach((wisp, i) => {
        gsap.to(wisp, {
          x: i % 2 === 0 ? 22 : -22,
          opacity: 0.28,
          duration: 6 + i * 1.4,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });
      });

      // Ocean waves: opposing continuous vertical bobbing swells
      gsap.to("[data-gsap='wave-back']", {
        y: -6,
        x: 10,
        duration: 3.8,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });

      gsap.to("[data-gsap='wave-front']", {
        y: 6,
        x: -10,
        duration: 3.1,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });

      // Thousand Sunny silhouette: riding and gently pitching on the wave crest
      gsap.to("[data-gsap='sunny']", {
        y: -8,
        rotation: 2.2,
        transformOrigin: "50% 75%",
        duration: 3.4,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <section ref={rootRef} className={className}>
      {children}
    </section>
  );
}

