import transporter from "./nodemailer.js";

const sendEmail = async function (email, subject, message) {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM_EMAIL, 
      to: email , 
      subject: subject || "Hii reset your password", 
      html: message || 'check' , 
    })
  } catch (error) {
     console.log(error)
  }
};

export default sendEmail;