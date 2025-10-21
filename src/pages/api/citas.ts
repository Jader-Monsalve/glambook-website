import type { APIRoute } from 'astro';
import fs from 'fs';
import path from 'path';
import { enviarConfirmacionCita, enviarNotificacionAdmin } from '../../utils/emailService';

// Configurar como server-rendered para que funcionen las APIs
export const prerender = false;

// Función para obtener la ruta del archivo de datos
function getDataPath(filename: string): string {
  // En desarrollo
  if (process.env.NODE_ENV === 'development') {
    return path.join(process.cwd(), 'src', 'data', filename);
  }
  
  // En producción con Netlify
  const possiblePaths = [
    path.join(process.cwd(), 'src', 'data', filename),
    path.join(__dirname, '..', '..', 'data', filename),
    path.join(__dirname, 'src', 'data', filename),
    path.join(process.cwd(), 'data', filename)
  ];
  
  for (const testPath of possiblePaths) {
    if (fs.existsSync(testPath)) {
      console.log(`📁 Encontrado archivo en: ${testPath}`);
      return testPath;
    }
  }
  
  console.warn(`⚠️ No se encontró el archivo ${filename} en ninguna ubicación`);
  return possiblePaths[0]; // Fallback
}

// Función para asegurar que el directorio existe
function ensureDirectoryExists(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// Archivos de datos
const CITAS_FILE = getDataPath('citas.json');
const HORARIOS_FILE = getDataPath('horarios.json');

// Función para leer citas
function leerCitas() {
  try {
    console.log(`🔍 Intentando leer citas: ${CITAS_FILE}`);
    
    if (fs.existsSync(CITAS_FILE)) {
      const data = fs.readFileSync(CITAS_FILE, 'utf8');
      const citas = JSON.parse(data) || [];
      console.log(`✅ Citas leídas: ${citas.length}`);
      return citas;
    } else {
      console.log(`⚠️ Archivo de citas no existe, creando uno nuevo: ${CITAS_FILE}`);
      ensureDirectoryExists(path.dirname(CITAS_FILE));
      fs.writeFileSync(CITAS_FILE, JSON.stringify([], null, 2));
      return [];
    }
  } catch (error) {
    console.error('Error al leer citas:', error);
    return [];
  }
}

// Función para guardar citas
function guardarCitas(citas: any[]) {
  try {
    const dir = path.dirname(CITAS_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(CITAS_FILE, JSON.stringify(citas, null, 2));
    return true;
  } catch (error) {
    console.error('Error al guardar citas:', error);
    return false;
  }
}

// Función para leer horarios
function leerHorarios() {
  try {
    if (fs.existsSync(HORARIOS_FILE)) {
      const data = fs.readFileSync(HORARIOS_FILE, 'utf8');
      return JSON.parse(data);
    }
    return {
      horarios: {
        lunes: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"],
        martes: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"],
        miercoles: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"],
        jueves: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"],
        viernes: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"],
        sabado: ["09:00", "10:00", "11:00", "12:00", "13:00"],
        domingo: []
      },
      configuracion: {
        diasAdelante: 30,
        horaMinima: "09:00",
        horaMaxima: "18:00",
        duracionCita: 60
      }
    };
  } catch (error) {
    console.error('Error al leer horarios:', error);
    return null;
  }
}

// Función para guardar horarios
function guardarHorarios(horarios: any) {
  try {
    const dir = path.dirname(HORARIOS_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(HORARIOS_FILE, JSON.stringify(horarios, null, 2));
    return true;
  } catch (error) {
    console.error('Error al guardar horarios:', error);
    return false;
  }
}

// Función para obtener horarios disponibles de una fecha
function obtenerHorariosDisponibles(fecha: string) {
  const citas = leerCitas();
  const configHorarios = leerHorarios();
  
  if (!configHorarios) return [];
  
  // Obtener día de la semana
  const fechaObj = new Date(fecha);
  const diasSemana = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
  const diaSemana = diasSemana[fechaObj.getDay()];
  
  // Obtener horarios base para ese día
  const horariosBase = configHorarios.horarios[diaSemana] || [];
  
  // Filtrar horarios ya ocupados
  const citasDelDia = citas.filter((cita: any) => cita.fecha === fecha && cita.estado !== 'cancelada');
  const horariosOcupados = citasDelDia.map((cita: any) => cita.hora);
  
  return horariosBase.filter((hora: string) => !horariosOcupados.includes(hora));
}

export const GET: APIRoute = async ({ url }) => {
  console.log('=== GET /api/citas ===');
  console.log('URL:', url.toString());
  
  try {
    const action = url.searchParams.get('action');
    const fecha = url.searchParams.get('fecha');
    
    console.log('Action:', action);
    
    if (action === 'horarios-disponibles' && fecha) {
      console.log('Obteniendo horarios disponibles para fecha:', fecha);
      const horariosDisponibles = obtenerHorariosDisponibles(fecha);
      console.log('Horarios disponibles:', horariosDisponibles);
      
      return new Response(JSON.stringify(horariosDisponibles), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }
    
    if (action === 'todas') {
      console.log('Obteniendo todas las citas...');
      const citas = leerCitas();
      console.log('Citas encontradas:', citas.length);
      
      return new Response(JSON.stringify(citas), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    if (action === 'obtener-todas') {
      console.log('Obteniendo todas las citas...');
      const citas = leerCitas();
      console.log('Citas encontradas:', citas.length);
      
      return new Response(JSON.stringify(citas), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }
    
    if (action === 'configuracion-horarios') {
      console.log('Obteniendo configuración de horarios...');
      const horarios = leerHorarios();
      
      return new Response(JSON.stringify(horarios), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }
    
    console.log('Acción no válida:', action);
    return new Response(JSON.stringify({ error: 'Acción no válida' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error en GET:', error);
    return new Response(JSON.stringify({ error: 'Error interno del servidor' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    console.log('Datos recibidos:', data);
    
    const { action } = data;
    
    if (action === 'crear-cita') {
      const { nombre, email, telefono, servicio, fecha, hora, comentarios } = data;
      
      // Validar que el horario esté disponible
      const horariosDisponibles = obtenerHorariosDisponibles(fecha);
      if (!horariosDisponibles.includes(hora)) {
        return new Response(JSON.stringify({ 
          success: false, 
          error: 'El horario seleccionado ya no está disponible' 
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      
      const citas = leerCitas();
      const nuevaCita = {
        id: Date.now(),
        nombre,
        email,
        telefono,
        servicio,
        fecha,
        hora,
        comentarios: comentarios || '',
        estado: 'confirmada',
        fechaCreacion: new Date().toISOString()
      };
      
      citas.push(nuevaCita);
      
      if (guardarCitas(citas)) {
        console.log('Cita creada:', nuevaCita);
        
        // Enviar emails de confirmación en paralelo
        try {
          const [confirmacionResult, notificacionResult] = await Promise.allSettled([
            enviarConfirmacionCita(nuevaCita),
            enviarNotificacionAdmin(nuevaCita)
          ]);
          
          if (confirmacionResult.status === 'fulfilled' && confirmacionResult.value.success) {
            console.log('✅ Email de confirmación enviado al cliente');
            if (confirmacionResult.value.previewUrl) {
              console.log('🔗 Preview cliente:', confirmacionResult.value.previewUrl);
            }
          } else {
            console.error('❌ Error al enviar confirmación al cliente:', 
              confirmacionResult.status === 'rejected' ? confirmacionResult.reason : confirmacionResult.value.error);
          }
          
          if (notificacionResult.status === 'fulfilled' && notificacionResult.value.success) {
            console.log('✅ Email de notificación enviado al admin');
            if (notificacionResult.value.previewUrl) {
              console.log('🔗 Preview admin:', notificacionResult.value.previewUrl);
            }
          } else {
            console.error('❌ Error al enviar notificación al admin:', 
              notificacionResult.status === 'rejected' ? notificacionResult.reason : notificacionResult.value.error);
          }
        } catch (emailError) {
          console.error('❌ Error general en envío de emails:', emailError);
        }
        
        return new Response(JSON.stringify({ 
          success: true, 
          cita: nuevaCita,
          message: 'Cita creada exitosamente. Se han enviado las notificaciones por email.'
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      } else {
        throw new Error('No se pudo guardar la cita');
      }
    }
    
    if (action === 'actualizar-estado-cita') {
      const { id, estado } = data;
      
      const citas = leerCitas();
      const citaIndex = citas.findIndex((c: any) => c.id === id);
      
      if (citaIndex !== -1) {
        citas[citaIndex].estado = estado;
        citas[citaIndex].fechaModificacion = new Date().toISOString();
        
        if (guardarCitas(citas)) {
          return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          });
        } else {
          throw new Error('No se pudo actualizar la cita');
        }
      } else {
        throw new Error('Cita no encontrada');
      }
    }
    
    if (action === 'configurar-horarios') {
      const { horarios } = data;
      
      if (guardarHorarios(horarios)) {
        return new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      } else {
        throw new Error('No se pudo guardar la configuración');
      }
    }

    if (action === 'cambiar-estado') {
      const { id, estado } = data;
      
      const citas = leerCitas();
      const citaIndex = citas.findIndex((c: any) => c.id == id);
      
      if (citaIndex !== -1) {
        citas[citaIndex].estado = estado;
        citas[citaIndex].fechaModificacion = new Date().toISOString();
        
        if (guardarCitas(citas)) {
          return new Response(JSON.stringify({ success: true, cita: citas[citaIndex] }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          });
        } else {
          throw new Error('No se pudo actualizar la cita');
        }
      } else {
        throw new Error('Cita no encontrada');
      }
    }

    if (action === 'eliminar') {
      const { id } = data;
      
      const citas = leerCitas();
      const citasFiltradas = citas.filter((c: any) => c.id != id);
      
      if (citasFiltradas.length < citas.length) {
        if (guardarCitas(citasFiltradas)) {
          return new Response(JSON.stringify({ success: true, message: 'Cita eliminada correctamente' }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          });
        } else {
          throw new Error('No se pudo eliminar la cita');
        }
      } else {
        throw new Error('Cita no encontrada');
      }
    }
    
    throw new Error('Acción no válida');
    
  } catch (error) {
    console.error('Error en POST:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Error interno del servidor',
      details: error instanceof Error ? error.stack : 'Error desconocido'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};