import React from "react";

// A glowing beam that travels around the parent's border (Magic UI style).
// The parent must be `relative` and have a border radius to inherit.
// Position is driven from outside through `beamRef` (style.offsetDistance 0% -> 100%),
// so the logo cloud can move the beam and its text effect from one shared clock.
export function BorderBeam({
  beamRef,
  className = "",
  size = 50,
  borderWidth = 1,
  colorFrom = "#ffaa40",
  colorTo = "#9c40ff",
}) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 rounded-[inherit] border-(length:--border-beam-width) border-transparent [mask-image:linear-gradient(transparent,transparent),linear-gradient(#000,#000)] [mask-composite:intersect] [mask-clip:padding-box,border-box]"
      style={{ "--border-beam-width": `${borderWidth}px` }}
    >
      <div
        ref={beamRef}
        className={`absolute aspect-square bg-linear-to-l from-(--color-from) via-(--color-to) to-transparent ${className}`}
        style={{
          width: size,
          offsetPath: `rect(0 auto auto 0 round ${size}px)`,
          offsetDistance: "0%",
          "--color-from": colorFrom,
          "--color-to": colorTo,
        }}
      />
    </div>
  );
}
