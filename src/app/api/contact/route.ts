import { NextResponse } from "next/server";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(200),
  email: z.string().trim().email("Enter a valid email address"),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(5000),
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const result = contactSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { error: "Invalid input", details: result.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  // No email provider is wired in this deployment - submissions are logged
  // server-side. Point this at a transactional email API (Resend, Postmark,
  // SES) using the validated `result.data` to deliver them for real.
  console.log("[contact] new submission:", result.data);

  return NextResponse.json({ success: true });
}
