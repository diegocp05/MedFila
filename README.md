<h1 align="center"> MediBridge - Gestão Hospitalar & Triagem Inteligente </h1>

<p align="center">
<img src="https://img.shields.io/github/issues/diegocp05/MedFila"/>
<img src="https://img.shields.io/github/forks/diegocp05/MedFila"/>
<img src="https://img.shields.io/github/stars/diegocp05/MedFila"/>
<img src="https://img.shields.io/github/license/diegocp05/MedFila"/>
</p>

<p align="center">Um sistema completo de <strong>Gestão de Triagem e Prontuários Médicos</strong>. O MediBridge moderniza a jornada do paciente através de tótens de check-in, painéis em tempo real com alertas sonoros e uma interface médica avançada para preenchimento de anamnese e condutas.</p>

<h1 align="center">
  <img height="400" alt="Banner MediBridge" title="MediBridge" src="https://cdn.dribbble.com/userupload/8636952/file/original-b2c6b38c2f1f0a17409eaaf8a3c8e404.gif"/>
</h1>

## 🌟 Funcionalidades

### 🖥️ Totem e Recepção Automática
- **Autoatendimento**: Telas interativas para o paciente realizar o check-in rápido informando nome, idade e sintomas.
- **Painel de TV (Real-time)**: Tela de espera conectada via WebSockets que atualiza instantaneamente e emite avisos sonoros ao chamar pacientes.

### 🩺 Dashboard Médico & Triagem
- **Gestão de Filas**: Acompanhamento em tempo real da ordem de chegada e grau de risco.
- **Sala de Consulta Privada**: Interface dedicada ao médico para evoluções clínicas, registro de hipóteses diagnósticas e prescrições.
- **Histórico de Prontuários**: Busca detalhada do histórico de consultas passadas de qualquer paciente.

### 📊 Painel Administrativo
- **Visão Geral**: Métricas operacionais como "Entradas Hoje", "Pacientes na Fila" e "Consultas Realizadas".
- **Controle de Acessos**: Diferenciação de permissões e rotas protegidas (Médicos vs. Administradores).
- **Design Premium**: Desenvolvido com Shadcn UI e Tailwind CSS, entregando a estética *Clean Medical*.

---

## 📋 Rotas da API (Destaques)

### 🏥 Gestão de Triagem

**Listar Pacientes na Fila**  
`GET /api/patients/queue`

**Formato de Resposta:**
```json
[
  {
    "id": "e8a1c93b...",
    "name": "Maria Silva",
    "age": 45,
    "symptoms": ["Febre", "Dor no corpo"],
    "status": "WAITING",
    "createdAt": "2026-08-31T14:30:00Z"
  }
]
```

---

### 📝 Prontuários

**Salvar Nova Consulta**  
`POST /api/consultations`

**Exemplo de Corpo da Requisição:**
```json
{
  "patientId": "e8a1c93b...",
  "notes": "Paciente apresenta quadro febril há 3 dias. Relata mialgia.",
  "diagnosis": "Suspeita de Dengue",
  "prescription": "Dipirona 500mg - 1 comp de 6/6h. Hidratação abundante.",
  "action": "COMPLETED"
}
```

---

## 🌟 Exemplos de Uso Completos

### Escutando Alertas na TV da Sala de Espera (WebSocket)
```javascript
import { io } from 'socket.io-client';

const socket = io('http://localhost:3334');

// Ouve o evento emitido quando o médico chama o paciente
socket.on('patient_called', (patientName) => {
  console.log(`ATENÇÃO: O paciente ${patientName} deve comparecer ao consultório!`);
  tocarAlertaSonoro();
  mostrarNaTela(patientName);
});

// Ouve novas entradas no Totem
socket.on('queue_updated', () => {
  atualizarListaDeEspera();
});
```

---

## 🔧 Tecnologias Utilizadas

- **Frontend:** React.js + Vite + TypeScript  
- **Estilização e UI:** Tailwind CSS + Radix UI + Shadcn UI + Lucide Icons  
- **Backend:** Node.js + Express + Zod  
- **Banco de Dados:** PostgreSQL + Prisma ORM  
- **Tempo Real:** Socket.io (WebSockets)  
- **Autenticação:** JWT (JSON Web Tokens) & Bcrypt  

---

## 📚 Como Executar Localmente

**Clone o repositório**
```bash
git clone https://github.com/diegocp05/MedFila.git
cd MedFila
```

**Suba o Banco de Dados (Docker)**
```bash
# Caso possua o docker-compose na raiz do projeto
docker-compose up -d
```

**Configure e Inicie o Backend**
```bash
cd backend
npm install
# Configure as variáveis de ambiente (.env) baseando-se no .env.example
npx prisma db push
npm run dev
```

**Configure e Inicie o Frontend**
```bash
cd ../frontend
npm install
npm run dev
```

A aplicação estará disponível em **http://localhost:5173** (Totem, Admin, Dashboards) e a API em **http://localhost:3334**.

---

## 🚀 Autor
 
<sub>@diegocp05</sub>

<p align="center">
  Feito com ❤️ por <a href="https://github.com/diegocp05">Diego Costa</a>
</p>
