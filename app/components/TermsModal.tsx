"use client";

import React, { useState } from "react";
import { DigitalAgreement } from "@/app/types/index";
import TermsAndConditions from "@/app/components/TermsAndConditions";

interface TermsModalProps {
  agreement: DigitalAgreement;
}

const TermsModal: React.FC<TermsModalProps> = ({ agreement }) => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <>
      <button
        onClick={openModal}
        className="text-blue-600 underline cursor-pointer"
      >
        View Terms and Conditions
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-4xl max-h-[80vh] flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">
                Sigira Technologies Service Agreement
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="overflow-y-auto flex-grow mb-4">
              <TermsAndConditions agreement={agreement} />
            </div>
            <div className="flex justify-end">
              <button
                onClick={closeModal}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TermsModal;
