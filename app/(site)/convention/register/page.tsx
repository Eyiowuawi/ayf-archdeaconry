import type { Metadata } from "next";
import ConventionRegistrationForm from "@/components/site/ConventionRegistrationForm";
import { Container, PageHero, TextLink } from "@/components/ui/Layout";
import { CONVENTION, formatNaira } from "@/lib/content/convention";
import { ARCHDEACONRIES } from "@/lib/parishes";

export const metadata: Metadata = { title: `Register for ${CONVENTION.shortName}` };

export default function ConventionRegisterPage() {
  return (
    <>
      <PageHero
        eyebrow={`${CONVENTION.shortName} · ${formatNaira(CONVENTION.fee)}`}
        title="Register as a delegate."
        lead="Have your transfer reference, a receipt and a clear photo of your face ready. It takes about five minutes."
      >
        <TextLink href="/convention#register" className="mt-6 text-sun">What the fee covers</TextLink>
      </PageHero>
      <Container className="relative z-10 -mt-10 max-w-2xl pb-24">
        <ConventionRegistrationForm archdeaconries={ARCHDEACONRIES} />
      </Container>
    </>
  );
}
