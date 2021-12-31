const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  console.log('LOG', process.env.SMTP_HOST);
  console.log('LOG', process.env.SMTP_PORT);
  console.log('LOG', process.env.SMTP_EMAIL);
  console.log('LOG', process.env.SMTP_PASSWORD);
  //   // create reusable transporter object using the default SMTP transport
  //   let transporter = nodemailer.createTransport({
  //     host: process.env.SMTP_HOST,
  //     port: process.env.SMTP_PORT,
  //     auth: {
  //       user: process.env.SMTP_EMAIL,
  //       pass: process.env.SMTP_PASWORD,
  //     },
  //   });

  let transporter = nodemailer.createTransport({
    host: 'smtp.mailtrap.io',
    port: 2525,
    auth: {
      user: '8faf9b4c71b603',
      pass: '3c80a002fe634e',
    },
  });

  // send mail with defined transport object
  const message = {
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  const info = await transporter.sendMail(message);

  console.log('Message :>> %s', info.messageId);
};

module.exports = sendEmail;
