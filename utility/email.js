const nodemailer = require('nodemailer');

const sendEmail = async options => {
  //1 ) create a transporter
  var transport = nodemailer.createTransport({
    host: 'smtp.mailtrap.io',
    port: 2525,
    auth: {
      user: '38a260f91a2720',
      pass: '16b9384108247a'
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



