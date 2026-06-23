/* ============================================================
   FLORES AGREGADOS — db.js
   Módulo de conexión a Firebase Realtime Database (REST API)
   ============================================================ */

const DB = (function() {
  // Obtenemos la URL guardada en el navegador
  let baseURL = localStorage.getItem('fb_url') || '';
  
  // Limpiamos la URL para evitar errores con slashes dobles al final
  if (baseURL.endsWith('/')) {
    baseURL = baseURL.slice(0, -1);
  }

  /**
   * Función base para hacer peticiones a Firebase
   */
  async function request(endpoint, method = 'GET', body = null) {
    if (!baseURL) throw new Error('Firebase URL no configurada');
    
    // Firebase REST API requiere que el endpoint termine en .json
    const url = `${baseURL}/${endpoint}.json`;
    const options = { 
      method, 
      headers: { 'Content-Type': 'application/json' } 
    };
    
    if (body) {
      options.body = JSON.stringify(body);
    }

    const res = await fetch(url, options);
    if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
    return await res.json();
  }

  /**
   * Helper para traer listas (ventas, gastos, etc.) y convertirlas en Arrays
   */
  async function fetchTable(table) {
    try {
      const data = await request(table);
      if (!data) return [];
      
      // Firebase puede devolver un array (si los IDs son secuenciales) o un objeto.
      // Usamos Object.values para normalizarlo siempre a un Array.
      // filter(Boolean) elimina elementos nulos que Firebase a veces genera.
      return Object.values(data).filter(Boolean);
    } catch (e) {
      console.error(`Error cargando tabla '${table}':`, e);
      return [];
    }
  }

  return {
    /**
     * Inicializa la base de datos comprobando la conexión
     */
    init: async function() {
      if (!baseURL) return false;
      try {
        // Hacemos un ping rápido para verificar si tenemos permisos de lectura
        await request('config');
        return true;
      } catch (e) {
        console.error("Fallo al conectar con Firebase. Revisa la URL o las reglas de seguridad.", e);
        return false;
      }
    },

    /**
     * Guarda la URL y recarga la página para aplicar los cambios
     */
    setFirebaseUrl: function(url) {
      localStorage.setItem('fb_url', url);
      window.location.reload();
    },

    // ═══════════════════════════════════════════════════════════
    //  MÉTODOS DE LECTURA (GET)
    // ═══════════════════════════════════════════════════════════
    getVentas:    () => fetchTable('ventas'),
    getGastos:    () => fetchTable('gastos'),
    getCompras:   () => fetchTable('compras'),
    getPrestamos: () => fetchTable('prestamos'),
    
    getConfig: async () => {
      try {
        const cfg = await request('config/settings');
        return cfg || null;
      } catch(e) { 
        return null; 
      }
    },

    // ═══════════════════════════════════════════════════════════
    //  MÉTODOS DE ESCRITURA Y BORRADO (PUT / DELETE)
    // ═══════════════════════════════════════════════════════════
    
    /**
     * Guarda o actualiza un registro. 
     * Usamos PUT apuntando a su ID para sobreescribir el nodo exacto.
     */
    save: async function(table, record) {
      if (!record || !record.id) return;
      return await request(`${table}/${record.id}`, 'PUT', record);
    },

    /**
     * Elimina un registro apuntando a su ID.
     */
    del: async function(table, id) {
      if (!id) return;
      return await request(`${table}/${id}`, 'DELETE');
    },

    /**
     * Guarda la configuración global (capital, días, mes activo)
     */
    saveConfig: async function(cfgObj) {
      // Extraemos la propiedad 'key' (que en app.js viene como 'settings')
      // y guardamos el resto de propiedades en ese nodo.
      const { key, ...rest } = cfgObj;
      const path = key ? `config/${key}` : 'config/settings';
      return await request(path, 'PUT', rest);
    }
  };
})();