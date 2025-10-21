// Datos embebidos para testimonios
const testimoniosData = [
  {
    id: 1,
    nombre: "María González",
    servicio: "Maquillaje de novia",
    testimonio: "¡Claudia es increíble! Me hizo sentir como una princesa en mi día especial.",
    calificacion: 5,
    fecha: "2024-11-15",
    aprobado: true
  },
  {
    id: 2,
    nombre: "Ana Rodríguez", 
    servicio: "Maquillaje de fiesta",
    testimonio: "Excelente trabajo, muy profesional y puntual. 100% recomendada.",
    calificacion: 5,
    fecha: "2024-11-10",
    aprobado: true
  },
  {
    id: 3,
    nombre: "Laura Martínez",
    servicio: "Maquillaje social",
    testimonio: "Me encantó el resultado, Claudia tiene unas manos mágicas para el maquillaje.",
    calificacion: 5,
    fecha: "2024-11-05",
    aprobado: true
  }
];

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
      // Obtener testimonios aprobados
      const testimoniosAprobados = testimoniosData.filter(t => t.aprobado);
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          testimonios: testimoniosAprobados
        })
      };
    }
    
    if (event.httpMethod === 'POST') {
      const body = JSON.parse(event.body || '{}');
      
      // Validar datos requeridos
      if (!body.nombre || !body.servicio || !body.testimonio || !body.calificacion) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({
            success: false,
            error: 'Faltan campos requeridos'
          })
        };
      }
      
      // Crear nuevo testimonio
      const nuevoTestimonio = {
        id: testimoniosData.length + 1,
        nombre: body.nombre,
        servicio: body.servicio,
        testimonio: body.testimonio,
        calificacion: parseInt(body.calificacion),
        fecha: new Date().toISOString().split('T')[0],
        aprobado: false // Requiere aprobación
      };
      
      // En un caso real, aquí guardarías en base de datos
      testimoniosData.push(nuevoTestimonio);
      
      return {
        statusCode: 201,
        headers,
        body: JSON.stringify({
          success: true,
          message: 'Testimonio enviado correctamente, pendiente de aprobación',
          testimonio: nuevoTestimonio
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
    console.error('Error in testimonios function:', error);
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