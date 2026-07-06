import { Resend } from "resend";

export async function onRequestPost(context: any) {
  try {
    const body = await context.request.json();

    const resend = new Resend(
      context.env.RESEND_API_KEY
    );

    await resend.emails.send({
      from: "ChinaDGExport <onboarding@resend.dev>",
      to: ["ukzc369@gmail.com"],
      subject: `New Inquiry - ${body.product || "Unknown Product"}`,
      html: `
        <h2>New Inquiry Received</h2>

        <h3>Contact Information</h3>
        <p><b>Name:</b> ${body.name}</p>
        <p><b>Email:</b> ${body.email}</p>
        <p><b>Company:</b> ${body.company}</p>
        <p><b>Contact:</b> ${body.contact}</p>

        <hr />

        <h3>Inquiry Details</h3>
        <p><b>Product:</b> ${body.product}</p>
        <p><b>Quantity:</b> ${body.quantity}</p>
        <p><b>Destination:</b> ${body.destination}</p>
        <p><b>Packing:</b> ${body.packing}</p>

        <hr />

        <h3>Message</h3>
        <p>${body.message}</p>
      `,
    });

    return Response.json({
      success: true,
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        error: String(error),
      },
      {
        status: 500,
      }
    );
  }
}