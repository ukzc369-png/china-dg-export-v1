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

export async function onRequestPost(context: any) {
  try {
    const body = await context.request.json();

    const supabaseUrl = context.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = context.env.VITE_SUPABASE_ANON_KEY;
    const resendApiKey = context.env.RESEND_API_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      return Response.json(
        { success: false, error: "Missing Supabase environment variables" },
        { status: 500 },
      );
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
    message: inquiryMessage,
    status: "new",
  },
]);

    if (dbError) {
      return Response.json(
        { success: false, error: dbError.message },
        { status: 500 },
      );
    }

    if (resendApiKey) {
      const resend = new Resend(resendApiKey);

      await resend.emails.send({
        from: "ChinaDGExport <onboarding@resend.dev>",
        to: ["ukzc369@gmail.com"],
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

      if (body.email) {
        await resend.emails.send({
          from: "ChinaDGExport <onboarding@resend.dev>",
          to: [body.email],
          subject: "Thank you for contacting ChinaDGExport",
          html: `
            <h2>Thank you for your inquiry</h2>
            <p>Dear ${escapeHtml(body.name || "Customer")},</p>
            <p>We have received your chemical export request. Our team will review product availability, DG compliance, packing and shipment options.</p>
            <h3>Your Inquiry Summary</h3>
            <p><b>Product:</b> ${escapeHtml(body.product || "-")}</p>
            <p><b>Quantity:</b> ${escapeHtml(body.quantity || "-")}</p>
            <p><b>Destination:</b> ${escapeHtml(body.destination || "-")}</p>
            <p><b>Packing:</b> ${escapeHtml(body.packing || "-")}</p>
            <p>We will contact you within 24 hours by email or your preferred contact method.</p>
            <hr />
            <p>Best regards,<br/>ChinaDGExport<br/>Dangerous Chemical Export Platform</p>
          `,
        });
      }
    }

    return Response.json({ success: true });
  } catch (error: any) {
    return Response.json(
      { success: false, error: String(error?.message || error) },
      { status: 500 },
    );
  }
}
