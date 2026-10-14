import type { Metadata } from "next";
import RegistrationForm from "@/components/site/RegistrationForm";
import { ARCHDEACONRIES } from "@/lib/parishes";

export const metadata: Metadata = { title: "Join the fellowship" };

export default function RegisterPage() {
  return (
    <div className="sitecontainer pagepad narrow">
      <h1 className="pagetitle">Join the fellowship</h1>
      <p className="pagelead">
        Register as a member of the Anglican Youth Fellowship. Choose your archdeaconry and parish so
        your parish youth leaders can welcome you.
      </p>
      <RegistrationForm archdeaconries={ARCHDEACONRIES} />
    </div>
  );
}
