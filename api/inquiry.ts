import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "Method not allowed",
    });
  }

  try {
    const body = req.body || {};

    if (!process.env.RESEND_API_KEY) {
      return res.status(500).json({
        success: false,
        error: "Missing RESEND_API_KEY",
      });
    }

    await resend.emails.send({
      from: "ChinaDGExport <onboarding@resend.dev>",
      to: ["ukzc369@gmail.com"],
      subject: `New Inquiry - ${body.product || "Unknown Product"}`,
      html: `
        <h2>New Inquiry Received</h2>
        <p><b>Name:</b> ${body.name || "-"}</p>
        <p><b>Email:</b> ${body.email || "-"}</p>
        <p><b>Company:</b> ${body.company || "-"}</p>
        <p><b>Contact:</b> ${body.contact || "-"}</p>
        <hr/>
        <p><b>Product:</b> ${body.product || "-"}</p>
        <p><b>Quantity:</b> ${body.quantity || "-"}</p>
        <p><b>Destination:</b> ${body.destination || "-"}</p>
        <p><b>Packing:</b> ${body.packing || "-"}</p>
        <hr/>
        <p><b>Message:</b></p>
        <p>${body.message || "-"}</p>
      `,
    });

    let autoReplySent = false;

    if (body.email) {
      try {
        await resend.emails.send({
          from: "ChinaDGExport <onboarding@resend.dev>",
          to: [body.email],
          subject: "Thank you for contacting ChinaDGExport",
          html: `
            <h2>Thank you for your inquiry</h2>
            <p>Dear ${body.name || "Customer"},</p>
            <p>We have received your inquiry. Our export team will contact you within 24 hours.</p>
            <hr/>
            <p><b>Product:</b> ${body.product || "-"}</p>
            <p><b>Quantity:</b> ${body.quantity || "-"}</p>
            <p><b>Destination:</b> ${body.destination || "-"}</p>
            <p><b>Packing:</b> ${body.packing || "-"}</p>
            <br/>
            <p>Best regards,<br/>ChinaDGExport Team</p>
          `,
        });

        autoReplySent = true;
      } catch (autoReplyError) {
        console.error("Auto reply failed:", autoReplyError);
      }
    }

    return res.status(200).json({
      success: true,
      autoReplySent,
    });
  } catch (error: any) {
    console.error("Inquiry API Error:", error);

    return res.status(500).json({
      success: false,
      error: String(error?.message || error),
    });
  }
}