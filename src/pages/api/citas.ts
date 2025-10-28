import type { APIRoute } from 'astro';
import { enviarRecordatorioCita, type CitaEmail } from '../../utils/emailService.ts';

// Configurar como server-rendered para que funcionen las APIs
export const prerender = false;

// Datos embebidos directamente en la API
const citasData = [
  {
    id: 1,
    nombre: "María González",
    email: "maria@email.com",
    telefono: "+57 300 123 4567",
    servicio: "Maquillaje",
    fecha: "2025-10-25",
    hora: "10:00",
    mensaje: "Para evento especial, necesito maquillaje elegante",
    estado: "confirmada",
    fechaCreacion: "2025-10-18",
    recordatorioEnviado: false,
    fechaRecordatorio: ""
  },
  {
    id: 2,
    nombre: "Ana López", 
    email: "ana@email.com",
    telefono: "+57 300 987 6543",
    servicio: "Uñas acrílicas",
    fecha: "2025-10-26",
    hora: "14:00",
    mensaje: "Primera vez, quiero diseño francés",
    estado: "pendiente",
    fechaCreacion: "2025-10-18",
    recordatorioEnviado: false,
    fechaRecordatorio: ""
  },
  {
    id: 3,
    nombre: "Carmen Silva",
    email: "carmen@email.com",
    telefono: "+57 301 555 7890",
    servicio: "Cejas",
    fecha: "2025-10-27",
    hora: "09:00",
    mensaje: "Microblading, tengo cita previa consultada",
    estado: "confirmada",
    fechaCreacion: "2025-10-19",
    recordatorioEnviado: false,
    fechaRecordatorio: ""
  },
  {
    id: 4,
    nombre: "Laura Martín",
    email: "laura@email.com",
    telefono: "+57 312 444 5678",
    servicio: "Pestañas",
    fecha: "2025-10-28",
    hora: "15:00",
    mensaje: "Extensiones de pestañas volumen ruso",
    estado: "pendiente",
    fechaCreacion: "2025-10-20",
    recordatorioEnviado: false,
    fechaRecordatorio: ""
  },
  {
    id: 5,
    nombre: "Sofia Rodríguez",
    email: "sofia@email.com",
    telefono: "+57 320 777 9012",
    servicio: "Maquillaje",
    fecha: "2025-10-29",
    hora: "16:00",
    mensaje: "Maquillaje para graduación",
    estado: "completada",
    fechaCreacion: "2025-10-17",
    recordatorioEnviado: true,
    fechaRecordatorio: "2025-10-28T08:00:00.000Z"
  },
  {
    id: 6,
    nombre: "Isabella Torres",
    email: "isabella@email.com",
    telefono: "+57 315 888 3456",
    servicio: "Uñas gel",
    fecha: "2025-10-30",
    hora: "11:00",
    mensaje: "Diseño con flores, tengo referencia",
    estado: "cancelada",
    fechaCreacion: "2025-10-19",
    recordatorioEnviado: false,
    fechaRecordatorio: ""
  }
];

const horariosDisponibles: Record<string, string[]> = {
  "lunes": ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"],
  "martes": ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"],
  "miercoles": ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"],
  "jueves": ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"],
  "viernes": ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"],
  "sabado": ["09:00", "10:00", "11:00", "14:00", "15:00"],
  "domingo": []
};

// Headers CORS para todas las respuestas
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json'
};

export const OPTIONS: APIRoute = async () => {
  return new Response(null, {
    status: 200,
    headers: corsHeaders
  });
};

