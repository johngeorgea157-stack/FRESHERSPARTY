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

  // Only allow POST
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

    // Validate request
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

    // --------------------------------------------------
    // STEP 1: Find registration
    // --------------------------------------------------

    const {
      data: registration,
      error: registrationError
    } = await supabase
      .from("registrations")
      .select("*")
      .eq("registration_id", registration_id)
      .single();

    if (registrationError || !registration) {

      console.error(
        "Registration lookup error:",
        registrationError
      );

      return res.status(404).json({
        success: false,
        message: "Registration not found."
      });
    }

    // --------------------------------------------------
    // STEP 2: Verify Razorpay order belongs to registration
    // --------------------------------------------------

    if (
      registration.razorpay_order_id !==
      razorpay_order_id
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Payment order does not match registration."
      });
    }

    // --------------------------------------------------
    // STEP 3: Verify Razorpay signature
    // --------------------------------------------------

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

    if (
      generatedSignature !==
      razorpay_signature
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature."
      });
    }

    // --------------------------------------------------
    // STEP 4: Fetch payment directly from Razorpay
    // --------------------------------------------------

    const payment =
      await razorpay.payments.fetch(
        razorpay_payment_id
      );

    if (!payment) {
      return res.status(400).json({
        success: false,
        message:
          "Payment could not be verified."
      });
    }

    // --------------------------------------------------
    // STEP 5: Verify payment belongs to correct order
    // --------------------------------------------------

    if (
      payment.order_id !==
      razorpay_order_id
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Payment does not belong to this order."
      });
    }

    // --------------------------------------------------
    // STEP 6: Verify payment amount
    // --------------------------------------------------

    const ticketPriceInr =
      Number(
        process.env.TICKET_PRICE_INR || 200
      );

    const expectedAmount =
      ticketPriceInr * 100;

    if (
      payment.amount !==
      expectedAmount
    ) {
      console.error(
        "Amount mismatch:",
        {
          expected: expectedAmount,
          received: payment.amount
        }
      );

      return res.status(400).json({
        success: false,
        message:
          `Incorrect payment amount. Expected ₹${ticketPriceInr}.`
      });
    }

    // --------------------------------------------------
    // STEP 7: Verify payment is captured
    // --------------------------------------------------

    if (
      payment.status !== "captured"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Payment has not been captured."
      });
    }

    // --------------------------------------------------
    // STEP 8: Return existing ticket if already processed
    // --------------------------------------------------

    if (
      registration.payment_status === "paid" &&
      registration.secure_ticket_token
    ) {

      const baseUrl =
        process.env.PUBLIC_URL ||
        "https://freshersparty-two.vercel.app";

      const ticketUrl =
        `${baseUrl}/ticket/${registration.secure_ticket_token}`;

      return res.status(200).json({
        success: true,
        message:
          "Payment already verified.",

        registration_id:
          registration.registration_id,

        ticket_token:
          registration.secure_ticket_token,

        ticket_url:
          ticketUrl,

        qr_code:
          registration.qr_code
      });
    }

    // --------------------------------------------------
    // STEP 9: Generate secure ticket token
    // --------------------------------------------------

    const ticketToken =
      generateTicketToken();

    // --------------------------------------------------
    // STEP 10: Create ticket URL
    // --------------------------------------------------

    const baseUrl =
      process.env.PUBLIC_URL ||
      "https://freshersparty-two.vercel.app";

    const ticketUrl =
      `${baseUrl}/ticket/${ticketToken}`;

    // --------------------------------------------------
    // STEP 11: Generate QR code
    // --------------------------------------------------

    const qrCode =
      await QRCode.toDataURL(
        ticketUrl,
        {
          errorCorrectionLevel: "H",
          margin: 2,
          width: 500
        }
      );

    // --------------------------------------------------
    // STEP 12: Save payment + ticket
    // --------------------------------------------------

    const {
      data: updatedRegistration,
      error: updateError
    } = await supabase
      .from("registrations")
      .update({

        payment_status:
          "paid",

        razorpay_payment_id:
          razorpay_payment_id,

        secure_ticket_token:
          ticketToken,

        ticket_url:
          ticketUrl,

        ticket_status:
          "VALID",

        qr_code:
          qrCode

      })
      .eq(
        "registration_id",
        registration.registration_id
      )
      .select()
      .single();

    // --------------------------------------------------
    // STEP 13: Handle database error
    // --------------------------------------------------

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

    // --------------------------------------------------
    // STEP 14: Return ticket information
    // --------------------------------------------------

    return res.status(200).json({

      success: true,

      message:
        "Payment verified and ticket generated.",

      registration_id:
        updatedRegistration.registration_id,

      ticket_token:
        ticketToken,

      ticket_url:
        ticketUrl,

      qr_code:
        qrCode

    });

  } catch (error) {

    console.error(
      "Payment verification error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Could not verify payment."
    });
  }
}
