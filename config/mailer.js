var nodemailer = require('nodemailer');
var mailOptions = {
    from: 'Chalupa jablonovce <info@jablonovce.com>',
    to: 'jozef.kluvanec@simb.sk',
    subject: 'Testovaci email',
    body: 'Obycajny text',
    SMTP: {
        host: 'smtp://simb01.simb.sk',
        port: 465,
        secure: true,
        auth: {
            user: "info",
            pass: "1nf0wica"
        }
    }
}


class SendEmail {

    constructor(options) {
        mailOptions.from = options.from,
        mailOptions.to = options.to,
        mailOptions.subject = options.subject,
        mailOptions.body = options.body,
        mailOptions.SMTP = options.SMTP,

        function () {
            this.transporter = nodemailer.createTransport(mailOptions.SMTP);
        }
    }

    send() {
        this.trasporter.sendMail(mailOptions, function (err, info) {
            if (err) {
                return new Error("Can not send e email");
            }
            return info;
        })
    }
}


module.exports = SendEmail;
