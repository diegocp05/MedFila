import { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import { motion, AnimatePresence } from 'framer-motion';

interface Patient {
  id: string;
  name: string;
  colorCode: string;
}

export function TvPanel() {
  const [started, setStarted] = useState(false);
  const [currentPatient, setCurrentPatient] = useState<Patient | null>(null);
  const [history, setHistory] = useState<Patient[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!started) return;

    const socket = io('http://localhost:3334');

    socket.on('patient_called', (patient: Patient) => {
      console.log('🔴 EVENTO RECEBIDO NA TV:', patient);
      // Toca o som
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(e => console.error("Audio play failed", e));
      }

      setCurrentPatient(patient);
      
      setHistory(prev => {
        const newHistory = [patient, ...prev.filter(p => p.id !== patient.id)];
        return newHistory.slice(0, 5); // Mantém no máximo 5 no histórico
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [started]);

  if (!started) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-8 cursor-pointer" onClick={() => setStarted(true)}>
        <h1 className="text-4xl font-bold text-white mb-4">Painel da Sala de Espera</h1>
        <button className="bg-blue-600 text-white text-2xl font-bold px-12 py-6 rounded-2xl shadow-xl shadow-blue-500/20 hover:scale-105 transition-transform">
          CLIQUE PARA INICIAR A TV
        </button>
        <p className="text-zinc-500 mt-6 max-w-md text-center text-lg">
          Este passo é obrigatório pelos navegadores para permitir a reprodução automática do alerta sonoro ("Ding").
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-100 flex overflow-hidden font-sans">
      <audio ref={audioRef} src="/chime.ogg" preload="auto" />

      {/* Área Principal - Chamada Atual */}
      <div className="flex-1 flex flex-col items-center justify-center p-12 bg-white relative">
        <div className="absolute top-8 left-8">
          <h2 className="text-3xl font-black text-blue-600 tracking-tighter">MED<span className="text-zinc-800">FILA</span></h2>
        </div>

        <AnimatePresence mode="wait">
          {currentPatient ? (
            <motion.div
              key={currentPatient.id}
              initial={{ scale: 0.5, opacity: 0, y: 100 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: -50 }}
              transition={{ type: "spring", bounce: 0.5, duration: 0.8 }}
              className="text-center w-full"
            >
              <h3 className="text-4xl text-zinc-500 font-semibold mb-6 uppercase tracking-widest">Próximo Paciente</h3>
              <div className="bg-blue-50 border-4 border-blue-500 rounded-[3rem] p-16 shadow-2xl w-full max-w-4xl mx-auto overflow-hidden">
                <h1 className="text-7xl md:text-8xl font-black text-blue-700 tracking-tight leading-tight uppercase truncate">
                  {currentPatient.name}
                </h1>
              </div>
              <motion.div 
                animate={{ opacity: [1, 0, 1] }} 
                transition={{ duration: 1.5, repeat: Infinity }}
                className="mt-12 text-4xl font-black text-red-500 flex items-center justify-center gap-4 uppercase"
              >
                Dirija-se ao Consultório
              </motion.div>
            </motion.div>
          ) : (
            <motion.div 
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center"
            >
              <div className="w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-8">
                <div className="w-20 h-20 bg-blue-500 rounded-full animate-pulse" />
              </div>
              <h1 className="text-5xl font-bold text-zinc-400">Aguardando Chamadas...</h1>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Barra lateral de Histórico */}
      <div className="w-1/3 min-w-[400px] bg-zinc-900 text-white p-8 border-l border-zinc-800 shadow-2xl z-10 flex flex-col">
        <h2 className="text-3xl font-bold text-zinc-100 mb-8 pb-4 border-b border-zinc-700 uppercase tracking-widest">
          Últimas Chamadas
        </h2>
        
        <div className="flex-1 flex flex-col gap-4">
          <AnimatePresence>
            {history.slice(1).map((patient, idx) => (
              <motion.div
                key={patient.id + idx}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-zinc-800 rounded-2xl p-6 border-l-8 border-zinc-600 shadow-lg"
              >
                <h3 className="text-2xl font-bold text-zinc-200 uppercase truncate">{patient.name}</h3>
                <p className="text-zinc-500 mt-2 font-medium">Consultório Principal</p>
              </motion.div>
            ))}
          </AnimatePresence>
          {history.length <= 1 && (
             <div className="text-zinc-600 text-xl font-medium text-center mt-12">O histórico aparecerá aqui.</div>
          )}
        </div>
      </div>
    </div>
  );
}
