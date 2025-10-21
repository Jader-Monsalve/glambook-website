// Datos por defecto para inicializar el sistema en producción
export const defaultTestimoniosPendientes = [
  {
    "id": 1001,
    "nombre": "Laura Martínez",
    "email": "laura@email.com", 
    "calificacion": 5,
    "comentario": "Excelente trabajo con mis uñas, muy profesional y el resultado fue perfecto.",
    "servicio": "unas",
    "fechaEnvio": "2024-10-20T10:30:00.000Z",
    "estado": "pendiente"
  },
  {
    "id": 1002,
    "nombre": "Carmen Pérez", 
    "email": "carmen@email.com",
    "calificacion": 4,
    "comentario": "Me encantó el maquillaje para mi evento, muy natural y duradero.",
    "servicio": "maquillaje",
    "fechaEnvio": "2024-10-20T11:15:00.000Z",
    "estado": "pendiente"
  },
  {
    "id": 1003,
    "nombre": "Sofia Ruiz",
    "email": "sofia@email.com",
    "calificacion": 5, 
    "comentario": "Las extensiones de pestañas quedaron increíbles, muy recomendado.",
    "servicio": "pestanas",
    "fechaEnvio": "2024-10-20T12:00:00.000Z",
    "estado": "pendiente"
  }
];

export const defaultCitas = [
  {
    "id": "cita_20241020_001",
    "nombre": "Ana García",
    "email": "ana.garcia@email.com",
    "telefono": "+57 300 123 4567",
    "servicio": "Manicure completo",
    "fecha": "2024-10-25",
    "hora": "10:00",
    "mensaje": "Me gustaría una manicure francesa clásica",
    "fechaCreacion": "2024-10-20T14:30:00.000Z",
    "estado": "confirmada"
  },
  {
    "id": "cita_20241020_002", 
    "nombre": "María López",
    "email": "maria.lopez@email.com",
    "telefono": "+57 300 987 6543",
    "servicio": "Maquillaje para evento",
    "fecha": "2024-10-26",
    "hora": "15:00", 
    "mensaje": "Necesito maquillaje para una boda en la tarde",
    "fechaCreacion": "2024-10-20T16:45:00.000Z",
    "estado": "pendiente"
  },
  {
    "id": "cita_20241020_003",
    "nombre": "Isabella Rodríguez", 
    "email": "isabella.rodriguez@email.com",
    "telefono": "+57 300 555 0123",
    "servicio": "Extensiones de pestañas",
    "fecha": "2024-10-28",
    "hora": "11:30",
    "mensaje": "Primera vez con extensiones, busco algo natural",
    "fechaCreacion": "2024-10-20T18:20:00.000Z", 
    "estado": "confirmada"
  }
];

export const defaultHorarios = {
  "lunes": {
    "disponible": true,
    "horarios": ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"]
  },
  "martes": {
    "disponible": true, 
    "horarios": ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"]
  },
  "miercoles": {
    "disponible": true,
    "horarios": ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"]
  },
  "jueves": {
    "disponible": true,
    "horarios": ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"]
  },
  "viernes": {
    "disponible": true,
    "horarios": ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"]
  },
  "sabado": {
    "disponible": true,
    "horarios": ["09:00", "10:00", "11:00", "13:00", "14:00"]
  },
  "domingo": {
    "disponible": false,
    "horarios": []
  }
};