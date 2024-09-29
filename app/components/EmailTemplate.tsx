import React from "react";

const EmailTemplate = () => (
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
        Welcome to Our Newsletter!
      </h1>
      <p
        style={{
          fontSize: "16px",
          color: "#666666",
          marginBottom: "15px",
          lineHeight: "1.5",
        }}
      >
        Thank you for subscribing to our newsletter. We&apos;re excited to have
        you on board!
      </p>
      <p
        style={{
          fontSize: "16px",
          color: "#666666",
          marginBottom: "25px",
          lineHeight: "1.5",
        }}
      >
        You&apos;ll be receiving our latest updates and exclusive content soon.
      </p>
      <div
        style={{
          textAlign: "center",
        }}
      >
        <a
          href="https://sigira.com"
          style={{
            backgroundColor: "#4CAF50",
            color: "#ffffff",
            padding: "12px 24px",
            textDecoration: "none",
            borderRadius: "5px",
            fontSize: "16px",
            fontWeight: "bold",
            display: "inline-block",
          }}
        >
          Visit Our Website for More
        </a>
      </div>
    </div>
    <div
      style={{
        textAlign: "center",
        marginTop: "20px",
        fontSize: "14px",
        color: "#999999",
      }}
    >
      © 2024 Sigira Technologies. All rights reserved.
    </div>
  </div>
);

export default EmailTemplate;
