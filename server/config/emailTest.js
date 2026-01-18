// testEmail.js
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import path from "path";
import { fileURLToPath } from 'url';
import { EMAIL_PASSWORD, EMAIL_USER } from './env.js';
console.log('User:', EMAIL_USER); 
console.log('Pass:', EMAIL_PASSWORD ? 'Loaded' : 'Not Loaded');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendTestEmail = async () => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: '✅ Test Email - Blood Donation System',
      text: 'Email system is working perfectly!',
    });
    console.log('✅ Test email sent successfully!');
    console.log('📧 From:', process.env.EMAIL_USER);
    console.log('🔑 Using app password');
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\nTroubleshooting:');
    console.log('1. Check if EMAIL_USER is correct');
    console.log('2. Check if EMAIL_PASSWORD is correct 16-digit app password');
    console.log('3. Enable "Less secure app access" if needed');
  }
};

sendTestEmail();
