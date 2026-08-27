import { Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../prisma';

const createPatientSchema = z.object({
  name: z.string().min(2),
  age: z.number().int().min(0),
  symptoms: z.array(z.string()).min(1)
});

// Motor de Triagem Simplificado
function calculateRiskScore(symptoms: string[]): { score: number, color: any } {
  let score = 0;
  
  const highRisk = ['dor_no_peito', 'falta_de_ar', 'desmaio'];
  const mediumRisk = ['febre_alta', 'dor_intensa', 'sangramento'];
  const lowRisk = ['tosse', 'coriza', 'dor_leve'];

  symptoms.forEach(s => {
    if (highRisk.includes(s)) score += 50;
    else if (mediumRisk.includes(s)) score += 20;
    else if (lowRisk.includes(s)) score += 5;
  });

  if (score >= 50) return { score, color: 'RED' };
  if (score >= 20) return { score, color: 'YELLOW' };
  return { score, color: 'GREEN' };
}

export const createPatient = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = createPatientSchema.parse(req.body);
    
    const { score, color } = calculateRiskScore(data.symptoms);

    const patient = await prisma.patient.create({
      data: {
        name: data.name,
        age: data.age,
        symptoms: data.symptoms,
        riskScore: score,
        colorCode: color as any,
        status: 'WAITING'
      }
    });

    // Emite evento via WebSockets
    const io = (req as any).io;
    if (io) {
      io.emit('new_patient', patient);
      io.emit('queue_updated');
    }

    res.status(201).json(patient);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Erro ao criar paciente' });
  }
};

export const getQueue = async (req: Request, res: Response): Promise<void> => {
  try {
    const patients = await prisma.patient.findMany({
      where: {
        status: { in: ['WAITING', 'IN_CONSULTATION'] }
      },
      orderBy: [
        { riskScore: 'desc' },
        { createdAt: 'asc' } // Desempate por ordem de chegada
      ]
    });
    res.json(patients);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar fila' });
  }
};

export const updateStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body; 

    const patient = await prisma.patient.update({
      where: { id },
      data: { status }
    });

    // Emite evento para os clientes recarregarem a fila
    const io = (req as any).io;
    if (io) {
      io.emit('queue_updated');
      if (status === 'IN_CONSULTATION') {
        console.log(`🔊 Emitindo patient_called para o paciente: ${patient.name}`);
        io.emit('patient_called', patient);
      }
    }

    res.json(patient);
  } catch (error) {
    res.status(400).json({ error: 'Erro ao atualizar status' });
  }
};
