import type { Metadata } from "next";
import RegistrationForm from "@/components/site/RegistrationForm";
import { Container, GradientText, PageHero } from "@/components/ui/Layout";
import { ARCHDEACONRIES } from "@/lib/parishes";

export const metadata: Metadata = { title: "Join the fellowship" };

export default function RegisterPage() {
  return (
    <>
      <PageHero
        eyebrow="Join the fellowship"
        title={<>You&apos;re in. <GradientText onDark>Almost.</GradientText></>}
        lead="Tell us a little about you and pick your parish, so your youth leaders can welcome you properly. It takes about two minutes."
      />
      <Container className="relative z-10 -mt-8 max-w-2xl pb-20">
        <RegistrationForm archdeaconries={ARCHDEACONRIES} />
      </Container>
    </>
  );
}
