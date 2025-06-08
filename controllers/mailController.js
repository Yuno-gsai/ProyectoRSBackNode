// controllers/mailController.js
import nodemailer from "nodemailer";

// Configura el transporte
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

export const sendWelcomeEmail = async (req, res) => {
  const userdata = req.body.data;
  const { to, nombre } = userdata;

  if (!to || !nombre) {
    return res.status(400).json({ error: "Faltan campos obligatorios" });
  }

  const mailOptions = {
    from: `"MiRedSocial" <${process.env.MAIL_USER}>`,
    to,
    subject: "¡Bienvenido a MiRedSocial!",
    html: `
      <h2>Hola ${nombre},</h2>
      <p>¡Gracias por registrarte en nuestra red social!</p>
      <p>Esperamos que disfrutes de tu experiencia 🎉</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ message: "Correo enviado correctamente" });
  } catch (error) {
    console.error("Error al enviar correo:", error);
    return res.status(500).json({ error: "No se pudo enviar el correo" });
  }
};
