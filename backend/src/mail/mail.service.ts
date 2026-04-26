import * as nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'aminelanouar3@gmail.com',
    pass: 'omiy iodl uqbz mlzk',
  },
});

export async function sendResetCode(email: string, code: string) {
  await transporter.sendMail({
    from: '"Ecommerce App" aminelanouar3@gmail.com',
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
