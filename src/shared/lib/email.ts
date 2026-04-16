// src/shared/lib/email.ts
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendAlertEmail({
  to,
  subject,
  message,
}: {
  to: string;
  subject: string;
  message: string;
}) {
  if (!process.env.RESEND_API_KEY) return;

  await resend.emails.send({
    from:    "MIMS Alerts <noreply@yourdomain.com>",
    to,
    subject,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#0f172a;color:#f1f5f9;padding:32px;border-radius:12px">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:24px">
          <div style="width:40px;height:40px;background:#16a34a;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:18px">🛡️</div>
          <div>
            <p style="font-weight:700;font-size:16px;margin:0">MIMS Alert</p>
            <p style="font-size:12px;color:#94a3b8;margin:0">Indian Army Logistics Platform</p>
          </div>
        </div>
        <div style="background:#1e293b;border-radius:8px;padding:16px;margin-bottom:16px">
          <p style="font-size:14px;color:#f1f5f9;margin:0">${message}</p>
        </div>
        <p style="font-size:11px;color:#475569;margin:0">
          This is an automated alert from MIMS. Do not reply.
        </p>
      </div>
    `,
  });
}

export async function notifyAdminsOnLowStock(itemName: string, quantity: number, baseName: string) {
  const admins = await import("./prisma").then(({ prisma }) =>
    prisma.user.findMany({
      where: { role: { in: ["SUPER_ADMIN", "REGIONAL_ADMIN"] }, isActive: true },
      select: { email: true },
    })
  );

  for (const admin of admins) {
    await sendAlertEmail({
      to:      admin.email,
      subject: `⚠ Low Stock Alert — ${itemName}`,
      message: `${itemName} at ${baseName} has only ${quantity} units remaining. Immediate restocking required.`,
    });
  }
}
