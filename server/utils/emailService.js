import transporter from "../config/emailConfig.js";
import { EMAIL_USER, FRONTEND_URL } from "../config/env.js";


export const emailDonorForNewRequest = async (donorEmail, donorName, patientName, requestDetails) => {
  try {
    const isEmergency = requestDetails.emergency || false;
    const mailOptions = {
      from: `"Blood Donation Emergency Help App" <${EMAIL_USER}>`,
      to: donorEmail,
      subject: `${isEmergency ? '🚨 EMERGENCY: ' : ''}New Blood Request in ${requestDetails.city} - ${requestDetails.bloodGroup} Needed`,
      html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; padding: 20px;">
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
              <a href="${FRONTEND_URL || 'http://localhost:3000'}/donor/matching-requests" 
                 style="background: ${isEmergency ? '#dc2626' : '#10b981'}; color: white; padding: 14px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; font-size: 16px;">
                👉 View & Accept Request
              </a>
            </div>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">
              <p><strong>Note:</strong> This email was sent because your blood group (${requestDetails.bloodGroup}) and location (${requestDetails.city}) match this request.</p>
              <p style="margin-top: 10px;">
                <a href="${FRONTEND_URL || 'http://localhost:3000'}/settings" style="color: #3b82f6; text-decoration: none;">
                  Manage notification preferences
                </a>
              </p>
            </div>
          </div>
        </div>
      `,
    };

    // const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`❌ Failed to email donor ${donorEmail}:`, error.message);
    return { success: false, error: error.message };
  }
};

export const emailPatientForAcceptance = async (patientEmail, patientName, donorName, requestDetails) => {
  try {
    const mailOptions = {
      from: `"Blood Donation System" <${EMAIL_USER}>`,
      to: patientEmail,
      subject: `✅ Great News! ${donorName} Accepted Your Blood Request`,
      html: `
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
              <a href="${FRONTEND_URL || 'http://localhost:3000'}/patient/requests" 
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
      `,
    };

    // const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };

  } catch (error) {
    console.error(`❌ Failed to email patient ${patientEmail}:`, error.message);
    return { success: false, error: error.message };
  }
};


export const emailPatientForCancellation = async (patientEmail, patientName, donorName, requestDetails, reason) => {
  try {
    const mailOptions = {
      from: `"Blood Donation System" <${EMAIL_USER}>`,
      to: patientEmail,
      subject: `⚠️ Update: ${donorName} Cancelled Your Blood Request`,
      html: `
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
              <a href="${FRONTEND_URL || 'http://localhost:3000'}/patient/requests" 
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
      `,
    };

    // const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Cancellation email sent to ${patientEmail}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };

  } catch (error) {
    console.error(`❌ Failed to send cancellation email to ${patientEmail}:`, error.message);
    return { success: false, error: error.message };
  }
};

export const emailDonorForPatientCancellation = async (donorEmail, donorName, patientName, requestDetails, reason) => {
  try {
    const mailOptions = {
      from: `"Blood Donation System" <${EMAIL_USER}>`,
      to: donorEmail,
      subject: `⚠️ Update: Blood Request Cancelled by Patient`,
      html: `
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
              <a href="${FRONTEND_URL || 'http://localhost:3000'}/donor/matches" 
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
      `,
    };

    // const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Patient cancellation email sent to donor ${donorEmail}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };

  } catch (error) {
    console.error(`❌ Failed to send cancellation email to donor ${donorEmail}:`, error.message);
    return { success: false, error: error.message };
  }
};
