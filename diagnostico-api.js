// Diagnóstico del error 500 en API usuarios
console.log('🔧 Iniciando diagnóstico de API usuarios...');

const API_BASE = 'http://localhost:4324';

async function diagnosticarAPI() {
  try {
    // 1. Probar GET /api/usuarios
    console.log('📥 Probando GET /api/usuarios...');
    const getResponse = await fetch(`${API_BASE}/api/usuarios`);
    console.log('GET Status:', getResponse.status);
    
    if (getResponse.ok) {
      const getData = await getResponse.json();
      console.log('GET Success:', getData.success);
      console.log('Usuarios encontrados:', getData.data?.length || 0);
    } else {
      const getError = await getResponse.text();
      console.error('GET Error:', getError);
    }

    // 2. Probar POST /api/usuarios (action: stats)
    console.log('\n📊 Probando POST /api/usuarios (stats)...');
    const statsResponse = await fetch(`${API_BASE}/api/usuarios`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ action: 'stats' })
    });
    
    console.log('POST Stats Status:', statsResponse.status);
    
    if (statsResponse.ok) {
      const statsData = await statsResponse.json();
      console.log('POST Stats Success:', statsData.success);
    } else {
      const statsError = await statsResponse.text();
      console.error('POST Stats Error:', statsError);
    }

    // 3. Probar creación de usuario
    console.log('\n👤 Probando POST /api/usuarios (crear)...');
    const createResponse = await fetch(`${API_BASE}/api/usuarios`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        action: 'crear',
        nombre: 'Usuario Test',
        email: `test-${Date.now()}@ejemplo.com`,
        password: 'test123456',
        telefono: '+57 300 000 0000',
        rol: 'cliente'
      })
    });
    
    console.log('POST Create Status:', createResponse.status);
    
    if (createResponse.ok) {
      const createData = await createResponse.json();
      console.log('POST Create Success:', createData.success);
    } else {
      const createError = await createResponse.text();
      console.error('POST Create Error:', createError);
    }

  } catch (error) {
    console.error('❌ Error en diagnóstico:', error);
  }
}

// Ejecutar diagnóstico
diagnosticarAPI();