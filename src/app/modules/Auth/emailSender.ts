import nodemailer from 'nodemailer';
import config from '../../config';


const emailSender = async (
    email: string,
    html: string
) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: config.emailSender,
            pass: config.app_password,
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    // send mail with defined transport object
    const info = await transporter.sendMail({
        from: '"Flat Sharing Platform" <tayebhossain88@gmail.com>',
        to: email, // list of receivers
        subject: "Reset password link", // Subject line
        html: html,
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>



}


export default emailSender;