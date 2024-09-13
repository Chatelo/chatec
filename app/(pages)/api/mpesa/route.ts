// app/api/mpesa/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type MpesaResponse = {
  MerchantRequestID: string;
  CheckoutRequestID: string;
  ResponseCode: string;
  ResponseDescription: string;
  CustomerMessage: string;
};

const generateToken = async (
  consumerKey: string,
  consumerSecret: string
): Promise<string> => {
  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString(
    "base64"
  );
  const response = await fetch(
    "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
    {
      headers: {
        Authorization: `Basic ${auth}`,
      },
    }
  );
  const data = await response.json();
  return data.access_token;
};

export async function POST(request: NextRequest) {
  const { phoneNumber, amount } = await request.json();

  try {
    const token = await generateToken(
      process.env.MPESA_CONSUMER_KEY!,
      process.env.MPESA_CONSUMER_SECRET!
    );

    const response = await fetch(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          BusinessShortCode: process.env.MPESA_SHORTCODE,
          Password: process.env.MPESA_PASSWORD,
          Timestamp: new Date()
            .toISOString()
            .replace(/[^0-9]/g, "")
            .slice(0, -3),
          TransactionType: "CustomerPayBillOnline",
          Amount: amount,
          PartyA: phoneNumber,
          PartyB: process.env.MPESA_SHORTCODE,
          PhoneNumber: phoneNumber,
          CallBackURL: `${process.env.BASE_URL}/api/mpesa-callback`,
          AccountReference: "YourCompany",
          TransactionDesc: "Payment for goods/services",
        }),
      }
    );

    const mpesaResponse: MpesaResponse = await response.json();

    // Store the transaction in the database
    await prisma.mpesaTransaction.create({
      data: {
        merchantRequestId: mpesaResponse.MerchantRequestID,
        checkoutRequestId: mpesaResponse.CheckoutRequestID,
        amount: Number(amount),
        phoneNumber,
        status: "PENDING",
      },
    });

    return NextResponse.json(mpesaResponse);
  } catch (error) {
    console.error("M-Pesa API Error:", error);
    return NextResponse.json(
      { error: "Failed to process M-Pesa payment" },
      { status: 500 }
    );
  }
}
