import React from "react";
import HeroText from "./HeroText";
import { getActiveEvent } from "@/app/lib/heroEvents";

const Hero = async () => {
  // null when no event is live (or the DB is unreachable) -> default hero theme
  const event = await getActiveEvent();

  return (
    <>
      <HeroText event={event} />
    </>
  );
};

export default Hero;
