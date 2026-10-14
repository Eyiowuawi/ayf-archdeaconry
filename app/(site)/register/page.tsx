import type { Metadata } from "next";
import RegistrationForm from "@/components/site/RegistrationForm";
import { Container, PageHero } from "@/components/ui/Layout";
import { ARCHDEACONRIES } from "@/lib/parishes";

export const metadata: Metadata = { title: "Join AYF Egba" };

type Props = { searchParams: Promise<{ parish?: string | string[] }> };

export default async function RegisterPage({ searchParams }: Props) {
  const { parish } = await searchParams;
  return (
    <>
      <PageHero
        eyebrow="Membership"
        title="Join the fellowship."
        lead="Tell us a little about yourself and choose your parish, so your youth leaders can welcome you properly. It takes about two minutes."
      />
      <Container className="relative z-10 -mt-10 max-w-2xl pb-24">
        <RegistrationForm archdeaconries={ARCHDEACONRIES} initialParishId={typeof parish === "string" ? parish : undefined} />
      </Container>
    </>
  );
}
