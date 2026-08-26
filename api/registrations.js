import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY
);

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed"
    });
  }

  try {
    const {
      name,
      student_id,
      email,
      phone,
      course,
      batch
    } = req.body;

    // Validate required fields
    if (
      !name ||
      !student_id ||
      !email ||
      !phone ||
      !course ||
      !batch
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all required fields."
      });
    }

    // Generate registration ID
    const registrationId =
      "FP26-" +
      Math.random().toString(36).substring(2, 10).toUpperCase();

    // Insert registration into Supabase
    const { data, error } = await supabase
      .from("registrations")
      .insert([
        {
          registration_id: registrationId,
          name,
          student_id,
          email,
          phone,
          course,
          batch,
          ticket_type: "standard",
          payment_status: "pending"
        }
      ])
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);

      return res.status(500).json({
        success: false,
        message: "Could not save registration."
      });
    }

    return res.status(201).json({
      success: true,
      message: "Registration created successfully.",
      registration: data
    });

  } catch (error) {
    console.error("Server error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error."
    });
  }
}
