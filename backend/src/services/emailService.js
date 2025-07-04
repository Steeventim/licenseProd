import nodemailer from 'nodemailer';
import { config } from '../config/index.js';

export class EmailService {
  static transporter = null;

  // Initialiser le transporteur email
  static getTransporter() {
    if (!this.transporter && config.SMTP_HOST) {
      this.transporter = nodemailer.createTransporter({
        host: config.SMTP_HOST,
        port: config.SMTP_PORT,
        secure: config.SMTP_PORT === 465,
        auth: {
          user: config.SMTP_USER,
          pass: config.SMTP_PASS,
        },
      });
    }
    return this.transporter;
  }

  // Envoyer un avertissement d'expiration
  static async sendExpirationWarning(license) {
    const transporter = this.getTransporter();
    if (!transporter) {
      console.warn('Service email non configuré');
      return false;
    }

    const expirationDate = new Date(license.expiresAt).toLocaleDateString('fr-FR');
    
    const mailOptions = {
      from: config.SMTP_USER,
      to: license.client.email,
      subject: '⚠️ Votre licence expire bientôt',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #ff6b35;">⚠️ Licence en cours d'expiration</h2>
          
          <p>Bonjour <strong>${license.client.name}</strong>,</p>
          
          <p>Votre licence <code>${license.key}</code> va expirer le <strong>${expirationDate}</strong>.</p>
          
          <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3>Détails de la licence :</h3>
            <ul>
              <li><strong>Clé :</strong> ${license.key}</li>
              <li><strong>Fonctionnalités :</strong> ${license.features.join(', ')}</li>
              <li><strong>Statut :</strong> ${license.status}</li>
              <li><strong>Date d'expiration :</strong> ${expirationDate}</li>
            </ul>
          </div>
          
          <p>Pour renouveler votre licence, veuillez contacter notre équipe support.</p>
          
          <p>Cordialement,<br>L'équipe Licences</p>
        </div>
      `
    };

    try {
      await transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error('Erreur envoi email:', error);
      return false;
    }
  }

  // Envoyer une notification de nouvelle licence
  static async sendLicenseCreated(license) {
    const transporter = this.getTransporter();
    if (!transporter) {
      console.warn('Service email non configuré');
      return false;
    }

    const mailOptions = {
      from: config.SMTP_USER,
      to: license.client.email,
      subject: '🎉 Votre nouvelle licence est prête',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #28a745;">🎉 Licence créée avec succès</h2>
          
          <p>Bonjour <strong>${license.client.name}</strong>,</p>
          
          <p>Votre nouvelle licence a été créée avec succès.</p>
          
          <div style="background: #e8f5e8; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3>Détails de votre licence :</h3>
            <ul>
              <li><strong>Clé :</strong> <code>${license.key}</code></li>
              <li><strong>Fonctionnalités :</strong> ${license.features.join(', ')}</li>
              <li><strong>Statut :</strong> ${license.status}</li>
              ${license.expiresAt ? `<li><strong>Expire le :</strong> ${new Date(license.expiresAt).toLocaleDateString('fr-FR')}</li>` : '<li><strong>Validité :</strong> Permanente</li>'}
            </ul>
          </div>
          
          <p><strong>⚠️  Important :</strong> Gardez cette clé de licence en sécurité. Elle est nécessaire pour utiliser votre application.</p>
          
          <p>Cordialement,<br>L'équipe Licences</p>
        </div>
      `
    };

    try {
      await transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error('Erreur envoi email:', error);
      return false;
    }
  }

  // Envoyer une notification de révocation
  static async sendLicenseRevoked(license) {
    const transporter = this.getTransporter();
    if (!transporter) {
      console.warn('Service email non configuré');
      return false;
    }

    const mailOptions = {
      from: config.SMTP_USER,
      to: license.client.email,
      subject: '🚫 Licence révoquée',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #dc3545;">🚫 Licence révoquée</h2>
          
          <p>Bonjour <strong>${license.client.name}</strong>,</p>
          
          <p>Votre licence <code>${license.key}</code> a été révoquée.</p>
          
          <p>Si vous pensez qu'il s'agit d'une erreur, veuillez contacter notre équipe support.</p>
          
          <p>Cordialement,<br>L'équipe Licences</p>
        </div>
      `
    };

    try {
      await transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error('Erreur envoi email:', error);
      return false;
    }
  }
}
