import * as nodemailer from 'nodemailer';

function createTransporter() {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}

// ✅ Forgot password
export async function sendResetCode(email: string, code: string) {
  const transporter = createTransporter();

  await transporter.sendMail({
    from: '"Ecommerce App" <aminelanouar3@gmail.com>',
    to: email,
    subject: 'Password Reset Code',
    html: `
      <h2>Password Reset</h2>
      <p>Your reset code is:</p>
      <h1>${code}</h1>
      <p>This code expires in 5 minutes.</p>
    `,
  });
}

// ✅ shipped email
export async function sendShippedEmail(email: string, orderId: string) {
  const transporter = createTransporter();

  await transporter.sendMail({
    from: '"Ecommerce App" <aminelanouar3@gmail.com>',
    to: email,
    subject: 'Your order has been shipped 🚚',
    html: `
      <h2>🚚 Order Shipped</h2>
      <p>Your order <b>${orderId}</b> will be delivered within 24h. Wait for the delivery man’s call!</p>
    `,
  });
}
