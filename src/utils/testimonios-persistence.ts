import { promises as fs } from 'fs';
import path from 'path';
import type { Testimonio } from '../data/testimonios';
import { testimoniosAprobados } from '../data/testimonios';

// Ruta del archivo de datos persistentes
const DATA_DIR = path.join(process.cwd(), 'data');
const TESTIMONIOS_FILE = path.join(DATA_DIR, 'testimonios-data.json');

// Interface para la estructura de datos persistentes
interface TestimoniosData {
  aprobados: Testimonio[];
  pendientes: Testimonio[];
  lastId: number;
}

// Función para asegurar que el directorio de datos existe
async function ensureDataDirectory(): Promise<void> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (error) {
    // Directory might already exist, ignore error
  }
}

// Función para leer los datos del archivo
async function readTestimoniosData(): Promise<TestimoniosData> {
  try {
    await ensureDataDirectory();
    const data = await fs.readFile(TESTIMONIOS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // Si el archivo no existe, crear con datos iniciales
    const initialData: TestimoniosData = {
      aprobados: [...testimoniosAprobados], // Migrar testimonios existentes
      pendientes: [],
      lastId: Math.max(...testimoniosAprobados.map(t => t.id), 0)
    };
    await writeTestimoniosData(initialData);
    return initialData;
  }
}

// Función para escribir los datos al archivo
async function writeTestimoniosData(data: TestimoniosData): Promise<void> {
  try {
    await ensureDataDirectory();
    await fs.writeFile(TESTIMONIOS_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing testimonios data:', error);
    throw new Error('Failed to save testimonios data');
  }
}

// Obtener testimonios aprobados
export async function getAprobados(): Promise<Testimonio[]> {
  const data = await readTestimoniosData();
  return data.aprobados.filter(t => t.aprobado);
}

// Obtener testimonios pendientes
export async function getPendientes(): Promise<Testimonio[]> {
  const data = await readTestimoniosData();
  return data.pendientes;
}

// Agregar testimonio pendiente
export async function addPendiente(testimonio: Omit<Testimonio, 'id' | 'fecha' | 'aprobado' | 'avatar'>): Promise<Testimonio> {
  const data = await readTestimoniosData();
  
  const nuevoTestimonio: Testimonio = {
    ...testimonio,
    id: data.lastId + 1,
    fecha: new Date().toISOString().split('T')[0],
    aprobado: false,
    avatar: getRandomAvatar()
  };
  
  data.pendientes.push(nuevoTestimonio);
  data.lastId = nuevoTestimonio.id;
  
  await writeTestimoniosData(data);
  return nuevoTestimonio;
}

// Aprobar testimonio
export async function aprobarTestimonio(id: number): Promise<boolean> {
  const data = await readTestimoniosData();
  
  const index = data.pendientes.findIndex(t => t.id === id);
  if (index === -1) return false;
  
  const testimonio = data.pendientes.splice(index, 1)[0];
  testimonio.aprobado = true;
  data.aprobados.push(testimonio);
  
  await writeTestimoniosData(data);
  return true;
}

// Rechazar testimonio
export async function rechazarTestimonio(id: number): Promise<boolean> {
  const data = await readTestimoniosData();
  
  const index = data.pendientes.findIndex(t => t.id === id);
  if (index === -1) return false;
  
  data.pendientes.splice(index, 1);
  await writeTestimoniosData(data);
  return true;
}

// Eliminar testimonio aprobado
export async function eliminarAprobado(id: number): Promise<boolean> {
  const data = await readTestimoniosData();
  
  const index = data.aprobados.findIndex(t => t.id === id);
  if (index === -1) return false;
  
  data.aprobados.splice(index, 1);
  await writeTestimoniosData(data);
  return true;
}

// Función helper para generar avatar aleatorio
function getRandomAvatar(): string {
  const avatars = ['👩🏻', '👩🏼', '👩🏽', '👩🏾', '👩🏿', '👨🏻', '👨🏼', '👨🏽', '👨🏾', '👨🏿', '👧🏻', '👧🏼', '👧🏽', '👧🏾', '👧🏿'];
  return avatars[Math.floor(Math.random() * avatars.length)];
}

// Obtener estadísticas
export async function getEstadisticas(): Promise<{
  totalAprobados: number;
  totalPendientes: number;
  promedioCalificacion: number;
  servicioMasPopular: string;
}> {
  const data = await readTestimoniosData();
  
  const totalAprobados = data.aprobados.length;
  const totalPendientes = data.pendientes.length;
  
  const promedioCalificacion = totalAprobados > 0 
    ? data.aprobados.reduce((sum, t) => sum + t.calificacion, 0) / totalAprobados 
    : 0;
  
  // Calcular servicio más popular
  const servicios: Record<string, number> = {};
  data.aprobados.forEach(t => {
    if (t.servicio) {
      servicios[t.servicio] = (servicios[t.servicio] || 0) + 1;
    }
  });
  
  const servicioMasPopular = Object.keys(servicios).length > 0 
    ? Object.entries(servicios).reduce((a, b) => a[1] > b[1] ? a : b)[0] 
    : 'maquillaje';
  
  return {
    totalAprobados,
    totalPendientes,
    promedioCalificacion: Math.round(promedioCalificacion * 10) / 10,
    servicioMasPopular
  };
}