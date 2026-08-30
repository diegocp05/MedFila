import 'dotenv/config';
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import patientRoutes from './routes/patient.routes';
import authRoutes from './routes/auth.routes';

const app = express();
const httpServer = createServer(app);

// Configuração do Socket.io com CORS liberado
export const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

app.use(cors());
app.use(express.json());

// Middlewares
app.use((req, res, next) => {
  (req as any).io = io;
  next();
});

import consultationRoutes from './routes/consultation.routes';
import adminRoutes from './routes/admin.routes';

// Rotas
app.use('/api/patients', patientRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/consultations', consultationRoutes);
app.use('/api/admin', adminRoutes);

// Socket.io Eventos
io.on('connection', (socket) => {
  console.log(`🔌 Novo cliente conectado: ${socket.id}`);

  socket.on('disconnect', () => {
    console.log(`🔌 Cliente desconectado: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 3333;

httpServer.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
