export { renderers } from '../../renderers.mjs';

const testimoniosAprobados = [
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
function getTestimoniosAprobados() {
  return testimoniosAprobados.filter((testimonio) => testimonio.aprobado);
}

const prerender = false;
const GET = async () => {
  try {
    const testimonios = getTestimoniosAprobados();
    return new Response(JSON.stringify(testimonios), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Pragma": "no-cache",
        "Expires": "0"
      }
    });
  } catch (error) {
    console.error("Error obteniendo testimonios:", error);
    return new Response(JSON.stringify({ error: "Error interno del servidor" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
