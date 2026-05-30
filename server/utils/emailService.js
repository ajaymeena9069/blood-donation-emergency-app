import { BREVO_API_KEY, BREVO_SENDER_EMAIL, FRONTEND_URL } from "../config/env.js";

const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

// Helper function to send email using Brevo API
const sendBrevoEmail = async (toEmail, toName, subject, htmlContent) => {
  try {
    const response = await fetch(BREVO_API_URL, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "api-key": BREVO_API_KEY,
      },
      body: JSON.stringify({
        sender: {
          email: BREVO_SENDER_EMAIL,
          name: "Blood Donation System",
        },
        to: [{ email: toEmail, name: toName || toEmail.split("@")[0] }],
        subject: subject,
        htmlContent: htmlContent,
        textContent: "Please view this email in an HTML compatible mail client.",
      }),
    });

    const data = await response.json();

    if (response.ok) {
      console.log(`✅ Email sent to ${toEmail}:`, data.messageId);
      return { success: true, messageId: data.messageId };
    } else {
      console.error(`❌ Brevo API Error sending to ${toEmail}:`, data);
      return { success: false, error: data.message || "Failed to send email" };
    }
  } catch (error) {
    console.error(`❌ Send email error (${toEmail}):`, error.message);
    return { success: false, error: error.message };
  }
};

export const emailDonorForNewRequest = async (donorEmail, donorName, patientName, requestDetails) => {
  const isEmergency = requestDetails.emergency || false;
  const subject = `${isEmergency ? '🚨 EMERGENCY: ' : ''}New Blood Request in ${requestDetails.city} - ${requestDetails.bloodGroup} Needed`;
  const html = `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; padding: 20px;">
          <div style="background: ${isEmergency ? '#dc2626' : '#3b82f6'}; color: white; padding: 25px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 24px;">
              ${isEmergency ? '🚨 EMERGENCY BLOOD REQUEST' : '🆕 New Blood Request'}
            </h1>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #333; margin-bottom: 20px;">Hello ${donorName},</h2>
            
            <p style="color: #555; line-height: 1.6; margin-bottom: 20px;">
              ${isEmergency
          ? 'A patient needs your blood type <strong>URGENTLY</strong>. Please respond immediately!'
          : 'A patient in your area needs your blood type.'}
            </p>
            
            <div style="background: #f8fafc; padding: 20px; border-radius: 8px; border-left: 4px solid ${isEmergency ? '#dc2626' : '#3b82f6'}; margin-bottom: 25px;">
              <h3 style="color: #333; margin-top: 0;">Request Details:</h3>
              <table style="width: 100%;">
                <tr>
                  <td style="padding: 8px 0; color: #666;"><strong>Patient:</strong></td>
                  <td style="padding: 8px 0;">${patientName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;"><strong>Blood Group:</strong></td>
                  <td style="padding: 8px 0; color: ${isEmergency ? '#dc2626' : '#3b82f6'}; font-weight: bold;">${requestDetails.bloodGroup}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;"><strong>Hospital:</strong></td>
                  <td style="padding: 8px 0;">${requestDetails.hospitalName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;"><strong>Location:</strong></td>
                  <td style="padding: 8px 0;">${requestDetails.city}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;"><strong>Units Needed:</strong></td>
                  <td style="padding: 8px 0;">${requestDetails.units} unit${requestDetails.units > 1 ? 's' : ''}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;"><strong>Request Time:</strong></td>
                  <td style="padding: 8px 0;">${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</td>
                </tr>
              </table>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://blood-donation-emergency-app-01.vercel.app/donor/matching-requests" 
                 style="background: ${isEmergency ? '#dc2626' : '#10b981'}; color: white; padding: 14px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; font-size: 16px;">
                👉 View & Accept Request
              </a>
            </div>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">
              <p><strong>Note:</strong> This email was sent because your blood group (${requestDetails.bloodGroup}) and location (${requestDetails.city}) match this request.</p>
              <p style="margin-top: 10px;">
                <a href="https://blood-donation-emergency-app-01.vercel.app/settings" style="color: #3b82f6; text-decoration: none;">
                  Manage notification preferences
                </a>
              </p>
            </div>
          </div>
        </div>`;
  return await sendBrevoEmail(donorEmail, donorName, subject, html);
};

