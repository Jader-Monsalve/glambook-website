// Archivo de datos para testimonios aprobados
// En producción, estos datos vendrían de una base de datos o CMS

export interface Testimonio {
  id: number;
  nombre: string;
  email?: string; // No se muestra públicamente
  calificacion: number;
  comentario: string;
  servicio?: string;
  fecha: string;
  aprobado: boolean;
  avatar?: string;
}

// Testimonios de ejemplo (estos se reemplazarían por datos reales)
export const testimoniosAprobados: Testimonio[] = [
  {
    id: 1,
    nombre: "María González",
    calificacion: 5,
    comentario: "El mejor salón de la ciudad. Las uñas me quedaron perfectas y el trato fue excepcional.",
    servicio: "unas",
    fecha: "2024-10-15",
    aprobado: true,
    avatar: "👩🏻"
  },
  {
    id: 2,
    nombre: "Ana Rodríguez",
    calificacion: 5,
    comentario: "Increíble trabajo con el maquillaje para mi boda. Me sentí como una princesa.",
    servicio: "maquillaje",
    fecha: "2024-10-10",
    aprobado: true,
    avatar: "👰🏽"
  },
  {
    id: 3,
    nombre: "Carmen López",
    calificacion: 5,
    comentario: "Profesionales en todo momento. Siempre salgo feliz de mis citas aquí.",
    servicio: "facial",
    fecha: "2024-10-08",
    aprobado: true,
    avatar: "👩🏾"
  },
  {
    id: 4,
    nombre: "Sofia Martínez",
    calificacion: 5,
    comentario: "Las extensiones de pestañas quedaron perfectas. Duran muchísimo y se ven naturales.",
    servicio: "pestanas",
    fecha: "2024-10-12",
    aprobado: true,
    avatar: "👩🏼"
  },
  {
    id: 5,
    nombre: "Valentina Torres",
    calificacion: 4,
    comentario: "Excelente servicio de cejas. El diseño quedó perfecto para mi rostro.",
    servicio: "cejas",
    fecha: "2024-10-14",
    aprobado: true,
    avatar: "👧🏻"
  },
  {
    id: 6,
    nombre: "Isabella Herrera",
    calificacion: 5,
    comentario: "El nail art que me hicieron fue espectacular. Recibí muchos cumplidos.",
    servicio: "unas",
    fecha: "2024-10-13",
    aprobado: true,
    avatar: "👩🏽"
  },
  {
    id: 7,
    nombre: "Mairidh Monsalve",
    calificacion: 5,
    comentario: "Excelente servicio de cejas. Me encantó el trabajo profesional que me hicieron.",
    servicio: "cejas",
    fecha: "2025-10-20",
    aprobado: true,
    avatar: "👨🏼"
  },
  {
    id: 8,
    nombre: "Mairidh Monsalve",
    calificacion: 5,
    comentario: "El mejor salón de la ciudad. Las uñas me quedaron perfectas y el trato fue excepcional.",
    servicio: "pestanas",
    fecha: "2025-10-20",
    aprobado: true,
    avatar: "👩🏾"
  },
  {
    id: 9,
    nombre: "Ana García",
    calificacion: 5,
    comentario: "Excelente servicio, me encantó el diseño de uñas que me hicieron. El personal es muy profesional y atento.",
    servicio: "unas",
    fecha: "2025-10-20",
    aprobado: true,
    avatar: "👩🏽"
  }

];

// Función para obtener testimonios aprobados
export function getTestimoniosAprobados(): Testimonio[] {
    return testimoniosAprobados.filter(testimonio => testimonio.aprobado);
}

// Función para obtener testimonios por servicio
export function getTestimoniosPorServicio(servicio: string): Testimonio[] {
  return getTestimoniosAprobados().filter(testimonio => testimonio.servicio === servicio);
}

// Función para generar estrellas
export function generarEstrellas(calificacion: number): string {
  return '⭐'.repeat(calificacion);
}

// Función para formatear fecha
export function formatearFecha(fecha: string): string {
  const date = new Date(fecha);
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// Función para obtener descripción del servicio
export function getDescripcionServicio(servicio?: string): string {
  const servicios: Record<string, string> = {
    maquillaje: "Maquillaje profesional",
    unas: "Diseño de uñas",
    cejas: "Diseño de cejas",
    pestanas: "Extensiones de pestañas",
    facial: "Tratamiento facial",
    otro: "Otro servicio"
  };
  
  return servicios[servicio || ''] || "Cliente";
}