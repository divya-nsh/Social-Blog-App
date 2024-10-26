import nodemailer from "nodemailer";

export function sendMail({ to, subject, html }) {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.email",
    secure: true,
    service: "gmail",
    from: `Story Nest" <${process.env.GOOGLE_SMTP_USERNAME}>`,
    auth: {
      user: process.env.GOOGLE_SMTP_USERNAME,
      pass: process.env.GOOGLE_SMTP_PASSWORD,
    },
  });
  return transporter.sendMail({
    to,
    subject,
    html,
  });
}

export async function mailResetPasswordToken(email, token, username) {
  return sendMail({
    to: email,
    subject: "Fogot Password for Story Nest",
    from: `Story Nest" <${process.env.GOOGLE_SMTP_USERNAME}>`,
    html: `
 <div style="font-family: Arial, sans-serif">
      <h1>
        <strong>Hey ${username}</strong>
      </h1>
      <p style="font-size: 16px; color: #3d3d3d;">
        You can reset your account password by clicking link below. If you did
        not make this request please ignore this email.
      </p>
      <a style="font-size:18px" href="http://localhost:5173/reset-password?token=${token}">
        Reset Password
      </a>
      <p style="color: #3d3d3d;">Valid for 15 minutes</p>
    </div>
  `,
  });
}

export async function mailResetPasswordDone(email, username) {
  return sendMail({
    to: email,
    subject: "Story Nest password changed",
    from: `Story Nest" <${process.env.GOOGLE_SMTP_USERNAME}>`,
    html: `
   <div style="font-family: Arial, sans-serif">
      <h1>
        <strong>Hey ${username}</strong>
      </h1>
       <p style="font-size: 16px; color: #3d3d3d">
        Your account password has been changed. If this wasn't done by you,
        please immediately reset your password further to prevent misuse of your
        account. If you need assistance, please contact us.
      </p>
      <p style="color: #3d3d3d">Thank you</p>
    </div>
  `,
  });
}