export const emailPatientForAcceptance = async (patientEmail, patientName, donorName, requestDetails) => {
  const subject = `✅ Great News! ${donorName} Accepted Your Blood Request`;
  const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; padding: 20px;">
          <div style="background: #10b981; color: white; padding: 25px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 24px;">🎉 Your Blood Request Was Accepted!</h1>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #333; margin-bottom: 20px;">Dear ${patientName},</h2>
            
            <p style="color: #555; line-height: 1.6; margin-bottom: 20px;">
              We have great news! A donor has accepted your blood request and will help you soon.
            </p>
            
            <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; border-left: 4px solid #10b981; margin-bottom: 25px;">
              <h3 style="color: #333; margin-top: 0;">Donation Details:</h3>
              <table style="width: 100%;">
                <tr>
                  <td style="padding: 8px 0; color: #666;"><strong>Donor Name:</strong></td>
                  <td style="padding: 8px 0; font-weight: bold;">${donorName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;"><strong>Blood Group:</strong></td>
                  <td style="padding: 8px 0; color: #dc2626; font-weight: bold;">${requestDetails.bloodGroup}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;"><strong>Hospital:</strong></td>
                  <td style="padding: 8px 0;">${requestDetails.hospitalName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;"><strong>Accepted at:</strong></td>
                  <td style="padding: 8px 0;">${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</td>
                </tr>
              </table>
            </div>
            
            <div style="background: #fffbeb; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
              <h4 style="color: #92400e; margin-top: 0;">📋 Next Steps:</h4>
              <ol style="color: #555; line-height: 1.6; padding-left: 20px;">
                <li>The donor will contact you on your registered phone number</li>
                <li>Prepare your hospital documents and ID proof</li>
                <li>Be available at ${requestDetails.hospitalName} for the donation</li>
                <li>Keep your phone charged and accessible</li>
              </ol>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://blood-donation-emergency-app-01.vercel.app/patient/requests" 
                 style="background: #3b82f6; color: white; padding: 14px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; font-size: 16px;">
                📊 View Request Status
              </a>
            </div>
            
            <div style="color: #6b7280; font-size: 14px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              <p><strong>Need help?</strong> Contact our support: support@blooddonation.com</p>
              <p>This is an automated email. Please do not reply to this address.</p>
            </div>
          </div>
        </div>
      `;
  return await sendBrevoEmail(patientEmail, patientName, subject, html);
};

export const emailPatientForCancellation = async (patientEmail, patientName, donorName, requestDetails, reason) => {
  const subject = `⚠️ Update: ${donorName} Cancelled Your Blood Request`;
  const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; padding: 20px;">
          <div style="background: #f59e0b; color: white; padding: 25px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 24px;">⚠️ Request Cancellation Update</h1>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #333; margin-bottom: 20px;">Dear ${patientName},</h2>
            
            <p style="color: #555; line-height: 1.6; margin-bottom: 20px;">
              We regret to inform you that <strong>${donorName}</strong> has cancelled their acceptance of your blood request.
            </p>
            
            <div style="background: #fffbeb; padding: 20px; border-radius: 8px; border-left: 4px solid #f59e0b; margin-bottom: 25px;">
              <h3 style="color: #333; margin-top: 0;">Cancellation Details:</h3>
              <table style="width: 100%;">
                <tr>
                  <td style="padding: 8px 0; color: #666;"><strong>Cancelled by:</strong></td>
                  <td style="padding: 8px 0; font-weight: bold;">${donorName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;"><strong>Blood Group:</strong></td>
                  <td style="padding: 8px 0; color: #dc2626; font-weight: bold;">${requestDetails.bloodGroup}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;"><strong>Hospital:</strong></td>
                  <td style="padding: 8px 0;">${requestDetails.hospitalName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;"><strong>Cancelled at:</strong></td>
                  <td style="padding: 8px 0;">${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666; vertical-align: top;"><strong>Reason:</strong></td>
                  <td style="padding: 8px 0;">
                    <div style="background: #fef3c7; padding: 10px; border-radius: 5px; font-style: italic;">
                      "${reason}"
                    </div>
                  </td>
                </tr>
              </table>
            </div>
            
            <div style="background: #d1fae5; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
              <h4 style="color: #065f46; margin-top: 0;">✅ Good News: Request Available Again!</h4>
              <ul style="color: #555; line-height: 1.6; padding-left: 20px;">
                <li>Your request status has been reset to <strong>"Pending"</strong></li>
                <li>Other matching donors will be notified</li>
                <li>You can wait for another donor to accept</li>
                <li>Or you can cancel this request entirely</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://blood-donation-emergency-app-01.vercel.app/patient/requests" 
                 style="background: #3b82f6; color: white; padding: 14px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; font-size: 16px;">
                📋 View & Manage Your Requests
              </a>
            </div>
            
            <div style="background: #fef2f2; padding: 15px; border-radius: 8px; margin-top: 25px;">
              <p style="color: #dc2626; margin: 0; font-weight: bold;">
                ⚠️ Need immediate help? Contact the hospital directly or call emergency: 102
              </p>
            </div>
            
            <div style="color: #6b7280; font-size: 14px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              <p><strong>Note:</strong> This is an automated notification. Please do not reply to this address.</p>
              <p>© ${new Date().getFullYear()} Blood Donation System. All rights reserved.</p>
            </div>
          </div>
        </div>
      `;
  return await sendBrevoEmail(patientEmail, patientName, subject, html);
};

export const emailDonorForPatientCancellation = async (donorEmail, donorName, patientName, requestDetails, reason) => {
  const subject = `⚠️ Update: Blood Request Cancelled by Patient`;
  const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; padding: 20px;">
          <div style="background: #dc2626; color: white; padding: 25px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 24px;">⚠️ Request Cancelled</h1>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #333; margin-bottom: 20px;">Dear ${donorName},</h2>
            
            <p style="color: #555; line-height: 1.6; margin-bottom: 20px;">
              We would like to inform you that the patient <strong>${patientName}</strong> has cancelled their blood request that you were matched with.
            </p>
            
            <div style="background: #fef2f2; padding: 20px; border-radius: 8px; border-left: 4px solid #dc2626; margin-bottom: 25px;">
              <h3 style="color: #333; margin-top: 0;">Request Details (Cancelled):</h3>
              <table style="width: 100%;">
                <tr>
                  <td style="padding: 8px 0; color: #666;"><strong>Cancelled by:</strong></td>
                  <td style="padding: 8px 0; font-weight: bold; color: #dc2626;">${patientName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;"><strong>Blood Group:</strong></td>
                  <td style="padding: 8px 0; color: #dc2626; font-weight: bold;">${requestDetails.bloodGroup}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;"><strong>Units Needed:</strong></td>
                  <td style="padding: 8px 0; font-weight: bold;">${requestDetails.units} unit(s)</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;"><strong>Hospital:</strong></td>
                  <td style="padding: 8px 0;">${requestDetails.hospitalName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;"><strong>Location:</strong></td>
                  <td style="padding: 8px 0;">${requestDetails.city}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;"><strong>Cancelled at:</strong></td>
                  <td style="padding: 8px 0;">${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666; vertical-align: top;"><strong>Patient's Reason:</strong></td>
                  <td style="padding: 8px 0;">
                    <div style="background: #fecaca; padding: 10px; border-radius: 5px; font-style: italic;">
                      "${reason || 'Patient decided to cancel the request'}"
                    </div>
                  </td>
                </tr>
              </table>
            </div>
            
            <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
              <h4 style="color: #0369a1; margin-top: 0;">🎯 What This Means For You:</h4>
              <ul style="color: #555; line-height: 1.6; padding-left: 20px;">
                <li>Your acceptance for this request is now <strong>automatically cancelled</strong></li>
                <li>You are now available to accept other matching requests</li>
                <li>This won't affect your donor profile or rating</li>
                <li>You can continue to help other patients in need</li>
              </ul>
            </div>
            
            <div style="background: #d1fae5; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
              <h4 style="color: #065f46; margin-top: 0;">❤️ Your Impact Still Matters!</h4>
              <p style="color: #555; line-height: 1.6; margin-bottom: 10px;">
                Thank you for your willingness to donate. Your readiness to help saves lives. 
                Please continue checking for other blood requests where you can make a difference.
              </p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://blood-donation-emergency-app-01.vercel.app/donor/matches" 
                 style="background: #3b82f6; color: white; padding: 14px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; font-size: 16px;">
                🔍 View Other Matching Requests
              </a>
            </div>
            
            <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin-top: 25px;">
              <p style="color: #92400e; margin: 0; font-weight: bold;">
                💡 Tip: Keep your donor profile updated to get better matches!
              </p>
            </div>
            
            <div style="color: #6b7280; font-size: 14px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              <p><strong>Note:</strong> This cancellation was initiated by the patient. Please respect their decision.</p>
              <p>© ${new Date().getFullYear()} Blood Donation System. All rights reserved.</p>
            </div>
          </div>
        </div>
      `;
  return await sendBrevoEmail(donorEmail, donorName, subject, html);
};

export const sendPasswordResetEmail = async (userEmail, userName, resetUrl) => {
  const subject = `🔐 Password Reset Request - Blood Donation System`;
  const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; padding: 20px;">
          <div style="background: #3b82f6; color: white; padding: 25px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 24px;">🔐 Password Reset Request</h1>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #333; margin-bottom: 20px;">Hello ${userName},</h2>
            
            <p style="color: #555; line-height: 1.6; margin-bottom: 20px;">
              We received a request to reset your password for your Blood Donation System account.
            </p>
            
            <div style="background: #eff6ff; padding: 20px; border-radius: 8px; border-left: 4px solid #3b82f6; margin-bottom: 25px;">
              <p style="color: #555; margin: 0; line-height: 1.6;">
                Click the button below to reset your password. This link will expire in <strong>30 minutes</strong>.
              </p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" 
                 style="background: #3b82f6; color: white; padding: 14px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; font-size: 16px;">
                🔑 Reset Password
              </a>
            </div>
            
            <div style="background: #fef2f2; padding: 15px; border-radius: 8px; margin-top: 25px;">
              <p style="color: #dc2626; margin: 0; font-size: 14px;">
                <strong>⚠️ Security Notice:</strong> If you didn't request this password reset, please ignore this email. Your password will remain unchanged.
              </p>
            </div>
            
            <div style="margin-top: 25px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 14px; margin-bottom: 10px;">
                If the button doesn't work, copy and paste this link into your browser:
              </p>
              <p style="color: #3b82f6; font-size: 12px; word-break: break-all; background: #f3f4f6; padding: 10px; border-radius: 5px;">
                ${resetUrl}
              </p>
            </div>
            
            <div style="color: #6b7280; font-size: 14px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              <p><strong>Need help?</strong> Contact our support: support@blooddonation.com</p>
              <p>© ${new Date().getFullYear()} Blood Donation System. All rights reserved.</p>
            </div>
          </div>
        </div>
      `;
  return await sendBrevoEmail(userEmail, userName, subject, html);
};

export const sendNewUserCredentials = async (userEmail, userName, password, role) => {
  const subject = `🎉 Welcome to Blood Donation System - Your Account Details`;
  const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; padding: 20px;">
          <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 25px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 24px;">🎉 Welcome to Blood Donation System!</h1>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #333; margin-bottom: 20px;">Hello ${userName},</h2>
            
            <p style="color: #555; line-height: 1.6; margin-bottom: 20px;">
              Your account has been created by an administrator. Welcome to our blood donation community!
            </p>
            
            <div style="background: #d1fae5; padding: 20px; border-radius: 8px; border-left: 4px solid #10b981; margin-bottom: 25px;">
              <h3 style="color: #333; margin-top: 0;">🔑 Your Login Credentials:</h3>
              <table style="width: 100%;">
                <tr>
                  <td style="padding: 8px 0; color: #666;"><strong>Email:</strong></td>
                  <td style="padding: 8px 0; font-family: monospace; background: #f3f4f6; padding: 5px 10px; border-radius: 4px;">${userEmail}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;"><strong>Password:</strong></td>
                  <td style="padding: 8px 0; font-family: monospace; background: #fef3c7; padding: 5px 10px; border-radius: 4px; font-weight: bold;">${password}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;"><strong>Role:</strong></td>
                  <td style="padding: 8px 0; text-transform: capitalize;">${role}</td>
                </tr>
              </table>
            </div>
            
            <div style="background: #fef2f2; padding: 15px; border-radius: 8px; margin-bottom: 25px;">
              <p style="color: #dc2626; margin: 0; font-size: 14px;">
                <strong>⚠️ Important:</strong> Please change your password after your first login for security reasons.
              </p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://blood-donation-emergency-app-01.vercel.app/login" 
                 style="background: #10b981; color: white; padding: 14px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; font-size: 16px;">
                🚀 Login Now
              </a>
            </div>
            
            <div style="background: #eff6ff; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
              <h4 style="color: #0369a1; margin-top: 0;">📋 Next Steps:</h4>
              <ol style="color: #555; line-height: 1.6; padding-left: 20px;">
                <li>Login using the credentials above</li>
                <li>Complete your profile information</li>
                <li>Change your password in settings</li>
                <li>Start ${role === 'donor' ? 'saving lives by donating blood' : 'requesting blood when needed'}</li>
              </ol>
            </div>
            
            <div style="color: #6b7280; font-size: 14px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              <p><strong>Need help?</strong> Contact our support: support@blooddonation.com</p>
              <p>© ${new Date().getFullYear()} Blood Donation System. All rights reserved.</p>
            </div>
          </div>
        </div>
      `;
  return await sendBrevoEmail(userEmail, userName, subject, html);
};

export const sendRequestRejectionEmail = async (patientEmail, patientName, bloodGroup, rejectionReason) => {
  const subject = `❌ Blood Request Rejected - ${bloodGroup}`;
  const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; padding: 20px;">
          <div style="background: #dc2626; color: white; padding: 25px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 24px;">❌ Request Rejected</h1>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #333; margin-bottom: 20px;">Dear ${patientName},</h2>
            
            <p style="color: #555; line-height: 1.6; margin-bottom: 20px;">
              We regret to inform you that your blood request for <strong>${bloodGroup}</strong> has been rejected by the administrator.
            </p>
            
            <div style="background: #fef2f2; padding: 20px; border-radius: 8px; border-left: 4px solid #dc2626; margin-bottom: 25px;">
              <h3 style="color: #333; margin-top: 0;">Rejection Reason:</h3>
              <p style="color: #555; line-height: 1.6; font-style: italic; background: #fecaca; padding: 15px; border-radius: 5px;">
                "${rejectionReason}"
              </p>
            </div>
            
            <div style="background: #eff6ff; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
              <h4 style="color: #0369a1; margin-top: 0;">📋 What You Can Do:</h4>
              <ul style="color: #555; line-height: 1.6; padding-left: 20px;">
                <li>Review the rejection reason carefully</li>
                <li>Contact the administrator if you have questions</li>
                <li>Create a new request with correct information</li>
                <li>Contact the hospital directly for urgent needs</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://blood-donation-emergency-app-01.vercel.app/patient/create/request" 
                 style="background: #3b82f6; color: white; padding: 14px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; font-size: 16px;">
                📝 Create New Request
              </a>
            </div>
            
            <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin-top: 25px;">
              <p style="color: #92400e; margin: 0; font-weight: bold;">
                ⚠️ For emergency needs, please contact: 102 or visit nearest hospital
              </p>
            </div>
            
            <div style="color: #6b7280; font-size: 14px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              <p><strong>Need help?</strong> Contact support: support@blooddonation.com</p>
              <p>© ${new Date().getFullYear()} Blood Donation System. All rights reserved.</p>
            </div>
          </div>
        </div>
      `;
  return await sendBrevoEmail(patientEmail, patientName, subject, html);
};
