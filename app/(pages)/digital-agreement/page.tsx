import { DigitalAgreementForm } from "@/app/components/DigitalAgreementForm";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/auth";
import { redirect } from "next/navigation";

export default async function DigitalAgreementPage() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    redirect("/auth/signin");
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Digital Agreement</h1>
      <DigitalAgreementForm />
    </div>
  );
}
