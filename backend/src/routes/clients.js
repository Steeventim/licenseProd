import { z } from 'zod';
import { prisma } from '../server.js';

const createClientSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  domain: z.string().optional(),
});

export async function clientRoutes(fastify, options) {
  
  // POST /clients - Créer un nouveau client
  fastify.post('/', async (request, reply) => {
    try {
      const data = createClientSchema.parse(request.body);
      
      // Vérifier si l'email existe déjà
      const existingClient = await prisma.client.findUnique({
        where: { email: data.email }
      });
      
      if (existingClient) {
        return reply.code(409).send({ error: 'Un client avec cet email existe déjà' });
      }
      
      const client = await prisma.client.create({
        data
      });
      
      return reply.code(201).send({
        success: true,
        client: {
          id: client.id,
          name: client.name,
          email: client.email,
          domain: client.domain,
          createdAt: client.createdAt
        }
      });
      
    } catch (error) {
      console.error('Erreur création client:', error);
      return reply.code(400).send({ 
        error: 'Données invalides',
        details: error.message
      });
    }
  });

  // GET /clients - Liste tous les clients
  fastify.get('/', async (request, reply) => {
    try {
      const { page = 1, limit = 10 } = request.query;
      
      const clients = await prisma.client.findMany({
        include: {
          licenses: {
            select: {
              id: true,
              status: true,
              features: true,
              expiresAt: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: parseInt(limit)
      });
      
      const total = await prisma.client.count();
      
      return reply.send({
        clients: clients.map(client => ({
          id: client.id,
          name: client.name,
          email: client.email,
          domain: client.domain,
          createdAt: client.createdAt,
          licensesCount: client.licenses.length,
          licenses: client.licenses
        })),
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      });
      
    } catch (error) {
      console.error('Erreur liste clients:', error);
      return reply.code(500).send({ error: 'Erreur serveur' });
    }
  });

  // GET /clients/:id - Détails d'un client
  fastify.get('/:id', async (request, reply) => {
    try {
      const { id } = request.params;
      
      const client = await prisma.client.findUnique({
        where: { id },
        include: {
          licenses: {
            include: {
              usageLogs: {
                orderBy: { timestamp: 'desc' },
                take: 10
              }
            }
          }
        }
      });
      
      if (!client) {
        return reply.code(404).send({ error: 'Client non trouvé' });
      }
      
      return reply.send({ client });
      
    } catch (error) {
      console.error('Erreur récupération client:', error);
      return reply.code(500).send({ error: 'Erreur serveur' });
    }
  });

  // PUT /clients/:id - Modifier un client
  fastify.put('/:id', async (request, reply) => {
    try {
      const { id } = request.params;
      const data = createClientSchema.partial().parse(request.body);
      
      const client = await prisma.client.update({
        where: { id },
        data
      });
      
      return reply.send({
        success: true,
        client: {
          id: client.id,
          name: client.name,
          email: client.email,
          domain: client.domain,
          updatedAt: client.updatedAt
        }
      });
      
    } catch (error) {
      if (error.code === 'P2025') {
        return reply.code(404).send({ error: 'Client non trouvé' });
      }
      console.error('Erreur modification client:', error);
      return reply.code(500).send({ error: 'Erreur serveur' });
    }
  });

  // DELETE /clients/:id - Supprimer un client
  fastify.delete('/:id', async (request, reply) => {
    try {
      const { id } = request.params;
      
      await prisma.client.delete({
        where: { id }
      });
      
      return reply.send({
        success: true,
        message: 'Client supprimé avec succès'
      });
      
    } catch (error) {
      if (error.code === 'P2025') {
        return reply.code(404).send({ error: 'Client non trouvé' });
      }
      console.error('Erreur suppression client:', error);
      return reply.code(500).send({ error: 'Erreur serveur' });
    }
  });
}
