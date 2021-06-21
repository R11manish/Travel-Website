const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');


module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `Manish Rawat <${process.env.EMAIL_ADDRESS}>`
  }

  newTransport() {
    if (process.env.NODE_ENV == 'production') {
      return nodemailer.createTransport({
        host: process.env.PROD_EMAIL_HOST,
        port: process.env.PROD_EMAIL_PORT, // no need to set host or port etc.
        auth: {
          user: process.env.PROD_EMAIL_USER,
          pass: process.env.PROD_EMAIL_PASS
        }
      })
    }
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
      }
    })
  }

  // send the actual email 
  async send(template, subject) {
    //render html based template in pug
    const html = pug.renderFile(
      `${__dirname}/../views/email/${template}.pug`,
      {
        firstName: this.firstName,
        url: this.url,
        subject
      }
    );

    // define email option

    const mailOptions = {
      from: this.form,
      to: this.to,
      subject,
      html,
      text: htmlToText.htmlToText(html)
    }

    //3 create a transport and send email
    await this.newTransport().sendMail(mailOptions)
  }

  async sendWelcome() {
    await this.send('welcome', 'welcome to natours family!!')
  }

  async sendPasswordReset() {
    await this.send('passwordReset', 'Your password reset token (valid for only 10 minutes)')
  }

}
