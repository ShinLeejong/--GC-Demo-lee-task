"use client";
import Script from "next/script";
import { useEffect, useRef } from "react";

export default function Page() {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let t: any;
    const tick = () => {
      const w = window as any;
      if (mountRef.current && w.lime && w.mygame?.start) {
        const scene = new w.lime.Scene(mountRef.current);
        w.mygame.start(scene);
      } else {
        t = setTimeout(tick, 50);
      }
    };
    tick();
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <Script src="/static/limejs.umd.js" strategy="beforeInteractive" />
      <Script src="/static/mygame.js" strategy="afterInteractive" />
      <main style={{ padding: 24 }}>
        <div ref={mountRef}/>
      </main>
    </>
  );
}
