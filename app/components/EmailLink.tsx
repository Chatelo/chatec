import React from "react";

interface EmailLinkProps {
  agreementLink: string;
}

const EmailLink: React.FC<EmailLinkProps> = ({ agreementLink }) => (
  <div
    style={{
      fontFamily: "Arial, sans-serif",
      maxWidth: "600px",
      margin: "0 auto",
      padding: "20px",
      backgroundColor: "#f7f7f7",
      borderRadius: "10px",
    }}
  >
    <div
      style={{
        backgroundColor: "#ffffff",
        padding: "30px",
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
      }}
    >
      <h1
        style={{
          fontSize: "24px",
          color: "#333333",
          marginBottom: "20px",
          textAlign: "center",
          fontWeight: "bold",
        }}
      >
        New Agreement Available
      </h1>
      <p
        style={{
          fontSize: "16px",
          color: "#666666",
          marginBottom: "15px",
          lineHeight: "1.5",
        }}
      >
        Hello,
      </p>
      <p
        style={{
          fontSize: "16px",
          color: "#666666",
          marginBottom: "15px",
          lineHeight: "1.5",
        }}
      >
        A new agreement is available for your review and acceptance.
      </p>
      <p
        style={{
          fontSize: "16px",
          color: "#666666",
          marginBottom: "25px",
          lineHeight: "1.5",
        }}
      >
        Please click the button below to view and accept the agreement:
      </p>
      <div
        style={{
          textAlign: "center",
          marginBottom: "25px",
        }}
      >
        <a
          href={`${process.env.NEXT_PUBLIC_BASE_URL}/agreement/${agreementLink}`}
          style={{
            backgroundColor: "#007bff",
            color: "#ffffff",
            padding: "14px 28px",
            textDecoration: "none",
            borderRadius: "50px",
            fontSize: "18px",
            fontWeight: "bold",
            display: "inline-block",
            boxShadow: "0 4px 6px rgba(0, 123, 255, 0.25)",
            transition: "all 0.3s ease",
          }}
        >
          View Agreement
        </a>
      </div>
      <p
        style={{
          fontSize: "16px",
          color: "#666666",
          marginBottom: "15px",
          lineHeight: "1.5",
        }}
      >
        <strong>Please note:</strong> This link will expire in 1 day.
      </p>
      <p
        style={{
          fontSize: "16px",
          color: "#666666",
          marginBottom: "15px",
          lineHeight: "1.5",
        }}
      >
        If you have any questions or concerns, please don't hesitate to contact
        us.
      </p>
      <p
        style={{
          fontSize: "16px",
          color: "#666666",
          marginBottom: "15px",
          lineHeight: "1.5",
        }}
      >
        Best regards,
        <br />
        Sigira Technologies.
      </p>
    </div>
    <div
      style={{
        textAlign: "center",
        marginTop: "20px",
        fontSize: "14px",
        color: "#999999",
      }}
    >
      This is an automated message. Please do not reply to this email.
    </div>
  </div>
);

export default EmailLink;
