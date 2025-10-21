// Datos embebidos para citas
const horarios = {
  "2024-12-15": ["09:00", "11:00", "14:00", "16:00"],
  "2024-12-16": ["10:00", "12:00", "15:00", "17:00"],
  "2024-12-17": ["09:00", "11:00", "14:00", "16:00"],
  "2024-12-18": ["10:00", "12:00", "15:00", "17:00"],
  "2024-12-19": ["09:00", "11:00", "14:00", "16:00"],
  "2024-12-20": ["10:00", "12:00", "15:00", "17:00"],
  "2024-12-21": ["09:00", "11:00", "14:00", "16:00"]
};

const citasReservadas = [];

exports.handler = async (event, context) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  };

  // Manejar preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    if (event.httpMethod === 'GET') {
      const { fecha } = event.queryStringParameters || {};
      
      if (fecha) {
        // Obtener horarios disponibles para una fecha específica
        const horariosDisponibles = horarios[fecha] || [];
        const horariosOcupados = citasReservadas
          .filter(cita => cita.fecha === fecha)
          .map(cita => cita.hora);
        
        const disponibles = horariosDisponibles.filter(
          hora => !horariosOcupados.includes(hora)
        );
        
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: true,
            fecha,
            horariosDisponibles: disponibles
          })
        };
      } else {
        // Obtener todas las fechas disponibles
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: true,
            fechasDisponibles: Object.keys(horarios)
          })
        };
      }
    }
    
    if (event.httpMethod === 'POST') {
      const body = JSON.parse(event.body || '{}');
      
      // Validar datos requeridos
      if (!body.nombre || !body.telefono || !body.servicio || !body.fecha || !body.hora) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({
            success: false,
            error: 'Faltan campos requeridos'
          })
        };
      }
      
      // Verificar disponibilidad
      const citaExistente = citasReservadas.find(
        cita => cita.fecha === body.fecha && cita.hora === body.hora
      );
      
      if (citaExistente) {
        return {
          statusCode: 409,
          headers,
          body: JSON.stringify({
            success: false,
            error: 'El horario ya está ocupado'
          })
        };
      }
      
      // Crear nueva cita
      const nuevaCita = {
        id: citasReservadas.length + 1,
        nombre: body.nombre,
        telefono: body.telefono,
        servicio: body.servicio,
        fecha: body.fecha,
        hora: body.hora,
        fechaCreacion: new Date().toISOString()
      };
      
      citasReservadas.push(nuevaCita);
      
      return {
        statusCode: 201,
        headers,
        body: JSON.stringify({
          success: true,
          message: 'Cita agendada correctamente',
          cita: nuevaCita
        })
      };
    }
    
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({
        success: false,
        error: 'Método no permitido'
      })
    };
    
  } catch (error) {
    console.error('Error in citas function:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: 'Error interno del servidor'
      })
    };
  }
};