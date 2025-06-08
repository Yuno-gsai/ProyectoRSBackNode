import express from "express";
import cors from "cors";
import logger from "morgan";
import { Server } from "socket.io";
import { createServer } from "http";
import dotenv from "dotenv";

dotenv.config();

const port = process.env.PORT || 5000;
const app = express();

// ─── 0) MIDDLEWARES GENERALES (incluyendo CORS) ────────────────────────
app.use(
  cors({
    origin: [
      "https://calm-sky-07d7c2f1e.6.azurestaticapps.net", // Para el frontend en Azure
      "http://localhost:5173",  // Para el entorno de desarrollo local
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Morgan para logs y parseo de JSON
app.use(logger("dev"));
app.use(express.json());

// ─── 1) Ruta dinámica para manejar las solicitudes según el controlador y método ───
app.post("/", (req, res) => {
  const { controller, method } = req.body;

  // Lista blanca de controladores permitidos
  if (!controller || !method) {
    return res.status(400).json({ error: "Controlador o método no especificado en el cuerpo" });
  }

  // Si pasa las validaciones, importar y ejecutar el controlador y método
  import(`./controllers/${controller}Controller.js`)
    .then((controllerModule) => {
      const controllerFunc = controllerModule[method];

      if (controllerFunc) {
        controllerFunc(req, res);
      } else {
        res.status(404).json({ error: "Método no encontrado" });
      }
    })
    .catch((error) => {
      console.error("Error al cargar el controlador:", error);
      res.status(404).json({ error: "Controlador no encontrado" });
    });
});

// ─── 2) Configurar Socket.IO ───────────────────────────────────────────
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      "https://calm-sky-07d7c2f1e.6.azurestaticapps.net", // Para el frontend en Azure
      "http://localhost:5173", // Para el entorno local
    ],
    methods: ["GET", "POST"],
  },
});

// Exponer la instancia de io si la necesitas en controladores
app.set("io", io);

io.on("connection", (socket) => {
  console.log("Usuario conectado (socket):", socket.id);

  socket.on("message", (data) => {
    io.emit("message", data);
  });

  socket.on("disconnect", () => {
    console.log("Usuario desconectado (socket):", socket.id);
  });
});

// ─── 3) Iniciar el servidor ─────────────────────────────────────────────
server.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});

// Acción	Método	URL	Body JSON (si aplica)
// Crear mensaje	POST	http://localhost:5000/api/mensajes	{ "remitente_id":1, "destinatario_id":2, "mensaje":"Hola!" }
// Obtener mensajes	GET	http://localhost:5000/api/mensajes?remitente_id=1&destinatario_id=2	N/A
// Actualizar	PUT	http://localhost:5000/api/mensajes/3	{ "mensaje":"Mensaje actualizado" }
// Eliminar	DELETE	http://localhost:5000/api/mensajes/3	N/A