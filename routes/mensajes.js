// routes/mensajes.js
import { 
  crearMensajeHandler, 
  obtenerMensajesHandler, 
  obtenerUltimoMensajeHandler, 
  marcarChatComoLeido, 
  obtenerAmigosConEstado 
} from "../controllers/mensajesController.js";

// Aquí no necesitamos rutas, simplemente exportamos las funciones del controlador
export { 
  crearMensajeHandler, 
  obtenerMensajesHandler, 
  obtenerUltimoMensajeHandler, 
  marcarChatComoLeido, 
  obtenerAmigosConEstado 
};
