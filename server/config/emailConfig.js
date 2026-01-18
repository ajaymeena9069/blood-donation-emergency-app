import nodemailer from 'nodemailer';
import { EMAIL_PASSWORD, EMAIL_USER } from './env.js';

console.log(EMAIL_USER);

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASSWORD,
    }
});

transporter.verify((error) => {
    if (error) {
        console.error('❌ Email server error:', error);
    } else {
        console.error('Email service working');
    }
})

export default transporter;