import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/app/components/ui/button";

interface AgreementFormProps {
  agreementLinkId: number;
}

export const AgreementForm: React.FC<AgreementFormProps> = ({
  agreementLinkId,
}) => {
  const [agreed, setAgreed] = useState(false);
  const [signature, setSignature] = useState("");
  const [checkedItems, setCheckedItems] = useState({
    item1: false,
    item2: false,
    item3: false,
  });
  const router = useRouter();

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCheckedItems({
      ...checkedItems,
      [event.target.name]: event.target.checked,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !agreed ||
      !signature ||
      Object.values(checkedItems).some((item) => !item)
    ) {
      alert(
        "Please agree to all terms, provide a signature, and check all items before submitting."
      );
      return;
    }

    try {
      const response = await fetch("/api/accept-agreement", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          agreementLinkId,
          signature,
          agreedItems: Object.keys(checkedItems).filter(
            (key) => checkedItems[key as keyof typeof checkedItems]
          ),
        }),
      });

      if (response.ok) {
        alert("Agreement accepted successfully!");
        router.push("/dashboard");
      } else {
        throw new Error("Failed to accept agreement");
      }
    } catch (error) {
      console.error("Error accepting agreement:", error);
      alert("Failed to accept agreement. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-gray-100 p-4 rounded">
        <h2 className="text-lg font-semibold mb-2">Agreement Terms</h2>
        <p>[Insert your agreement terms here]</p>
      </div>

      <div>
        <h3 className="font-semibold mb-2">Please check all items:</h3>
        {Object.entries(checkedItems).map(([key, value]) => (
          <div key={key} className="flex items-center mb-2">
            <input
              type="checkbox"
              id={key}
              name={key}
              checked={value}
              onChange={handleCheckboxChange}
              className="mr-2"
            />
            <label htmlFor={key}>I agree to {key}</label>
          </div>
        ))}
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="agree"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="mr-2"
        />
        <label htmlFor="agree">I agree to all terms of this agreement</label>
      </div>

      <div>
        <label htmlFor="signature" className="block mb-2">
          Signature:
        </label>
        <input
          type="text"
          id="signature"
          value={signature}
          onChange={(e) => setSignature(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <Button
        type="submit"
        disabled={
          !agreed ||
          !signature ||
          Object.values(checkedItems).some((item) => !item)
        }
      >
        Accept Agreement
      </Button>
    </form>
  );
};
