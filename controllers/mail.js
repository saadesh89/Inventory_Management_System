// import nodemailer from 'nodemailer';
// // const dotenv = require('dotenv');
// import dotenv from "dotenv"
// dotenv.config();

// export const sendEmail = async (email, name,generatedPassword) => {
//   const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//       user: process.env.ADMIN_EMAIL,
//       pass: process.env.ADMIN_EMAIL_PASSWORD
//     }
//   });

//   const mailOptions  = {
//     from: '"Ardent Admin" <admin@ardentisys.com>',
//     subject: 'Your Staff Account Credentials',
//     to: email,
//     html: `<div style="font-family: Arial, sans-serif; padding: 20px; background: #f4f4f4;">
//           <div style="max-width: 600px; margin: auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
//             <h2 style="color: #333;">👋 Welcome to Ardent, ${name}!</h2>
//             <p style="font-size: 16px; color: #555;">
//               Your staff account has been created by the admin. Please use the credentials below to log in:
//             </p>
//             <div style="margin: 20px 0; padding: 15px; background: #e6f7ff; border-left: 5px solid #1890ff;">
//               <p><strong>Email:</strong> ${email}</p>
//               <p><strong>Temporary Password:</strong> ${generatedPassword}</p>
//             </div>
//             <p style="font-size: 14px; color: #777;">
//               For security reasons, please log in and change your password immediately.
//             </p>
//             <p style="margin-top: 40px; font-size: 14px; color: #aaa;">
//               – Ardent Team
//             </p>
//           </div>
//         </div>`
//   };

//   await transporter.sendMail(mailOptions)
 
// }
