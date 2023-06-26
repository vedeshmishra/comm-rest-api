import nodemailer from 'nodemailer';
import asyncHandler from 'express-async-handler';

const sendEmail = asyncHandler(async (data, req, res) => {
    try {
        // create reusable transporter object using the default SMTP transport
            let transporter = nodemailer.createTransport({
               // host: "smtp.ethereal.email",
                host: "smtp.gmail.com",
                port: 587,
                secure: false, // true for 465, false for other ports
                auth: {
               // user: testAccount.user, // generated ethereal user
                user: process.env.EMAIL_USER, // generated ethereal user
                //pass: testAccount.pass, // generated ethereal password
                pass: process.env.EMAIL_PASS, // generated ethereal password
                },
            });

            // send mail with defined transport object
            let info = await transporter.sendMail({
                from: '"Hey" <devved2017@gmail.com>', // sender address
                to: data.to, // list of receivers
                subject: data.subject, // Subject line
                text: data.text, // plain text body
                html: data.html, // html body
            });

            console.log("Message sent: %s", info.messageId);
            // Preview only available when sending through an Ethereal account
             console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

    }
    catch (e) {
        throw new Error(e);
    }

})

export default sendEmail;