/**
 * @module utils
 */

import nodemailer from 'nodemailer';

// async..await is not allowed in global scope, must use a wrapper
export async function sendMail(email: string, url: string) {
  const testAccount = await nodemailer.createTestAccount();

  // Create reusable transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  // Send mail with defined transport object
  const info = await transporter.sendMail({
    from: '"Fred Foo 👻" <foo@example.com>', // sender address
    to: email,
    subject: 'Hello ✔', // Subject line
    text: 'Hello world?', // plain text body
    html: `<a href='"${url}'>${url}</a>`, // html body
  });

  console.log('Message sent: %s', info.messageId);

  // Preview only available when sending through an Ethereal account
  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
}
