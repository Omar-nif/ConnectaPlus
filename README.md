# Connecta+ 🌐🎮

**Connecta+** es una plataforma web y sistema P2P que permite a los usuarios **compartir suscripciones digitales** (streaming, música, software) y **jugar videojuegos de forma remota** transmitiendo solo la ventana del juego, con **pagos protegidos, reputación y seguridad integrada**.

---

## Propósito

El proyecto tiene dos grandes módulos:

1. **Sitio web (React + Node/Express + MySQL)**  
   - Registro/Login con correo y Google (Firebase Auth)  
   - Creación y unión a grupos de suscripciones  
   - Pagos protegidos con **Stripe** (escrow y reembolsos)  
   - Reputación, reseñas y reportes entre usuarios  
   - Panel de cuenta (perfil, historial de pagos, configuración, eliminar cuenta)  
   - Landing page con secciones informativas y FAQ  

2. **Sistema P2P de videojuegos (Python + FastAPI + WebSocket)**  
   - Captura y streaming **solo de la ventana del juego**  
   - Control remoto filtrado (solo inputs del juego)  
   - Sesiones temporales que se cierran automáticamente  
   - Señalización con tokens temporales, validación de IP y cifrado  

---

## Tecnologías

### Frontend
- React + React Router + Bootstrap 5
- Firebase Authentication (email/Google)
- Axios / React Query para consumo de API
- Mock Service Worker (MSW) para desarrollo

### Backend (Core API)
- Node.js + Express
- MySQL (Prisma ORM)
- Stripe (pagos y webhooks)
- Socket.IO (chat y presencia)
- JWT + Helmet + CORS

### P2P (Sistema de Juegos)
- Python 3
- FastAPI + WebSocket para señalización
- Tkinter (UI ligera en host e invitado)
- OpenCV + MSS + FFmpeg para captura/streaming
- pynput / pywin32 para control de inputs
- psutil para monitoreo de sesión

---

## Instalación y uso

### Requisitos
- Node.js v18+
- Python 3.11+
- MySQL 8+
- Cuenta de Firebase (Auth)
- Cuenta de Stripe (test mode)

### Clonar repositorio
```bash
git clone https://github.com/<usuario>/connecta-plus.git
cd connecta-plus
