import type { Metadata } from "next";
import RegistrationForm from "@/components/site/RegistrationForm";
import { Container, PageHeader } from "@/components/ui/Layout";
import { ARCHDEACONRIES } from "@/lib/parishes";

export const metadata: Metadata = { title: "Join the fellowship" };

export default function RegisterPage() {
  return (
    <Container className="max-w-2xl py-9 pb-14">
      <PageHeader
        title="Join the fellowship"
        lead="Register as a member of the Anglican Youth Fellowship. Choose your archdeaconry and parish so your parish youth leaders can welcome you."
      />
      <RegistrationForm archdeaconries={ARCHDEACONRIES} />
    </Container>
  );
}
