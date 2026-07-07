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

    const adminEmail = await resend.emails.send({
      from: "ChinaDGExport <onboarding@resend.dev>",
      to: ["ukzc369@gmail.com"],
      subject: `New Inquiry - ${body.product || "Unknown Product"}`,
      html: `
        <h2>New Inquiry Received</h2>

        <h3>Contact Information</h3>
        <p><b>Name:</b> ${body.name || "-"}</p>
        <p><b>Email:</b> ${body.email || "-"}</p>
        <p><b>Company:</b> ${body.company || "-"}</p>
        <p><b>Contact:</b> ${body.contact || "-"}</p>

        <hr />

        <h3>Inquiry Details</h3>
        <p><b>Product:</b> ${body.product || "-"}</p>
        <p><b>Quantity:</b> ${body.quantity || "-"}</p>
        <p><b>Destination:</b> ${body.destination || "-"}</p>
        <p><b>Packing:</b> ${body.packing || "-"}</p>

        <hr />

        <h3>Message</h3>
        <p>${body.message || "-"}</p>
      `,
    });

    if (adminEmail.error) {
      return res.status(500).json({
        success: false,
        error: adminEmail.error.message || "Admin email failed",
      });
    }

    return res.status(200).json({
      success: true,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: String(error?.message || error),
    });
  }
}