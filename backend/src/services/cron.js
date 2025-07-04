import cron from 'node-cron';
import { prisma } from '../server.js';
import { LoggingService } from './loggingService.js';
import { EmailService } from './emailService.js';

export function startCronJobs() {
  console.log('🕐 Démarrage des tâches programmées...');

  // Vérification des licences expirées - toutes les heures
  cron.schedule('0 * * * *', async () => {
    console.log('🔍 Vérification des licences expirées...');
    await checkExpiredLicenses();
  });

  // Nettoyage des anciens logs - tous les dimanche à 2h
  cron.schedule('0 2 * * 0', async () => {
    console.log('🧹 Nettoyage des anciens logs...');
    await LoggingService.cleanOldLogs(90);
  });

  // Notifications d'expiration - tous les jours à 9h
  cron.schedule('0 9 * * *', async () => {
    console.log('📧 Vérification des notifications d\'expiration...');
    await checkExpirationNotifications();
  });

  console.log('✅ Tâches programmées configurées');
}

// Marquer les licences expirées
async function checkExpiredLicenses() {
  try {
    const expiredLicenses = await prisma.license.updateMany({
      where: {
        AND: [
          { expiresAt: { lt: new Date() } },
          { status: 'ACTIVE' }
        ]
      },
      data: {
        status: 'EXPIRED'
      }
    });

    if (expiredLicenses.count > 0) {
      console.log(`⚠️  ${expiredLicenses.count} licences marquées comme expirées`);
    }
  } catch (error) {
    console.error('Erreur vérification licences expirées:', error);
  }
}

// Envoyer des notifications avant expiration
async function checkExpirationNotifications() {
  try {
    // Licences expirant dans 7 jours
    const warningDate = new Date();
    warningDate.setDate(warningDate.getDate() + 7);

    const soonToExpire = await prisma.license.findMany({
      where: {
        AND: [
          { status: 'ACTIVE' },
          { expiresAt: { lte: warningDate } },
          { expiresAt: { gt: new Date() } }
        ]
      },
      include: {
        client: true
      }
    });

    for (const license of soonToExpire) {
      try {
        await EmailService.sendExpirationWarning(license);
        console.log(`📧 Notification envoyée pour la licence ${license.key}`);
      } catch (error) {
        console.error(`Erreur envoi notification licence ${license.key}:`, error);
      }
    }

    if (soonToExpire.length > 0) {
      console.log(`📧 ${soonToExpire.length} notifications d'expiration envoyées`);
    }
  } catch (error) {
    console.error('Erreur notifications d\'expiration:', error);
  }
}
