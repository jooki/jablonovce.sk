var nodemailer = require('nodemailer');
var path = require('path').join;
var ejs = require('ejs');
var read = require('fs').readFileSync;

function extend(target) {
    var sources = [].slice.call(arguments, 1);
    sources.forEach(function (source) {
        for (var prop in source) {
            target[prop] = source[prop];
        }
    });
    return target;
}

function sendEmail(req, res, next) {
    var urlPath = req.url.substring(1);
    var mailOptions = res.locals.data.mailer;
    var str = '';
    try {
        var transporter = nodemailer.createTransport(mailOptions.SMTP);
        
        if (urlPath == 'contact') {
            mailOptions.subject = 'Kontaktovanie zákazníka';
            str = read(path(process.cwd(), 'views', 'emails', 'contact.ejs'), 'utf8');
             
        } else {
            mailOptions.subject = 'Rezervácia';
            str = read(path(process.cwd(), 'views', 'emails', 'reservation.ejs'), 'utf8');
        }
        mailOptions.to = req.body.email;
        mailOptions.html  = ejs.render(str, {'body':req.body});
        transporter.sendMail(mailOptions, function (err, info) {
            if (err) {
                console.log('/api/sendMailer/error');
                console.log(err);
                console.log(info);
            } else {
                // if you don't want to use this transport object anymore, uncomment following line
                // socketTimeout: 30 * 1000 // 0.5 min: Time of inactivity until the connection is closed
                transporter.close(); // shut down the connection pool, no more messages
            }
        })
    } catch (error) {
        console.log('/api/sendMailer/error');
        console.log(error);
    }
    transporter.close();
    next();
}

module.export = sendEmail;