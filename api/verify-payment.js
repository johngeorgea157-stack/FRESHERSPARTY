import crypto from "crypto";
import QRCode from "qrcode";
import Razorpay from "razorpay";
import { createClient } from "@supabase/supabase-js";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY
);

function generateTicketToken() {
  return (
    "FP26-" +
    crypto.randomBytes(18).toString("base64url").toUpperCase()
  );
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed"
    });
  }

  try {
    const {
      registration_id,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = req.body;

    if (
      !registration_id ||
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing payment verification details."
      });
    }

    // Find registration
    const { data: registration, error: registrationError } =
      await supabase
        .from("registrations")
        .select("*")
        .eq("registration_id", registration_id)
        .single();

    if (registrationError || !registration) {
      return res.status(404).json({
        success: false,
        message: "Registration not found."
      });
    }

    // Make sure the Razorpay order belongs to this registration
    if (registration.razorpay_order_id !== razorpay_order_id) {
      return res.status(400).json({
        success: false,
        message: "Payment order does not match registration."
      });
    }

    // Verify Razorpay signature
    const generatedSignature = crypto
      .createHmac(
        "sha256",
        process.env.RAZORPAY_KEY_SECRET
      )
      .update(
        razorpay_order_id +
        "|" +
        razorpay_payment_id
      )
      .digest("hex");

    const signaturesMatch =
      generatedSignature === razorpay_signature;

    if (!signaturesMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature."
      });
    }

    // Fetch payment from Razorpay
    const payment = await razorpay.payments.fetch(
      razorpay_payment_id
    );

    if (!payment) {
      return res.status(400).json({
        success: false,
        message: "Payment could not be verified."
      });
    }

    // Confirm payment belongs to the correct order
    if (payment.order_id !== razorpay_order_id) {
      return res.status(400).json({
        success: false,
        message: "Payment does not belong to this order."
      });
    }

    // Confirm amount = ₹200
    if (payment.amount !== 20000) {
      return res.status(400).json({
        success: false,
        message: "Incorrect payment amount."
      });
    }

    // Confirm Razorpay captured the payment
    if (payment.status !== "captured") {
      return res.status(400).json({
        success: false,
        message: "Payment has not been captured."
      });
    }

    // If ticket already exists, return it
    if (
      registration.payment_status === "paid" &&
      registration.ticket_token
    ) {
      const baseUrl =
        process.env.PUBLIC_URL ||
        "https://freshersparty-two.vercel.app";

      const ticketUrl =
        `${baseUrl}/ticket/${registration.ticket_token}`;

      return res.status(200).json({
        success: true,
        message: "Payment already verified.",
        registration_id:
          registration.registration_id,
        ticket_token:
          registration.ticket_token,
        ticket_url: ticketUrl,
        qr_code: registration.qr_code
      });
    }

    // Generate secure ticket token
    const ticketToken = generateTicketToken();

    const baseUrl =
      process.env.PUBLIC_URL ||
      "https://freshersparty-two.vercel.app";

    const ticketUrl =
      `${baseUrl}/ticket/${ticketToken}`;

    // Generate QR code
    const qrCode = await QRCode.toDataURL(
      ticketUrl,
      {
        errorCorrectionLevel: "H",
        margin: 2,
        width: 500
      }
    );

    // Save payment + ticket information
    const { data: updatedRegistration, error: updateError } =
      await supabase
        .from("registrations")
        .update({
          payment_status: "paid",
          razorpay_payment_id:
            razorpay_payment_id,
          ticket_token: ticketToken,
          ticket_status: "VALID",
          qr_code: qrCode
        })
        .eq("id", registration.id)
        .select()
        .single();

    if (updateError) {
      console.error(
        "Supabase update error:",
        updateError
      );

      return res.status(500).json({
        success: false,
        message:
          "Payment verified but ticket could not be created."
      });
    }

    return res.status(200).json({
      success: true,
      message:
        "Payment verified and ticket generated.",
      registration_id:
        updatedRegistration.registration_id,
      ticket_token: ticketToken,
      ticket_url: ticketUrl,
      qr_code: qrCode
    });

  } catch (error) {
    console.error(
      "Payment verification error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Could not verify payment."
    });
  }
}
