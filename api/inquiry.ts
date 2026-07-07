import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";

const resend = new Resend(process.env.RESEND_API_KEY);

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || "",
  process.env.VITE_SUPABASE_ANON_KEY || ""
);

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "Method not allowed",
    });
  }

  try {
    const body = req.body || {};

    if (!process.env.VITE_SUPABASE_URL || !process.env.VITE_SUPABASE_ANON_KEY) {
      return res.status(500).json({
        success: false,
        error: "Missing Supabase environment variables",
      });
    }

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
        message: body.message || "",
        status: "new",
      },
    ]);

    if (dbError) {
      return res.status(500).json({
        success: false,
        error: dbError.message,
      });
    }

    if (process.env.RESEND_API_KEY) {
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
          <hr />
          <p><b>Product:</b> ${body.product || "-"}</p>
          <p><b>Quantity:</b> ${body.quantity || "-"}</p>
          <p><b>Destination:</b> ${body.destination || "-"}</p>
          <p><b>Packing:</b> ${body.packing || "-"}</p>
          <hr />
          <p><b>Message:</b></p>
          <p>${body.message || "-"}</p>
        `,
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