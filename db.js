// ------------------------------------------------------
// CONFIGURACIÓN DE INDEXEDDB PARA PERSISTENCIA LOCAL
// ------------------------------------------------------

// Nombre y versión de la base de datos
const DB_NAME = 'ControlAhorrosDB';
const DB_VERSION = 1;
let db;

// ------------------------------------------------------
// ABRIR Y CONFIGURAR LA BASE DE DATOS
// ------------------------------------------------------

/**
 * Abre la base de datos (IndexedDB) y ejecuta el callback al finalizar.
 */
function abrirDB(callback) {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = e => {
        db = e.target.result;
        // Crea el almacén de objetos 'datos' si no existe
        if (!db.objectStoreNames.contains('datos')) {
            db.createObjectStore('datos', { keyPath: 'clave' });
        }
    };
    request.onsuccess = e => {
        db = e.target.result;
        if (callback) callback();
    };
    request.onerror = e => console.error('IndexedDB error:', e);
}

// ------------------------------------------------------
// FUNCIONES DE GUARDADO Y CARGA EN INDEXEDDB
// ------------------------------------------------------

/**
 * Guarda un conjunto de datos bajo una clave específica.
 */
function guardarDatos(clave, datos) {
    const tx = db.transaction(['datos'], 'readwrite');
    tx.objectStore('datos').put({ clave, datos });
}

/**
 * Carga los datos de una clave específica y los entrega por callback.
 */
function cargarDatos(clave, callback) {
    const tx = db.transaction(['datos'], 'readonly');
    const req = tx.objectStore('datos').get(clave);
    req.onsuccess = () => callback(req.result ? req.result.datos : null);
}

// ------------------------------------------------------
// GUARDADO Y CARGA GLOBAL DE TODAS LAS SECCIONES
// ------------------------------------------------------

/**
 * Guarda todos los arrays principales en la base de datos.
 */
function guardarTodo() {
    guardarDatos('ingresos', ingresos);
    guardarDatos('egresos', egresos);
    guardarDatos('plazosFijos', plazosFijos);
    guardarDatos('inversiones', inversiones);
}

/**
 * Carga todos los arrays principales desde la base de datos.
 */
function cargarTodo() {
    cargarDatos('ingresos', d => { ingresos = d || []; actualizarTablaIngresos(); });
    cargarDatos('egresos', d => { egresos = d || []; actualizarTablaEgresos(); });
    cargarDatos('plazosFijos', d => { plazosFijos = d || []; actualizarTablaPlazos(); });
    cargarDatos('inversiones', d => { inversiones = d || []; actualizarTablaInversiones(); });
    setTimeout(actualizarResumen, 300); // Espera breve para asegurar render correcto
}

// ------------------------------------------------------
// WRAPPER PARA AUTOMATIZAR GUARDADO AL MODIFICAR DATOS
// ------------------------------------------------------

/**
 * Envuelve una función para que después de ejecutarse guarde todo automáticamente.
 */
const wrap = fn => (...args) => { fn(...args); guardarTodo(); };

// ------------------------------------------------------
// EXPONE FUNCIONES AL ÁMBITO GLOBAL CON AUTOGUARDADO
// ------------------------------------------------------

window.agregarIngreso = wrap(agregarIngreso);
window.agregarEgreso = wrap(agregarEgreso);
window.agregarPlazoFijo = wrap(agregarPlazoFijo);
window.agregarInversion = wrap(agregarInversion);
window.eliminarIngreso = wrap(eliminarIngreso);
window.eliminarEgreso = wrap(eliminarEgreso);
window.eliminarPlazo = wrap(eliminarPlazo);
window.eliminarInversion = wrap(eliminarInversion);
window.actualizarPrecio = wrap(actualizarPrecio);

// ------------------------------------------------------
// INICIALIZACIÓN AUTOMÁTICA AL CARGAR LA PÁGINA
// ------------------------------------------------------

document.addEventListener('DOMContentLoaded', () => abrirDB(cargarTodo));
