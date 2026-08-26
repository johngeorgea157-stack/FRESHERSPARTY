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

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed"
    });
  }

  try {
    const { registration_id } = req.body;

    if (!registration_id) {
      return res.status(400).json({
        success: false,
        message: "Registration ID is required."
      });
    }

    // Find the registration
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

    // Don't create another order if already paid
    if (registration.payment_status === "paid") {
      return res.status(400).json({
        success: false,
        message: "This registration has already been paid."
      });
    }

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: 20000,
      currency: "INR",
      receipt: registration.registration_id,
      notes: {
        registration_id: registration.registration_id,
        student_id: registration.student_id
      }
    });

    // Save Razorpay order ID
    const { error: updateError } = await supabase
      .from("registrations")
      .update({
        razorpay_order_id: order.id
      })
      .eq("id", registration.id);

    if (updateError) {
      console.error("Supabase update error:", updateError);

      return res.status(500).json({
        success: false,
        message: "Could not save Razorpay order."
      });
    }

    return res.status(200).json({
      success: true,
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      registration_id: registration.registration_id,
      key_id: process.env.RAZORPAY_KEY_ID
    });

  } catch (error) {
    console.error("Razorpay order error:", error);

    return res.status(500).json({
      success: false,
      message: "Could not create Razorpay order."
    });
  }
}
