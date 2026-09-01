import { Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../prisma';

const createConsultationSchema = z.object({
  patientId: z.string().uuid(),
  notes: z.string().min(1),
  diagnosis: z.string().optional(),
  prescription: z.string().optional(),
  action: z.enum(['DISMISSED', 'COMPLETED']) // O que fazer com o paciente após salvar
});

export const createConsultation = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = createConsultationSchema.parse(req.body);
    // userId vem do middleware de auth (que precisamos garantir que está injetando)
    const doctorId = (req as any).user.id;

    const consultation = await prisma.$transaction(async (tx) => {
      // Cria o prontuário
      const consult = await tx.consultation.create({
        data: {
          patientId: data.patientId,
          doctorId: doctorId,
          notes: data.notes,
          diagnosis: data.diagnosis,
          prescription: data.prescription,
        }
      });

      // Atualiza o status do paciente
      await tx.patient.update({
        where: { id: data.patientId },
        data: { status: data.action }
      });

      return consult;
    });

    // Emite evento via WebSockets para recarregar a fila
    const io = (req as any).io;
    if (io) {
      io.emit('queue_updated');
    }

    res.status(201).json(consultation);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Erro ao salvar consulta' });
  }
};

export const getHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { search } = req.query;
    
    let whereClause = {};
    if (search && typeof search === 'string') {
      whereClause = {
        name: { contains: search, mode: 'insensitive' }
      };
    }

    const patients = await prisma.patient.findMany({
      where: whereClause,
      include: {
        consultations: {
          include: {
            doctor: {
              select: { name: true, role: true }
            }
          },
          orderBy: { createdAt: 'desc' }
        }
      },
      orderBy: { updatedAt: 'desc' },
      take: 50
    });

    res.json(patients);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar histórico' });
  }
};
