import { prisma } from '../server.js';

export class LoggingService {
  
  // Enregistrer un log d'utilisation
  static async logUsage(licenseId, ipAddress, status, userAgent = null) {
    try {
      if (!licenseId) {
        console.warn('Log ignoré: licenseId manquant');
        return null;
      }
      
      const log = await prisma.usageLog.create({
        data: {
          licenseId,
          ipAddress,
          status,
          userAgent,
          timestamp: new Date()
        }
      });
      
      return log;
    } catch (error) {
      console.error('Erreur création log:', error);
      return null;
    }
  }

  // Nettoyer les anciens logs (plus de X jours)
  static async cleanOldLogs(daysToKeep = 90) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
      
      const result = await prisma.usageLog.deleteMany({
        where: {
          timestamp: { lt: cutoffDate }
        }
      });
      
      console.log(`🧹 ${result.count} anciens logs supprimés`);
      return result.count;
    } catch (error) {
      console.error('Erreur nettoyage logs:', error);
      return 0;
    }
  }

  // Obtenir les logs d'une licence
  static async getLicenseLogs(licenseId, limit = 100) {
    try {
      const logs = await prisma.usageLog.findMany({
        where: { licenseId },
        orderBy: { timestamp: 'desc' },
        take: limit
      });
      
      return logs;
    } catch (error) {
      console.error('Erreur récupération logs:', error);
      return [];
    }
  }

  // Obtenir les statistiques globales
  static async getGlobalStats(days = 30) {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      
      const [totalLogs, activeLicenses, totalClients] = await Promise.all([
        prisma.usageLog.count({
          where: { timestamp: { gte: startDate } }
        }),
        prisma.license.count({
          where: { status: 'ACTIVE' }
        }),
        prisma.client.count()
      ]);
      
      const topLicenses = await prisma.usageLog.groupBy({
        by: ['licenseId'],
        where: { timestamp: { gte: startDate } },
        _count: { licenseId: true },
        orderBy: { _count: { licenseId: 'desc' } },
        take: 10
      });
      
      return {
        totalLogs,
        activeLicenses,
        totalClients,
        topLicenses,
        period: `${days} derniers jours`
      };
    } catch (error) {
      console.error('Erreur statistiques globales:', error);
      return null;
    }
  }
}
