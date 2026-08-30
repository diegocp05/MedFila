import { Request, Response } from 'express';
import prisma from '../prisma';

export const getDashboardStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const totalPatientsToday = await prisma.patient.count({
      where: {
        createdAt: { gte: today }
      }
    });

    const pendingPatients = await prisma.patient.count({
      where: {
        status: 'WAITING'
      }
    });

    const activeDoctors = await prisma.user.count({
      where: {
        role: { in: ['DOCTOR', 'ADMIN'] } // simplificação
      }
    });

    const consultationsToday = await prisma.consultation.count({
      where: {
        createdAt: { gte: today }
      }
    });

    res.json({
      totalPatientsToday,
      pendingPatients,
      activeDoctors,
      consultationsToday
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar estatísticas' });
  }
};
