import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer/index';

export const sendEmail = async (
    mailOptions: Mail.Options
) => {
    const transporter = nodemailer.createTransport({
        //   host: "smtp.ethereal.email",
        //   port: 587,
        //   secure: false, // Use true for port 465, false for port 587
        service: "gmail",
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS
        },
    });

    // Send an email using async/await

    const info = await transporter.sendMail({
        from: `"FAKHR "<${process.env.GMAIL_USER}>`,
        ...mailOptions
    });

    // console.log("Message sent:", info.messageId);
    return info.accepted.length ? true : false

}

export const sendOtp = async () => {
    return Math.floor(100000 + Math.random() * 900000)
}
