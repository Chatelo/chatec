import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { DigitalAgreement } from "@/app/types/index";

interface TermsAndConditionsProps {
  agreement: DigitalAgreement;
}

const TermsAndConditions: React.FC<TermsAndConditionsProps> = ({
  agreement,
}) => {
  return (
    <Card className="w-full max-w-4xl mx-auto my-8">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          Sigira Technologies Service Agreement
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p>
          Agreement created on:{" "}
          {new Date(agreement.createdAt).toLocaleDateString()}
        </p>
        <p>{agreement.agreementText}</p>
        <h2 className="text-xl font-semibold mt-4">1. Acceptance of Terms</h2>
        <p>
          By engaging Sigira's services or using any of Sigira's digital
          products, Client agrees to be bound by the terms and conditions set
          forth in this Agreement.
        </p>
        <h2 className="text-xl font-semibold mt-4">2. Services Description</h2>
        <p>
          Sigira provides a range of digital services including but not limited
          to web development, mobile app development, UI/UX design, cloud
          solutions, and SEO ("Services"). Client agrees to use the Services in
          compliance with applicable laws and regulations.
        </p>
        <h2 className="text-xl font-semibold mt-4">
          3. Client Responsibilities
        </h2>
        <p>
          Client is responsible for providing accurate and complete information
          necessary for Sigira to perform the Services. For web and mobile
          applications, Client is responsible for maintaining the
          confidentiality of any account credentials provided by Sigira.
        </p>
        <h2 className="text-xl font-semibold mt-4">4. Privacy and Data Use </h2>
        <p>
          {" "}
          Sigira will collect and use Client's information in accordance with
          its Privacy Policy, which is incorporated by reference into this
          Agreement. For cloud solutions, Sigira implements industry-standard
          security measures, but Client acknowledges that no system is entirely
          secure.
        </p>
        <h2 className="text-xl font-semibold mt-4">
          5. Intellectual Property{" "}
        </h2>
        <p>
          All content, designs, code, and other materials created by Sigira in
          the course of providing the Services, excluding Client's pre-existing
          materials, shall be the property of Sigira until full payment is
          received, at which point ownership transfers to Client. For SEO
          services, Client retains ownership of all content created for their
          use.
        </p>
        <h2 className="text-xl font-semibold mt-4">
          6. Limitation of Liability{" "}
        </h2>
        <p>
          To the fullest extent permitted by law, Sigira shall not be liable for
          any indirect, incidental, special, consequential, or punitive damages,
          or any loss of profits or revenues, whether incurred directly or
          indirectly, or any loss of data, use, goodwill, or other intangible
          losses resulting from (a) Client's use or inability to use the
          Services; (b) any unauthorized access to or use of our servers and/or
          any personal information stored therein.
        </p>
        <h2 className="text-xl font-semibold mt-4">7. Termination</h2>
        <p>
          Sigira reserves the right to terminate or suspend Services at any
          time, with notice, for conduct that Sigira believes violates this
          Agreement or is harmful to other clients, Sigira, or third parties, or
          for failure to pay for Services.
        </p>
        <h2 className="text-xl font-semibold mt-4">8. Changes to Agreement </h2>
        <p>
          Sigira reserves the right to change this Agreement at any time.
          Client's continued use of the Services after such changes constitutes
          acceptance of the new terms.
        </p>
        <h2 className="text-xl font-semibold mt-4">9. Governing Law </h2>
        <p>
          This Agreement shall be governed by and construed in accordance with
          the laws of [State/Country], without regard to its conflict of law
          provisions.
        </p>
        ß
        <h2 className="text-xl font-semibold mt-4">Service-Specific Terms. </h2>
        <p>
          a. Web and Mobile Development: Client acknowledges that Sigira cannot
          guarantee specific positions in search engine results or app store
          rankings. b. UI/UX Design: Final designs are subject to Client
          approval. Major revisions after initial approval may incur additional
          fees. c. Cloud Solutions: Client is responsible for compliance with
          data protection laws applicable to their use of cloud services. d.
          SEO: Sigira employs white hat SEO techniques only. Client agrees not
          to request any practices that violate search engine guidelines.
        </p>
        <h2 className="text-xl font-semibold mt-4">11. Entire Agreement</h2>
        <p>
          This Agreement constitutes the entire agreement between Client and
          Sigira regarding the use of the Services, superseding any prior
          agreements.
        </p>
        <h2 className="text-xl font-semibold mt-4">Agreed Items</h2>
        {/* <ul>
          {agreement.agreedItems.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul> */}
        <p className="font-bold mt-4">
          BY CLICKING "I AGREE" OR BY ACCESSING OR USING SIGIRA'S SERVICES,
          CLIENT ACKNOWLEDGES THAT THEY HAVE READ THIS AGREEMENT, UNDERSTAND IT,
          AND AGREE TO BE BOUND BY ITS TERMS AND CONDITIONS.
        </p>
      </CardContent>
    </Card>
  );
};

export default TermsAndConditions;
