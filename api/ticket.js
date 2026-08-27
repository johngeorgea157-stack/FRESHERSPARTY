import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY
);

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed"
    });
  }

  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Ticket token is required."
      });
    }

    // Find ticket using the secure token
    const { data: registration, error } = await supabase
      .from("registrations")
      .select(`
        registration_id,
        name,
        course,
        batch,
        ticket_type,
        payment_status,
        ticket_status,
        qr_code
      `)
      .eq("secure_ticket_token", token)
      .single();

    if (error || !registration) {
      return res.status(404).json({
        success: false,
        message: "Invalid ticket."
      });
    }

    // Payment must be verified
    if (registration.payment_status !== "paid") {
      return res.status(403).json({
        success: false,
        message: "Payment has not been verified."
      });
    }

    // Ticket must be valid
    if (registration.ticket_status !== "VALID") {
      return res.status(403).json({
        success: false,
        message: "This ticket is no longer valid."
      });
    }

    // Return ONLY information required for the ticket
    return res.status(200).json({
      success: true,
      ticket: {
        registration_id: registration.registration_id,
        name: registration.name,
        course: registration.course,
        batch: registration.batch,
        ticket_type: registration.ticket_type,
        ticket_status: registration.ticket_status,
        qr_code: registration.qr_code
      }
    });

  } catch (error) {
    console.error("Ticket lookup error:", error);

    return res.status(500).json({
      success: false,
      message: "Could not retrieve ticket."
    });
  }
}
