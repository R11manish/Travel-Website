const nodemailer = require('nodemailer');

const sendEmail = async options => {
  //1 ) create a transporter
  var transport = nodemailer.createTransport({
    host: 'smtp.mailtrap.io',
    port: 2525,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  //2) define the email options

  const mailOptions = {
    from: 'Tours.inc -  team@tours.io',
    to: options.email,
    subject: options.subject,
    text: options.message
  };

  //3) actually send the email
  await transport.sendMail(mailOptions);
};

module.exports = sendEmail;
