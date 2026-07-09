import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";

function escapeHtml(value: unknown) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  try {
    const body = req.body || {};

    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
    const resendApiKey = process.env.RESEND_API_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      return res.status(500).json({
        success: false,
        error: "Missing Supabase environment variables",
      });
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const inquiryMessage = [
      `Product: ${body.product || "-"}`,
      `Quantity: ${body.quantity || "-"}`,
      `Destination: ${body.destination || "-"}`,
      `Packing: ${body.packing || "-"}`,
      `Contact: ${body.contact || "-"}`,
      "",
      body.message || "-",
    ].join("\n");

    const { error: dbError } = await supabase.from("inquiries").insert([
      {
        customer_name: body.name || "",
        email: body.email || "",
        company: body.company || "",
        contact: body.contact || "",
        product: body.product || "",
        quantity: body.quantity || "",
        destination: body.destination || "",
        packing: body.packing || "",
        country: body.destination || "",
        message: inquiryMessage,
        status: "new",
      },
    ]);

    if (dbError) {
      return res.status(500).json({ success: false, error: dbError.message });
    }

    if (resendApiKey) {
      try {
        const resend = new Resend(resendApiKey);
        await resend.emails.send({
          from: "ChinaDGExport <onboarding@resend.dev>",
          to: ["ukcz369@gmail.com"],
          subject: `New Inquiry - ${body.product || "Unknown Product"}`,
          html: `
            <h2>New Inquiry Received</h2>
            <h3>Contact Information</h3>
            <p><b>Name:</b> ${escapeHtml(body.name)}</p>
            <p><b>Email:</b> ${escapeHtml(body.email)}</p>
            <p><b>Company:</b> ${escapeHtml(body.company)}</p>
            <p><b>Contact:</b> ${escapeHtml(body.contact)}</p>
            <hr />
            <h3>Inquiry Details</h3>
            <p><b>Product:</b> ${escapeHtml(body.product)}</p>
            <p><b>Quantity:</b> ${escapeHtml(body.quantity)}</p>
            <p><b>Destination:</b> ${escapeHtml(body.destination)}</p>
            <p><b>Packing:</b> ${escapeHtml(body.packing)}</p>
            <hr />
            <h3>Message</h3>
            <p>${escapeHtml(body.message).replace(/\n/g, "<br />")}</p>
          `,
        });
      } catch (emailError) {
        console.error("Inquiry saved, but email notification failed:", emailError);
      }
    }

    return res.status(200).json({ success: true });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: String(error?.message || error),
    });
  }
}
