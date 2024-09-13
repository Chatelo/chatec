// "use client";

// import React, { useState } from "react";

// interface MpesaResponse {
//   MerchantRequestID: string;
//   CheckoutRequestID: string;
//   ResponseCode: string;
//   ResponseDescription: string;
//   CustomerMessage: string;
// }

// const MpesaPayment: React.FC = () => {
//   const [phoneNumber, setPhoneNumber] = useState("");
//   const [amount, setAmount] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setMessage("");

//     try {
//       const response = await fetch("/api/mpesa", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ phoneNumber, amount }),
//       });

//       if (!response.ok) {
//         throw new Error("Network response was not ok");
//       }

//       const data: MpesaResponse = await response.json();
//       setMessage(`Payment request sent. ${data.CustomerMessage}`);
//     } catch (error) {
//       setMessage("Error processing payment. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
//       <h2 className="text-2xl font-bold mb-4">M-Pesa Payment</h2>
//       <form onSubmit={handleSubmit}>
//         <div className="mb-4">
//           <label
//             htmlFor="phoneNumber"
//             className="block text-gray-700 font-bold mb-2"
//           >
//             Phone Number
//           </label>
//           <input
//             type="tel"
//             id="phoneNumber"
//             value={phoneNumber}
//             onChange={(e) => setPhoneNumber(e.target.value)}
//             className="w-full px-3 py-2 border rounded-lg"
//             placeholder="254XXXXXXXXX"
//             required
//           />
//         </div>
//         <div className="mb-4">
//           <label
//             htmlFor="amount"
//             className="block text-gray-700 font-bold mb-2"
//           >
//             Amount (KES)
//           </label>
//           <input
//             type="number"
//             id="amount"
//             value={amount}
//             onChange={(e) => setAmount(e.target.value)}
//             className="w-full px-3 py-2 border rounded-lg"
//             placeholder="Enter amount"
//             required
//           />
//         </div>
//         <button
//           type="submit"
//           className="w-full bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600"
//           disabled={loading}
//         >
//           {loading ? "Processing..." : "Pay with M-Pesa"}
//         </button>
//       </form>
//       {message && <p className="mt-4 text-center">{message}</p>}
//     </div>
//   );
// };

// export default MpesaPayment;
