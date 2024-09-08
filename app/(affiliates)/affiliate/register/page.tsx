import { AffiliateRegistrationForm } from "@/app/components/AffiliateRegistrationForm";

export default function AffiliateRegistrationPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Register as an Affiliate</h1>
      {/* Clientside component */}
      <AffiliateRegistrationForm />
    </div>
  );
}