export const GET: APIRoute = async ({ url }) => {
  try {
    const searchParams = new URL(url).searchParams;
    const action = searchParams.get('action');
    const fecha = searchParams.get('fecha');

    console.log(`📥 GET /api/citas - Action: ${action}, Fecha: ${fecha}`);

    switch (action) {
      case 'horarios-disponibles':
        if (!fecha) {
          return new Response(JSON.stringify({
            success: false,
            message: 'Fecha requerida para consultar horarios'
          }), {
            status: 400,
            headers: corsHeaders
          });
        }

        const fechaObj = new Date(fecha);

        // Verificar disponibilidad del día
        try {
          const disponibilidadResponse = await fetch(`${process.env.NODE_ENV === 'production' ? 'https://glambook-admin.up.railway.app' : 'http://localhost:4321'}/api/disponibilidad?action=verificar-disponibilidad&fecha=${fecha}`);
          
          if (disponibilidadResponse.ok) {
            const disponibilidadResult = await disponibilidadResponse.json();
            
            if (disponibilidadResult.success && !disponibilidadResult.data.disponible) {
              return new Response(JSON.stringify({
                success: true,
                data: {
                  fecha,
                  dia: fechaObj.toLocaleDateString('es-ES', { weekday: 'long' }),
                  horariosDisponibles: [],
                  horariosOcupados: [],
                  motivo: disponibilidadResult.data.motivo,
                  bloqueado: true
                },
                message: `Día no disponible: ${disponibilidadResult.data.motivo}`
              }), {
                status: 200,
                headers: corsHeaders
              });
            }
          }
        } catch (error) {
          console.warn('⚠️ No se pudo verificar disponibilidad:', error);
          // Continuar con la lógica normal si el servicio no está disponible
        }
        const diaSemana = fechaObj.toLocaleDateString('es-ES', { weekday: 'long' });
        const diaKey = diaSemana.toLowerCase();
        
        // Obtener horarios del día
        let horariosDelDia = horariosDisponibles[diaKey] || [];
        
        // Verificar bloqueos de horarios específicos
        try {
          const disponibilidadResponse = await fetch(`${process.env.NODE_ENV === 'production' ? 'https://glambook-admin.up.railway.app' : 'http://localhost:4321'}/api/disponibilidad?action=verificar-disponibilidad&fecha=${fecha}`);
          
          if (disponibilidadResponse.ok) {
            const disponibilidadResult = await disponibilidadResponse.json();
            
            if (disponibilidadResult.success && disponibilidadResult.data.bloqueosParciales?.length > 0) {
              // Filtrar horarios bloqueados parcialmente
              disponibilidadResult.data.bloqueosParciales.forEach((bloqueo: any) => {
                horariosDelDia = horariosDelDia.filter((hora: string) => {
                  return !(hora >= bloqueo.horaInicio && hora <= bloqueo.horaFin);
                });
              });
            }
          }
        } catch (error) {
          console.warn('⚠️ No se pudo verificar bloqueos parciales:', error);
        }
        
        // Filtrar horarios ocupados por citas
        const citasDelDia = citasData.filter(cita => cita.fecha === fecha);
        const horariosOcupados = citasDelDia.map(cita => cita.hora);
        const horariosLibres = horariosDelDia.filter((hora: string) => !horariosOcupados.includes(hora));

        return new Response(JSON.stringify({
          success: true,
          data: {
            fecha,
            dia: diaSemana,
            horariosDisponibles: horariosLibres,
            horariosOcupados: horariosOcupados,
            bloqueado: false
          },
          message: 'Horarios obtenidos correctamente'
        }), {
          status: 200,
          headers: corsHeaders
        });

      case 'todas':
        return new Response(JSON.stringify({
          success: true,
          data: citasData,
          message: 'Citas obtenidas correctamente'
        }), {
          status: 200,
          headers: corsHeaders
        });

      case 'pendientes':
        const citasPendientes = citasData.filter(cita => cita.estado === 'pendiente');
        return new Response(JSON.stringify({
          success: true,
          data: citasPendientes,
          message: 'Citas pendientes obtenidas correctamente'
        }), {
          status: 200,
          headers: corsHeaders
        });

      case 'confirmadas':
        const citasConfirmadas = citasData.filter(cita => cita.estado === 'confirmada');
        return new Response(JSON.stringify({
          success: true,
          data: citasConfirmadas,
          message: 'Citas confirmadas obtenidas correctamente'
        }), {
          status: 200,
          headers: corsHeaders
        });

      case 'completadas':
        const citasCompletadas = citasData.filter(cita => cita.estado === 'completada');
        return new Response(JSON.stringify({
          success: true,
          data: citasCompletadas,
          message: 'Citas completadas obtenidas correctamente'
        }), {
          status: 200,
          headers: corsHeaders
        });

      case 'canceladas':
        const citasCanceladas = citasData.filter(cita => cita.estado === 'cancelada');
        return new Response(JSON.stringify({
          success: true,
          data: citasCanceladas,
          message: 'Citas canceladas obtenidas correctamente'
        }), {
          status: 200,
          headers: corsHeaders
        });

      default:
        return new Response(JSON.stringify({
          success: true,
          data: citasData,
          message: 'Citas obtenidas correctamente'
        }), {
          status: 200,
          headers: corsHeaders
        });
    }

  } catch (error) {
    console.error('❌ Error en GET /api/citas:', error);
    return new Response(JSON.stringify({
      success: false,
      message: 'Error interno del servidor',
      error: error instanceof Error ? error.message : 'Error desconocido'
    }), {
      status: 500,
      headers: corsHeaders
    });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    console.log(`📥 POST /api/citas - Data:`, data);

    const { action, nombre, email, telefono, servicio, fecha, hora, mensaje, id, nuevoEstado } = data;

    if (action === 'crear-cita') {
      // Validaciones básicas
      if (!nombre || !email || !telefono || !servicio || !fecha || !hora) {
        return new Response(JSON.stringify({
          success: false,
          message: 'Faltan campos obligatorios'
        }), {
          status: 400,
          headers: corsHeaders
        });
      }

      // Verificar si la hora está disponible
      const citaExistente = citasData.find(cita => 
        cita.fecha === fecha && cita.hora === hora && cita.estado !== 'cancelada'
      );

      if (citaExistente) {
        return new Response(JSON.stringify({
          success: false,
          message: 'La hora seleccionada ya está ocupada'
        }), {
          status: 409,
          headers: corsHeaders
        });
      }

      // Crear nueva cita
      const nuevaCita = {
        id: Date.now(),
        nombre: nombre.trim(),
        email: email.trim().toLowerCase(),
        telefono: telefono.trim(),
        servicio: servicio.trim(),
        fecha,
        hora,
        mensaje: mensaje?.trim() || '',
        estado: 'pendiente',
        fechaCreacion: new Date().toISOString().split('T')[0],
        recordatorioEnviado: false,
        fechaRecordatorio: ""
      };

      // En una implementación real, aquí guardaríamos en base de datos
      citasData.push(nuevaCita);

      console.log(`✅ Cita creada: ${nuevaCita.nombre} - ${nuevaCita.fecha} ${nuevaCita.hora}`);

      // En una implementación real, aquí enviaríamos emails
      console.log(`📧 Email de confirmación enviado a: ${nuevaCita.email}`);
      console.log(`📧 Notificación admin enviada`);

      return new Response(JSON.stringify({
        success: true,
        data: nuevaCita,
        message: 'Cita agendada correctamente. Recibirás un email de confirmación.'
      }), {
        status: 201,
        headers: corsHeaders
      });
    }

    if (action === 'cambiar-estado') {
      if (!id || !nuevoEstado) {
        return new Response(JSON.stringify({
          success: false,
          message: 'ID de la cita y nuevo estado requeridos'
        }), {
          status: 400,
          headers: corsHeaders
        });
      }

      const citaIndex = citasData.findIndex(cita => cita.id == id);
      
      if (citaIndex === -1) {
        return new Response(JSON.stringify({
          success: false,
          message: 'Cita no encontrada'
        }), {
          status: 404,
          headers: corsHeaders
        });
      }

      const estadoAnterior = citasData[citaIndex].estado;
      citasData[citaIndex].estado = nuevoEstado;

      console.log(`🔄 Estado de cita cambiado: ${citasData[citaIndex].nombre} - ${estadoAnterior} → ${nuevoEstado}`);

      return new Response(JSON.stringify({
        success: true,
        data: citasData[citaIndex],
        message: `Estado de la cita cambiado a ${nuevoEstado}`
      }), {
        status: 200,
        headers: corsHeaders
      });
    }

    if (action === 'eliminar') {
      if (!id) {
        return new Response(JSON.stringify({
          success: false,
          message: 'ID de la cita requerido'
        }), {
          status: 400,
          headers: corsHeaders
        });
      }

      const citaIndex = citasData.findIndex(cita => cita.id == id);
      
      if (citaIndex === -1) {
        return new Response(JSON.stringify({
          success: false,
          message: 'Cita no encontrada'
        }), {
          status: 404,
          headers: corsHeaders
        });
      }

      const citaEliminada = citasData.splice(citaIndex, 1)[0];

      console.log(`🗑️ Cita eliminada: ${citaEliminada.nombre} - ${citaEliminada.fecha} ${citaEliminada.hora}`);

      return new Response(JSON.stringify({
        success: true,
        data: citaEliminada,
        message: 'Cita eliminada correctamente'
      }), {
        status: 200,
        headers: corsHeaders
      });
    }

    if (action === 'enviar-recordatorio') {
      if (!id) {
        return new Response(JSON.stringify({
          success: false,
          message: 'ID de la cita requerido'
        }), {
          status: 400,
          headers: corsHeaders
        });
      }

      const citaIndex = citasData.findIndex(cita => cita.id == id);
      
      if (citaIndex === -1) {
        return new Response(JSON.stringify({
          success: false,
          message: 'Cita no encontrada'
        }), {
          status: 404,
          headers: corsHeaders
        });
      }

      const cita = citasData[citaIndex];

      // Verificar que la cita esté confirmada
      if (cita.estado !== 'confirmada') {
        return new Response(JSON.stringify({
          success: false,
          message: 'Solo se pueden enviar recordatorios a citas confirmadas'
        }), {
          status: 400,
          headers: corsHeaders
        });
      }

      try {
        // Enviar recordatorio usando el servicio de email
        console.log(`📧 Enviando recordatorio a: ${cita.email} para cita del ${cita.fecha} a las ${cita.hora}`);
        
        const citaEmail: CitaEmail = {
          id: cita.id.toString(),
          nombre: cita.nombre,
          email: cita.email,
          telefono: cita.telefono,
          servicio: cita.servicio,
          fecha: cita.fecha,
          hora: cita.hora,
          mensaje: cita.mensaje
        };

        const emailEnviado = await enviarRecordatorioCita(citaEmail);
        
        if (!emailEnviado) {
          throw new Error('Error al enviar email de recordatorio');
        }
        
        // Marcar recordatorio como enviado
        citasData[citaIndex] = {
          ...cita,
          recordatorioEnviado: true,
          fechaRecordatorio: new Date().toISOString()
        };

        return new Response(JSON.stringify({
          success: true,
          data: citasData[citaIndex],
          message: 'Recordatorio enviado exitosamente'
        }), {
          status: 200,
          headers: corsHeaders
        });

      } catch (error) {
        console.error('❌ Error enviando recordatorio:', error);
        return new Response(JSON.stringify({
          success: false,
          message: 'Error al enviar recordatorio: ' + (error instanceof Error ? error.message : 'Error desconocido')
        }), {
          status: 500,
          headers: corsHeaders
        });
      }
    }

    if (action === 'recordatorios-pendientes') {
      // Obtener citas confirmadas para mañana que no tienen recordatorio enviado
      const mañana = new Date();
      mañana.setDate(mañana.getDate() + 1);
      const fechaMañana = mañana.toISOString().split('T')[0];

      const citasParaRecordatorio = citasData.filter(cita => 
        cita.fecha === fechaMañana && 
        cita.estado === 'confirmada' && 
        !cita.recordatorioEnviado
      );

      try {
        let enviados = 0;
        const errores = [];
        
        for (const cita of citasParaRecordatorio) {
          try {
            // Enviar recordatorio usando el servicio de email
            console.log(`📧 Enviando recordatorio masivo a: ${cita.email}`);
            
            const citaEmail: CitaEmail = {
              id: cita.id.toString(),
              nombre: cita.nombre,
              email: cita.email,
              telefono: cita.telefono,
              servicio: cita.servicio,
              fecha: cita.fecha,
              hora: cita.hora,
              mensaje: cita.mensaje
            };

            const emailEnviado = await enviarRecordatorioCita(citaEmail);
            
            if (emailEnviado) {
              // Marcar como enviado
              const citaIndex = citasData.findIndex(c => c.id === cita.id);
              if (citaIndex !== -1) {
                citasData[citaIndex] = {
                  ...citasData[citaIndex],
                  recordatorioEnviado: true,
                  fechaRecordatorio: new Date().toISOString()
                };
                enviados++;
              }
            } else {
              errores.push(`Error enviando a ${cita.email}`);
            }
          } catch (error) {
            console.error(`❌ Error enviando recordatorio a ${cita.email}:`, error);
            errores.push(`Error enviando a ${cita.email}: ${error instanceof Error ? error.message : 'Error desconocido'}`);
          }
        }

        const mensaje = errores.length > 0 
          ? `${enviados} recordatorios enviados exitosamente. Errores: ${errores.join(', ')}`
          : `${enviados} recordatorios enviados exitosamente`;

        return new Response(JSON.stringify({
          success: errores.length === 0 || enviados > 0,
          data: {
            total: citasParaRecordatorio.length,
            enviados: enviados,
            errores: errores
          },
          message: mensaje
        }), {
          status: 200,
          headers: corsHeaders
        });

      } catch (error) {
        console.error('❌ Error en recordatorios masivos:', error);
        return new Response(JSON.stringify({
          success: false,
          message: 'Error al enviar recordatorios: ' + (error instanceof Error ? error.message : 'Error desconocido')
        }), {
          status: 500,
          headers: corsHeaders
        });
      }
    }

    return new Response(JSON.stringify({
      success: false,
      message: 'Acción no válida'
    }), {
      status: 400,
      headers: corsHeaders
    });

  } catch (error) {
    console.error('❌ Error en POST /api/citas:', error);
    return new Response(JSON.stringify({
      success: false,
      message: 'Error interno del servidor',
      error: error instanceof Error ? error.message : 'Error desconocido'
    }), {
      status: 500,
      headers: corsHeaders
    });
  }
};