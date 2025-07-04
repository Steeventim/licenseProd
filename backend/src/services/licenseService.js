import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { prisma } from '../server.js';
import { config } from '../config/index.js';

export class LicenseService {
  
  // Générer une clé de licence unique
  static generateLicenseKey() {
    const prefix = 'LIC';
    const timestamp = Date.now().toString(36);
    const random = crypto.randomBytes(16).toString('hex');
    return `${prefix}-${timestamp}-${random}`.toUpperCase();
  }

  // Créer une nouvelle licence
  static async createLicense(data) {
    const licenseKey = this.generateLicenseKey();
    
    // Créer le JWT pour mode offline
    const jwtPayload = {
      licenseKey,
      clientId: data.clientId,
      features: data.features,
      expiresAt: data.expiresAt,
      domain: data.domain,
      iat: Math.floor(Date.now() / 1000)
    };
    
    const tokenJWT = data.expiresAt 
      ? jwt.sign(jwtPayload, config.JWT_SECRET, { expiresIn: '365d' }) 
      : jwt.sign(jwtPayload, config.JWT_SECRET, { expiresIn: '365d' });
    
    const license = await prisma.license.create({
      data: {
        key: licenseKey,
        clientId: data.clientId,
        features: data.features,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
        tokenJWT,
        status: 'ACTIVE'
      },
      include: {
        client: true
      }
    });
    
    return license;
  }

  // Valider une licence
  static async validateLicense(licenseKey, domain = null, clientIP = null, userAgent = null) {
    try {
      const license = await prisma.license.findUnique({
        where: { key: licenseKey },
        include: { client: true }
      });
      
      if (!license) {
        return { valid: false, reason: 'LICENCE_NOT_FOUND' };
      }
      
      // Vérifier le statut
      if (license.status !== 'ACTIVE') {
        return { valid: false, reason: `LICENCE_${license.status}`, license };
      }
      
      // Vérifier l'expiration
      if (license.expiresAt && new Date() > license.expiresAt) {
        // Marquer comme expirée
        await prisma.license.update({
          where: { id: license.id },
          data: { status: 'EXPIRED' }
        });
        return { valid: false, reason: 'LICENCE_EXPIRED', license };
      }
      
      // Vérifier le domaine si spécifié
      if (license.client.domain && domain) {
        if (license.client.domain !== domain) {
          return { valid: false, reason: 'DOMAIN_MISMATCH', license };
        }
      }
      
      return { valid: true, license };
      
    } catch (error) {
      console.error('Erreur validation licence:', error);
      return { valid: false, reason: 'VALIDATION_ERROR' };
    }
  }

  // Révoquer une licence
  static async revokeLicense(licenseKey) {
    try {
      const license = await prisma.license.updateMany({
        where: { key: licenseKey },
        data: { status: 'REVOKED' }
      });
      
      return license.count > 0;
    } catch (error) {
      console.error('Erreur révocation licence:', error);
      return false;
    }
  }

  // Suspendre une licence
  static async suspendLicense(licenseKey) {
    try {
      const license = await prisma.license.updateMany({
        where: { key: licenseKey },
        data: { status: 'SUSPENDED' }
      });
      
      return license.count > 0;
    } catch (error) {
      console.error('Erreur suspension licence:', error);
      return false;
    }
  }

  // Réactiver une licence
  static async reactivateLicense(licenseKey) {
    try {
      const license = await prisma.license.updateMany({
        where: { 
          key: licenseKey,
          status: { in: ['SUSPENDED', 'EXPIRED'] }
        },
        data: { status: 'ACTIVE' }
      });
      
      return license.count > 0;
    } catch (error) {
      console.error('Erreur réactivation licence:', error);
      return false;
    }
  }

  // Vérifier JWT offline
  static verifyOfflineToken(token) {
    try {
      const decoded = jwt.verify(token, config.JWT_SECRET);
      
      // Vérifier l'expiration manuelle si nécessaire
      if (typeof decoded === 'object' && decoded.expiresAt && new Date() > new Date(decoded.expiresAt)) {
        return { valid: false, reason: 'TOKEN_EXPIRED' };
      }
      
      return { valid: true, payload: decoded };
    } catch (error) {
      return { valid: false, reason: 'TOKEN_INVALID' };
    }
  }

  // Obtenir les statistiques d'usage
  static async getUsageStats(licenseId, days = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const logs = await prisma.usageLog.findMany({
      where: {
        licenseId,
        timestamp: { gte: startDate }
      },
      orderBy: { timestamp: 'desc' }
    });
    
    const stats = {
      totalRequests: logs.length,
      successfulRequests: logs.filter(log => log.status === 'SUCCESS').length,
      failedRequests: logs.filter(log => log.status !== 'SUCCESS').length,
      uniqueIPs: [...new Set(logs.map(log => log.ipAddress))].length,
      lastActivity: logs[0]?.timestamp || null,
      dailyUsage: {}
    };
    
    // Calculer l'usage quotidien
    logs.forEach(log => {
      const date = log.timestamp.toISOString().split('T')[0];
      stats.dailyUsage[date] = (stats.dailyUsage[date] || 0) + 1;
    });
    
    return stats;
  }
}
