// Variables globales para almacenar datos
        let ingresos = [];
        let egresos = [];
        let plazosFijos = [];
        let inversiones = [];
        
        // Inicializar fechas
        document.addEventListener('DOMContentLoaded', function() {
            const hoy = new Date().toISOString().split('T')[0];
            document.getElementById('fechaIngreso').value = hoy;
            document.getElementById('fechaEgreso').value = hoy;
            document.getElementById('fechaInicioPF').value = hoy;
            document.getElementById('fechaInversion').value = hoy;
            
            actualizarResumen();
            
            // Calcular fecha de vencimiento automáticamente
            document.getElementById('plazoPF').addEventListener('input', calcularVencimiento);
            document.getElementById('fechaInicioPF').addEventListener('change', calcularVencimiento);
        });
        
        // Función para mostrar tabs
        function showTab(tabName, event) {
            // Ocultar todas las secciones
            const sections = document.querySelectorAll('.section');
            sections.forEach(section => section.classList.remove('active'));
            
            // Mostrar la sección seleccionada
            document.getElementById(tabName).classList.add('active');
            
            // Actualizar tabs activos
            const tabs = document.querySelectorAll('.tab');
            tabs.forEach(tab => tab.classList.remove('active'));
            event.target.classList.add('active');
        }
        
        // Formatear números como moneda
        function formatearMoneda(numero) {
            return new Intl.NumberFormat('es-AR', {
                style: 'currency',
                currency: 'ARS',
                minimumFractionDigits: 2
            }).format(numero);
        }
        
        // Agregar ingreso
        function agregarIngreso() {
            const fecha = document.getElementById('fechaIngreso').value;
            const concepto = document.getElementById('conceptoIngreso').value;
            const categoria = document.getElementById('categoriaIngreso').value;
            const monto = parseFloat(document.getElementById('montoIngreso').value);
            
            if (!fecha || !concepto || !monto) {
                alert('Por favor completa todos los campos obligatorios');
                return;
            }
            
            const ingreso = {
                id: Date.now(),
                fecha,
                concepto,
                categoria,
                monto
            };
            
            ingresos.push(ingreso);
            actualizarTablaIngresos();
            actualizarResumen();
            limpiarFormularioIngreso();
        }
        
        // Agregar egreso
        function agregarEgreso() {
            const fecha = document.getElementById('fechaEgreso').value;
            const concepto = document.getElementById('conceptoEgreso').value;
            const categoria = document.getElementById('categoriaEgreso').value;
            const monto = parseFloat(document.getElementById('montoEgreso').value);
            
            if (!fecha || !concepto || !monto) {
                alert('Por favor completa todos los campos obligatorios');
                return;
            }
            
            const egreso = {
                id: Date.now(),
                fecha,
                concepto,
                categoria,
                monto
            };
            
            egresos.push(egreso);
            actualizarTablaEgresos();
            actualizarResumen();
            limpiarFormularioEgreso();
        }
        
        // Calcular vencimiento de plazo fijo
        function calcularVencimiento() {
            const fechaInicio = document.getElementById('fechaInicioPF').value;
            const plazo = parseInt(document.getElementById('plazoPF').value);
            
            if (fechaInicio && plazo) {
                const inicio = new Date(fechaInicio);
                const vencimiento = new Date(inicio.getTime() + (plazo * 24 * 60 * 60 * 1000));
                document.getElementById('fechaVencimientoPF').value = vencimiento.toISOString().split('T')[0];
            }
        }
        
        // Agregar plazo fijo
        function agregarPlazoFijo() {
            const fechaInicio = document.getElementById('fechaInicioPF').value;
            const banco = document.getElementById('bancoPF').value;
            const capital = parseFloat(document.getElementById('capitalPF').value);
            const tasa = parseFloat(document.getElementById('tasaPF').value);
            const plazo = parseInt(document.getElementById('plazoPF').value);
            const fechaVencimiento = document.getElementById('fechaVencimientoPF').value;
            
            if (!fechaInicio || !banco || !capital || !tasa || !plazo) {
                alert('Por favor completa todos los campos obligatorios');
                return;
            }
            
            const rendimiento = (capital * tasa * plazo) / (365 * 100);
            const total = capital + rendimiento;
            
            const plazoFijo = {
                id: Date.now(),
                fechaInicio,
                banco,
                capital,
                tasa,
                plazo,
                fechaVencimiento,
                rendimiento,
                total,
                estado: 'Activo'
            };
            
            plazosFijos.push(plazoFijo);
            actualizarTablaPlazos();
            actualizarResumen();
            limpiarFormularioPlazo();
        }
        
        // Agregar inversión
        function agregarInversion() {
            const fecha = document.getElementById('fechaInversion').value;
            const tipo = document.getElementById('tipoInversion').value;
            const instrumento = document.getElementById('instrumentoInversion').value;
            const cantidad = parseFloat(document.getElementById('cantidadInversion').value);
            const precioCompra = parseFloat(document.getElementById('precioCompra').value);
            const precioActual = parseFloat(document.getElementById('precioActual').value) || precioCompra;
            
            if (!fecha || !instrumento || !cantidad || !precioCompra) {
                alert('Por favor completa todos los campos obligatorios');
                return;
            }
            
            const inversionTotal = cantidad * precioCompra;
            const valorActual = cantidad * precioActual;
            const gananciaP = valorActual - inversionTotal;
            const rendimiento = ((valorActual - inversionTotal) / inversionTotal) * 100;
            
            const inversion = {
                id: Date.now(),
                fecha,
                tipo,
                instrumento,
                cantidad,
                precioCompra,
                precioActual,
                inversionTotal,
                valorActual,
                gananciaP,
                rendimiento
            };
            
            inversiones.push(inversion);
            actualizarTablaInversiones();
            actualizarResumen();
            limpiarFormularioInversion();
        }
        
        // Actualizar tablas
        function actualizarTablaIngresos() {
            const tbody = document.getElementById('tablaIngresos');
            tbody.innerHTML = '';
            
            ingresos.forEach(ingreso => {
                const row = tbody.insertRow();
                row.innerHTML = `
                    <td>${ingreso.fecha}</td>
                    <td>${ingreso.concepto}</td>
                    <td>${ingreso.categoria}</td>
                    <td class="positive">${formatearMoneda(ingreso.monto)}</td>
                    <td><button class="delete-btn" onclick="eliminarIngreso(${ingreso.id})">Eliminar</button></td>
                `;
            });
        }
        
        function actualizarTablaEgresos() {
            const tbody = document.getElementById('tablaEgresos');
            tbody.innerHTML = '';
            
            egresos.forEach(egreso => {
                const row = tbody.insertRow();
                row.innerHTML = `
                    <td>${egreso.fecha}</td>
                    <td>${egreso.concepto}</td>
                    <td>${egreso.categoria}</td>
                    <td class="negative">${formatearMoneda(egreso.monto)}</td>
                    <td><button class="delete-btn" onclick="eliminarEgreso(${egreso.id})">Eliminar</button></td>
                `;
            });
        }
        
        function actualizarTablaPlazos() {
            const tbody = document.getElementById('tablaPlazos');
            tbody.innerHTML = '';
            
            plazosFijos.forEach(plazo => {
                const hoy = new Date();
                const vencimiento = new Date(plazo.fechaVencimiento);
                const estado = hoy > vencimiento ? 'Vencido' : 'Activo';
                
                const row = tbody.insertRow();
                row.innerHTML = `
                    <td>${plazo.banco}</td>
                    <td>${formatearMoneda(plazo.capital)}</td>
                    <td>${plazo.tasa}%</td>
                    <td>${plazo.plazo} días</td>
                    <td>${plazo.fechaInicio}</td>
                    <td>${plazo.fechaVencimiento}</td>
                    <td class="positive">${formatearMoneda(plazo.rendimiento)}</td>
                    <td class="positive">${formatearMoneda(plazo.total)}</td>
                    <td style="color: ${estado === 'Activo' ? '#27ae60' : '#e74c3c'}">${estado}</td>
                    <td><button class="delete-btn" onclick="eliminarPlazo(${plazo.id})">Eliminar</button></td>
                `;
            });
        }
        
        function actualizarTablaInversiones() {
            const tbody = document.getElementById('tablaInversiones');
            tbody.innerHTML = '';
            
            inversiones.forEach(inversion => {
                const row = tbody.insertRow();
                const rendimientoClass = inversion.rendimiento >= 0 ? 'positive' : 'negative';
                
                row.innerHTML = `
                    <td>${inversion.fecha}</td>
                    <td>${inversion.tipo}</td>
                    <td>${inversion.instrumento}</td>
                    <td>${inversion.cantidad}</td>
                    <td>${formatearMoneda(inversion.precioCompra)}</td>
                    <td>${formatearMoneda(inversion.precioActual)}</td>
                    <td>${formatearMoneda(inversion.inversionTotal)}</td>
                    <td>${formatearMoneda(inversion.valorActual)}</td>
                    <td class="${rendimientoClass}">${formatearMoneda(inversion.gananciaP)}</td>
                    <td class="${rendimientoClass}">${inversion.rendimiento.toFixed(2)}%</td>
                    <td>
                        <button class="delete-btn" onclick="eliminarInversion(${inversion.id})">Eliminar</button>
                        <button class="btn" style="margin-left: 5px; padding: 4px 8px; font-size: 12px;" onclick="actualizarPrecio(${inversion.id})">Actualizar</button>
                    </td>
                `;
            });
        }
        
        // Funciones para eliminar registros
        function eliminarIngreso(id) {
            if (confirm('¿Estás seguro de eliminar este ingreso?')) {
                ingresos = ingresos.filter(ingreso => ingreso.id !== id);
                actualizarTablaIngresos();
                actualizarResumen();
            }
        }
        
        function eliminarEgreso(id) {
            if (confirm('¿Estás seguro de eliminar este egreso?')) {
                egresos = egresos.filter(egreso => egreso.id !== id);
                actualizarTablaEgresos();
                actualizarResumen();
            }
        }
        
        function eliminarPlazo(id) {
            if (confirm('¿Estás seguro de eliminar este plazo fijo?')) {
                plazosFijos = plazosFijos.filter(plazo => plazo.id !== id);
                actualizarTablaPlazos();
                actualizarResumen();
            }
        }
        
        function eliminarInversion(id) {
            if (confirm('¿Estás seguro de eliminar esta inversión?')) {
                inversiones = inversiones.filter(inversion => inversion.id !== id);
                actualizarTablaInversiones();
                actualizarResumen();
            }
        }
        
        // Actualizar precio de inversión
        function actualizarPrecio(id) {
            const nuevoPrecio = prompt('Ingresa el nuevo precio:');
            if (nuevoPrecio && !isNaN(nuevoPrecio)) {
                const inversion = inversiones.find(inv => inv.id === id);
                if (inversion) {
                    inversion.precioActual = parseFloat(nuevoPrecio);
                    inversion.valorActual = inversion.cantidad * inversion.precioActual;
                    inversion.gananciaP = inversion.valorActual - inversion.inversionTotal;
                    inversion.rendimiento = ((inversion.valorActual - inversion.inversionTotal) / inversion.inversionTotal) * 100;
                    
                    actualizarTablaInversiones();
                    actualizarResumen();
                }
            }
        }
        
        // Limpiar formularios
        function limpiarFormularioIngreso() {
            document.getElementById('conceptoIngreso').value = '';
            document.getElementById('montoIngreso').value = '';
        }
        
        function limpiarFormularioEgreso() {
            document.getElementById('conceptoEgreso').value = '';
            document.getElementById('montoEgreso').value = '';
        }
        
        function limpiarFormularioPlazo() {
            document.getElementById('bancoPF').value = '';
            document.getElementById('capitalPF').value = '';
            document.getElementById('tasaPF').value = '';
            document.getElementById('plazoPF').value = '';
            document.getElementById('fechaVencimientoPF').value = '';
        }
        
        function limpiarFormularioInversion() {
            document.getElementById('instrumentoInversion').value = '';
            document.getElementById('cantidadInversion').value = '';
            document.getElementById('precioCompra').value = '';
            document.getElementById('precioActual').value = '';
        }
        
        // Actualizar resumen y reportes
        function actualizarResumen() {
            const totalIngresos = ingresos.reduce((sum, ingreso) => sum + ingreso.monto, 0);
            const totalEgresos = egresos.reduce((sum, egreso) => sum + egreso.monto, 0);
            const totalPlazos = plazosFijos.reduce((sum, plazo) => sum + plazo.capital, 0);
            const totalInversiones = inversiones.reduce((sum, inversion) => sum + inversion.inversionTotal, 0);
            const valorActualInversiones = inversiones.reduce((sum, inversion) => sum + inversion.valorActual, 0);
            
            const dineroDisponible = totalIngresos - totalEgresos - totalPlazos - totalInversiones;
            const patrimonioNeto = dineroDisponible + totalPlazos + valorActualInversiones;
            
            // Actualizar cards principales
            document.getElementById('totalIngresos').textContent = formatearMoneda(totalIngresos);
            document.getElementById('totalEgresos').textContent = formatearMoneda(totalEgresos);
            document.getElementById('totalInversiones').textContent = formatearMoneda(totalInversiones);
            document.getElementById('patrimonioNeto').textContent = formatearMoneda(patrimonioNeto);
            
            // Actualizar reportes
            document.getElementById('reporteIngresos').textContent = formatearMoneda(totalIngresos);
            document.getElementById('reporteEgresos').textContent = formatearMoneda(totalEgresos);
            document.getElementById('dineroDisponible').textContent = formatearMoneda(dineroDisponible);
            document.getElementById('totalPlazos').textContent = formatearMoneda(totalPlazos);
            document.getElementById('reporteInversiones').textContent = formatearMoneda(valorActualInversiones);
            document.getElementById('reportePatrimonio').textContent = formatearMoneda(patrimonioNeto);
            
            // Actualizar color del dinero disponible
            const elementoDinero = document.getElementById('dineroDisponible');
            elementoDinero.className = dineroDisponible >= 0 ? 'positive' : 'negative';
            
            // Actualizar rendimiento de inversiones
            actualizarRendimientoInversiones();
            actualizarEstadoPlazos();
        }
        
        function actualizarRendimientoInversiones() {
            const container = document.getElementById('rendimientoInversiones');
            
            if (inversiones.length === 0) {
                container.innerHTML = 'No hay inversiones registradas';
                return;
            }
            
            const totalInvertido = inversiones.reduce((sum, inv) => sum + inv.inversionTotal, 0);
            const valorActualTotal = inversiones.reduce((sum, inv) => sum + inv.valorActual, 0);
            const gananciaTotal = valorActualTotal - totalInvertido;
            const rendimientoTotal = (gananciaTotal / totalInvertido) * 100;
            
            const mejorInversion = inversiones.reduce((mejor, actual) => 
                actual.rendimiento > mejor.rendimiento ? actual : mejor
            );
            
            const peorInversion = inversiones.reduce((peor, actual) => 
                actual.rendimiento < peor.rendimiento ? actual : peor
            );
            
            container.innerHTML = `
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
                    <div>
                        <strong>Total Invertido:</strong><br>
                        ${formatearMoneda(totalInvertido)}
                    </div>
                    <div>
                        <strong>Valor Actual:</strong><br>
                        ${formatearMoneda(valorActualTotal)}
                    </div>
                    <div>
                        <strong>Ganancia/Pérdida:</strong><br>
                        <span class="${gananciaTotal >= 0 ? 'positive' : 'negative'}">${formatearMoneda(gananciaTotal)}</span>
                    </div>
                    <div>
                        <strong>Rendimiento Total:</strong><br>
                        <span class="${rendimientoTotal >= 0 ? 'positive' : 'negative'}">${rendimientoTotal.toFixed(2)}%</span>
                    </div>
                    <div>
                        <strong>Mejor Inversión:</strong><br>
                        ${mejorInversion.instrumento} (${mejorInversion.rendimiento.toFixed(2)}%)
                    </div>
                    <div>
                        <strong>Peor Inversión:</strong><br>
                        ${peorInversion.instrumento} (${peorInversion.rendimiento.toFixed(2)}%)
                    </div>
                </div>
            `;
        }
        
        function actualizarEstadoPlazos() {
            const container = document.getElementById('estadoPlazos');
            
            if (plazosFijos.length === 0) {
                container.innerHTML = 'No hay plazos fijos registrados';
                return;
            }
            
            const hoy = new Date();
            const plazosActivos = plazosFijos.filter(plazo => new Date(plazo.fechaVencimiento) > hoy);
            const plazosVencidos = plazosFijos.filter(plazo => new Date(plazo.fechaVencimiento) <= hoy);
            
            const capitalTotal = plazosFijos.reduce((sum, plazo) => sum + plazo.capital, 0);
            const rendimientoTotal = plazosFijos.reduce((sum, plazo) => sum + plazo.rendimiento, 0);
            const totalConRendimiento = capitalTotal + rendimientoTotal;
            
            const proximoVencimiento = plazosActivos.length > 0 ? 
                plazosActivos.reduce((proximo, actual) => 
                    new Date(actual.fechaVencimiento) < new Date(proximo.fechaVencimiento) ? actual : proximo
                ) : null;
            
            container.innerHTML = `
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
                    <div>
                        <strong>Plazos Activos:</strong><br>
                        ${plazosActivos.length}
                    </div>
                    <div>
                        <strong>Plazos Vencidos:</strong><br>
                        ${plazosVencidos.length}
                    </div>
                    <div>
                        <strong>Capital Total:</strong><br>
                        ${formatearMoneda(capitalTotal)}
                    </div>
                    <div>
                        <strong>Rendimiento Esperado:</strong><br>
                        <span class="positive">${formatearMoneda(rendimientoTotal)}</span>
                    </div>
                    <div>
                        <strong>Total con Rendimiento:</strong><br>
                        <span class="positive">${formatearMoneda(totalConRendimiento)}</span>
                    </div>
                    <div>
                        <strong>Próximo Vencimiento:</strong><br>
                        ${proximoVencimiento ? proximoVencimiento.fechaVencimiento + ' (' + proximoVencimiento.banco + ')' : 'N/A'}
                    </div>
                </div>
            `;
        }
        
        // Función para exportar datos (simulación)
        function exportarDatos() {
            const datos = {
                ingresos,
                egresos,
                plazosFijos,
                inversiones,
                fechaExportacion: new Date().toISOString()
            };
            
            const dataStr = JSON.stringify(datos, null, 2);
            const dataBlob = new Blob([dataStr], {type: 'application/json'});
            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'control_ahorros_backup.json';
            link.click();
        }
        
        // Función para importar datos (simulación)
        function importarDatos() {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json';
            input.onchange = function(event) {
                const file = event.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        try {
                            const datos = JSON.parse(e.target.result);
                            if (confirm('¿Deseas importar estos datos? Esto reemplazará todos los datos actuales.')) {
                                ingresos = datos.ingresos || [];
                                egresos = datos.egresos || [];
                                plazosFijos = datos.plazosFijos || [];
                                inversiones = datos.inversiones || [];
                                
                                actualizarTablaIngresos();
                                actualizarTablaEgresos();
                                actualizarTablaPlazos();
                                actualizarTablaInversiones();
                                actualizarResumen();
                                
                                alert('Datos importados correctamente');
                            }
                        } catch (error) {
                            alert('Error al importar los datos. Verifica que el archivo sea válido.');
                        }
                    };
                    reader.readAsText(file);
                }
            };
            input.click();
        }
        
        // Agregar botones de exportar/importar al final de la página de reportes
        document.addEventListener('DOMContentLoaded', function() {
    const reportes = document.getElementById('reportes');
    const botonesDiv = document.createElement('div');
    botonesDiv.style.marginTop = '30px';
    botonesDiv.style.textAlign = 'center';
    botonesDiv.innerHTML = `
        <button class="btn" onclick="exportarDatos()" style="margin:4px;">💾 Backup Completo</button>
        <button class="btn" onclick="exportarCSV('ingresos')" style="margin:4px;">📄 Ingresos CSV</button>
        <button class="btn" onclick="exportarCSV('egresos')" style="margin:4px;">📄 Egresos CSV</button>
        <button class="btn" onclick="exportarCSV('plazosFijos')" style="margin:4px;">📄 Plazos Fijos CSV</button>
        <button class="btn" onclick="exportarCSV('inversiones')" style="margin:4px;">📄 Inversiones CSV</button>
        <button class="btn" onclick="importarDatos()" style="margin:4px;">📁 Importar JSON</button>
    `;
    reportes.appendChild(botonesDiv);
});

// Helpers de fechas
function mesAnio(fecha) {
    // Retorna "MM-YYYY"
    if (!fecha) return '';
    const d = new Date(fecha);
    return ('0' + (d.getMonth() + 1)).slice(-2) + '-' + d.getFullYear();
}
function nombreMes(mes) {
    return [
        "Enero","Febrero","Marzo","Abril","Mayo","Junio",
        "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"
    ][parseInt(mes.split('-')[0],10)-1] + ' ' + mes.split('-')[1];
}

// Tabs de reportes
function showReportTab(tab) {
    document.querySelectorAll('.report-tab').forEach(b=>b.classList.remove('active'));
    if (tab==='resumen') document.querySelectorAll('.report-tab')[0].classList.add('active');
    if (tab==='mensual') document.querySelectorAll('.report-tab')[1].classList.add('active');
    if (tab==='categorias') document.querySelectorAll('.report-tab')[2].classList.add('active');
    if (tab==='comparativa') document.querySelectorAll('.report-tab')[3].classList.add('active');
    renderReportTab(tab);
}
window.showReportTab = showReportTab;

// Render dinámico de reportes
function renderReportTab(tab) {
    const container = document.getElementById('report-content');
    if (!container) return;
    if (tab === 'resumen') {
        container.innerHTML = renderResumenGeneral();
    } else if (tab === 'mensual') {
        container.innerHTML = renderResumenMensual();
    } else if (tab === 'categorias') {
        container.innerHTML = renderReporteCategorias();
    } else if (tab === 'comparativa') {
        container.innerHTML = renderComparativaMeses();
    }
}
window.renderReportTab = renderReportTab;

// Render: Resumen General
function renderResumenGeneral() {
    const totalIngresos = ingresos.reduce((s,x)=>s+x.monto,0);
    const totalEgresos = egresos.reduce((s,x)=>s+x.monto,0);
    const totalPlazos = plazosFijos.reduce((s,x)=>s+x.capital,0);
    const totalInversiones = inversiones.reduce((s,x)=>s+x.inversionTotal,0);
    const valorActualInversiones = inversiones.reduce((s,x)=>s+x.valorActual,0);
    const saldo = totalIngresos-totalEgresos-totalPlazos-totalInversiones;
    const patrimonio = saldo+totalPlazos+valorActualInversiones;

    return `
        <table class="report-table">
            <tr><th>Ingresos Totales</th><td class="positive">${formatearMoneda(totalIngresos)}</td></tr>
            <tr><th>Egresos Totales</th><td class="negative">${formatearMoneda(totalEgresos)}</td></tr>
            <tr><th>Invertido en Plazos Fijos</th><td>${formatearMoneda(totalPlazos)}</td></tr>
            <tr><th>Invertido en Inversiones</th><td>${formatearMoneda(totalInversiones)}</td></tr>
            <tr class="report-highlight"><th>Saldo Disponible</th><td>${formatearMoneda(saldo)}</td></tr>
            <tr class="report-highlight"><th>Patrimonio Neto</th><td>${formatearMoneda(patrimonio)}</td></tr>
        </table>
        <div style="font-size:15px;color:#666;padding-top:10px;">
        <b>Tip:</b> Usá las pestañas para ver detalles por mes y categorías.
        </div>
    `;
}

// Render: Resumen Mensual
function renderResumenMensual() {
    // Agrupado por mes
    let movs = {};
    ingresos.forEach(x => {
        let m = mesAnio(x.fecha);
        if (!movs[m]) movs[m]={ing:0, eg:0, inv:0, pf:0};
        movs[m].ing += x.monto;
    });
    egresos.forEach(x => {
        let m = mesAnio(x.fecha);
        if (!movs[m]) movs[m]={ing:0, eg:0, inv:0, pf:0};
        movs[m].eg += x.monto;
    });
    inversiones.forEach(x => {
        let m = mesAnio(x.fecha);
        if (!movs[m]) movs[m]={ing:0, eg:0, inv:0, pf:0};
        movs[m].inv += x.inversionTotal;
    });
    plazosFijos.forEach(x => {
        let m = mesAnio(x.fechaInicio);
        if (!movs[m]) movs[m]={ing:0, eg:0, inv:0, pf:0};
        movs[m].pf += x.capital;
    });

    // Ordenar por mes (más reciente arriba)
    let meses = Object.keys(movs).sort((a,b)=>{
        const [ma,ya]=a.split('-').map(Number), [mb,yb]=b.split('-').map(Number);
        return (yb-ya)|| (mb-ma);
    });

    let html = `<table class="report-table">
        <tr>
            <th>Mes</th><th>Ingresos</th><th>Egresos</th>
            <th>Invertido<br>Plazo Fijo</th><th>Invertido<br>Inversiones</th><th>Ahorro</th>
        </tr>
    `;
    let max = null, min = null;
    meses.forEach(m=>{
        const v = movs[m];
        const ahorro = v.ing-v.eg-v.pf-v.inv;
        if(max==null || ahorro>max.ahorro) max={mes:m,ahorro:ahorro};
        if(min==null || ahorro<min.ahorro) min={mes:m,ahorro:ahorro};
        html += `<tr${(m==max.mes?' class="positive"':'')+(m==min.mes?' class="negative"':'')}>
            <td>${nombreMes(m)}</td>
            <td>${formatearMoneda(v.ing)}</td>
            <td>${formatearMoneda(v.eg)}</td>
            <td>${formatearMoneda(v.pf)}</td>
            <td>${formatearMoneda(v.inv)}</td>
            <td>${formatearMoneda(ahorro)}</td>
        </tr>`;
    });
    html+=`</table>`;
    if(meses.length>0){
        html+=`<div style="margin-top:12px;font-size:15px;">
            <b>Mejor mes de ahorro:</b> <span class="positive">${nombreMes(max.mes)} (${formatearMoneda(max.ahorro)})</span><br>
            <b>Peor mes:</b> <span class="negative">${nombreMes(min.mes)} (${formatearMoneda(min.ahorro)})</span>
        </div>`;
    }
    return html;
}

// Render: Categorías (ingresos y egresos)
function renderReporteCategorias() {
    let catsIng = {}, catsEgr = {};
    ingresos.forEach(x=>{
        catsIng[x.categoria] = (catsIng[x.categoria]||0)+x.monto;
    });
    egresos.forEach(x=>{
        catsEgr[x.categoria] = (catsEgr[x.categoria]||0)+x.monto;
    });
    // Listas ordenadas descendente
    let catIngList = Object.entries(catsIng).sort((a,b)=>b[1]-a[1]);
    let catEgrList = Object.entries(catsEgr).sort((a,b)=>b[1]-a[1]);

    let html = `<div style="display:grid;grid-template-columns:1fr 1fr;gap:18px;">`;
    html += `<div><h4>Origen de tus Ingresos</h4>
    <table class="report-table"><tr><th>Categoría</th><th>Total</th></tr>
    ${catIngList.map(([c,v])=>`<tr><td>${c}</td><td>${formatearMoneda(v)}</td></tr>`).join("")}
    </table></div>`;

    html += `<div><h4>¿En qué gastás más?</h4>
    <table class="report-table"><tr><th>Categoría</th><th>Total</th></tr>
    ${catEgrList.map(([c,v])=>`<tr><td>${c}</td><td>${formatearMoneda(v)}</td></tr>`).join("")}
    </table></div>`;
    html += `</div>`;
    return html;
}

// Render: Comparativa mes a mes
function renderComparativaMeses() {
    // Como resumen mensual pero solo columnas ingresos/egresos y diferencia
    let movs = {};
    ingresos.forEach(x => {
        let m = mesAnio(x.fecha);
        if (!movs[m]) movs[m]={ing:0, eg:0};
        movs[m].ing += x.monto;
    });
    egresos.forEach(x => {
        let m = mesAnio(x.fecha);
        if (!movs[m]) movs[m]={ing:0, eg:0};
        movs[m].eg += x.monto;
    });
    let meses = Object.keys(movs).sort((a,b)=>{
        const [ma,ya]=a.split('-').map(Number), [mb,yb]=b.split('-').map(Number);
        return (yb-ya)|| (mb-ma);
    });
    let html = `<table class="report-table">
        <tr>
            <th>Mes</th>
            <th>Ingresos</th>
            <th>Egresos</th>
            <th>Diferencia</th>
        </tr>`;
    meses.forEach(m=>{
        const v = movs[m];
        const diff = v.ing-v.eg;
        html += `<tr>
            <td>${nombreMes(m)}</td>
            <td>${formatearMoneda(v.ing)}</td>
            <td>${formatearMoneda(v.eg)}</td>
            <td class="${diff>=0?'positive':'negative'}">${formatearMoneda(diff)}</td>
        </tr>`;
    });
    html += `</table>`;
    return html;
}

// Cargar resumen avanzado por defecto
document.addEventListener("DOMContentLoaded", ()=>{
    if(document.getElementById("report-content"))
        renderReportTab("resumen");
});

let currentChart = null;
function showGraphicTab(tab) {
    document.querySelectorAll('.graphics-tab').forEach(b=>b.classList.remove('active'));
    if (tab==='evolucion') document.querySelectorAll('.graphics-tab')[0].classList.add('active');
    if (tab==='categorias') document.querySelectorAll('.graphics-tab')[1].classList.add('active');
    renderGraphicTab(tab);
}
window.showGraphicTab = showGraphicTab;

function renderGraphicTab(tab) {
    const container = document.getElementById('graphics-content');
    if (!container) return;
    container.innerHTML = '<canvas id="graphic-canvas" height="120"></canvas>';
    const ctx = document.getElementById('graphic-canvas').getContext('2d');

    // Limpio chart anterior si existe
    if (currentChart) currentChart.destroy();

    if (tab === 'evolucion') {
        // --- Evolución Mensual
        let movs = {};
        ingresos.forEach(x => {
            let m = mesAnio(x.fecha);
            if (!movs[m]) movs[m]={ing:0, eg:0, pf:0, inv:0};
            movs[m].ing += x.monto;
        });
        egresos.forEach(x => {
            let m = mesAnio(x.fecha);
            if (!movs[m]) movs[m]={ing:0, eg:0, pf:0, inv:0};
            movs[m].eg += x.monto;
        });
        plazosFijos.forEach(x => {
            let m = mesAnio(x.fechaInicio);
            if (!movs[m]) movs[m]={ing:0, eg:0, pf:0, inv:0};
            movs[m].pf += x.capital;
        });
        inversiones.forEach(x => {
            let m = mesAnio(x.fecha);
            if (!movs[m]) movs[m]={ing:0, eg:0, pf:0, inv:0};
            movs[m].inv += x.inversionTotal;
        });
        let meses = Object.keys(movs).sort((a,b)=>{
            const [ma,ya]=a.split('-').map(Number), [mb,yb]=b.split('-').map(Number);
            return (ya-yb)|| (ma-mb);
        });
        let labels = meses.map(m=>nombreMes(m));
        let datosIng = meses.map(m=>movs[m].ing);
        let datosEgr = meses.map(m=>movs[m].eg);
        let datosPF = meses.map(m=>movs[m].pf);
        let datosInv = meses.map(m=>movs[m].inv);
        let datosAhorro = meses.map(m=>movs[m].ing-movs[m].eg-movs[m].pf-movs[m].inv);

        currentChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    { label: 'Ingresos', data: datosIng, borderWidth: 2, tension: 0.3, pointRadius:3 },
                    { label: 'Egresos', data: datosEgr, borderWidth: 2, tension: 0.3, pointRadius:3 },
                    { label: 'Ahorro', data: datosAhorro, borderWidth: 2, tension: 0.3, pointRadius:3 },
                ]
            },
            options: {
                plugins: { legend: { display: true, position: 'bottom' }},
                scales: { y: { beginAtZero: true, ticks:{ callback: v=>formatearMoneda(v) } } }
            }
        });
    } else if (tab === 'categorias') {
        // --- Por categoría (torta ingresos + egresos)
        container.innerHTML = '<div style="display:flex;justify-content:center;"><canvas id="graphic-canvas" width="340" height="340" style="max-width:100%;height:auto;"></canvas></div>';
        let catsIng = {}, catsEgr = {};
        ingresos.forEach(x=>{
            catsIng[x.categoria] = (catsIng[x.categoria]||0)+x.monto;
        });
        egresos.forEach(x=>{
            catsEgr[x.categoria] = (catsEgr[x.categoria]||0)+x.monto;
        });
        let totalIng = Object.values(catsIng).reduce((a,b)=>a+b,0);
        let totalEgr = Object.values(catsEgr).reduce((a,b)=>a+b,0);

        // Donut de ingresos y egresos
        currentChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: Object.keys(catsIng).concat(Object.keys(catsEgr).map(c=>'[EG] '+c)),
                datasets: [{
                    label: 'Distribución',
                    data: Object.values(catsIng).concat(Object.values(catsEgr)),
                }]
            },
            options: {
                plugins: { legend: { display: true, position: 'right' }},
                cutout: '60%',
            }
        });
    }
}

// Mostrar por defecto
document.addEventListener("DOMContentLoaded", ()=>{
    if(document.getElementById("graphics-content"))
        renderGraphicTab("evolucion");
});

function filtrarTabla(tipo) {
    let busqueda = '';
    let datos = [];
    let tbody = null;

    if (tipo === 'ingresos') {
        busqueda = document.getElementById('buscadorIngresos').value.toLowerCase();
        datos = ingresos;
        tbody = document.getElementById('tablaIngresos');
    } else if (tipo === 'egresos') {
        busqueda = document.getElementById('buscadorEgresos').value.toLowerCase();
        datos = egresos;
        tbody = document.getElementById('tablaEgresos');
    } else if (tipo === 'plazos-fijos') {
        busqueda = document.getElementById('buscadorPlazos').value.toLowerCase();
        datos = plazosFijos;
        tbody = document.getElementById('tablaPlazos');
    } else if (tipo === 'inversiones') {
        busqueda = document.getElementById('buscadorInversiones').value.toLowerCase();
        datos = inversiones;
        tbody = document.getElementById('tablaInversiones');
    }
    if (!tbody) return;
    tbody.innerHTML = '';
    datos.filter(item => {
        // Junta todos los valores del objeto y busca si alguno matchea la búsqueda
        return Object.values(item).some(v =>
            (v + '').toLowerCase().includes(busqueda)
        );
    }).forEach(item => {
        // Reusa las funciones existentes para crear las filas
        if (tipo === 'ingresos') {
            const row = tbody.insertRow();
            row.innerHTML = `
                <td>${item.fecha}</td>
                <td>${item.concepto}</td>
                <td>${item.categoria}</td>
                <td class="positive">${formatearMoneda(item.monto)}</td>
                <td><button class="delete-btn" onclick="eliminarIngreso(${item.id})">Eliminar</button></td>
            `;
        } else if (tipo === 'egresos') {
            const row = tbody.insertRow();
            row.innerHTML = `
                <td>${item.fecha}</td>
                <td>${item.concepto}</td>
                <td>${item.categoria}</td>
                <td class="negative">${formatearMoneda(item.monto)}</td>
                <td><button class="delete-btn" onclick="eliminarEgreso(${item.id})">Eliminar</button></td>
            `;
        } else if (tipo === 'plazos') {
            const hoy = new Date();
            const vencimiento = new Date(item.fechaVencimiento);
            const estado = hoy > vencimiento ? 'Vencido' : 'Activo';
            const row = tbody.insertRow();
            row.innerHTML = `
                <td>${item.banco}</td>
                <td>${formatearMoneda(item.capital)}</td>
                <td>${item.tasa}%</td>
                <td>${item.plazo} días</td>
                <td>${item.fechaInicio}</td>
                <td>${item.fechaVencimiento}</td>
                <td class="positive">${formatearMoneda(item.rendimiento)}</td>
                <td class="positive">${formatearMoneda(item.total)}</td>
                <td style="color: ${estado === 'Activo' ? '#27ae60' : '#e74c3c'}">${estado}</td>
                <td><button class="delete-btn" onclick="eliminarPlazo(${item.id})">Eliminar</button></td>
            `;
        } else if (tipo === 'inversiones') {
            const rendimientoClass = item.rendimiento >= 0 ? 'positive' : 'negative';
            const row = tbody.insertRow();
            row.innerHTML = `
                <td>${item.fecha}</td>
                <td>${item.tipo}</td>
                <td>${item.instrumento}</td>
                <td>${item.cantidad}</td>
                <td>${formatearMoneda(item.precioCompra)}</td>
                <td>${formatearMoneda(item.precioActual)}</td>
                <td>${formatearMoneda(item.inversionTotal)}</td>
                <td>${formatearMoneda(item.valorActual)}</td>
                <td class="${rendimientoClass}">${formatearMoneda(item.gananciaP)}</td>
                <td class="${rendimientoClass}">${item.rendimiento.toFixed(2)}%</td>
                <td>
                    <button class="delete-btn" onclick="eliminarInversion(${item.id})">Eliminar</button>
                    <button class="btn" style="margin-left: 5px; padding: 4px 8px; font-size: 12px;" onclick="actualizarPrecio(${item.id})">Actualizar</button>
                </td>
            `;
        }
    });
}
window.filtrarTabla = filtrarTabla;

// Opcional: que al agregar/eliminar/manejar datos, si hay filtro activo se mantenga el filtro aplicado.
// (Solo si querés, sino los filtros se reinician y es más simple de mantener.)

function exportarDatos() {
    const datos = {
        ingresos,
        egresos,
        plazosFijos,
        inversiones,
        fechaExportacion: new Date().toISOString()
    };
    const dataStr = JSON.stringify(datos, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const fecha = new Date().toISOString().slice(0,16).replace(/[:T]/g,"-");
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'control_ahorros_backup_' + fecha + '.json';
    link.click();
}

function exportarCSV(seccion) {
    let filas = [];
    let cols = [];
    let nombre = seccion + '_' + new Date().toISOString().slice(0,10);

    if (seccion === 'ingresos') {
        cols = ['Fecha','Concepto','Categoría','Monto'];
        filas = ingresos.map(x=>[x.fecha,x.concepto,x.categoria,x.monto]);
    }
    if (seccion === 'egresos') {
        cols = ['Fecha','Concepto','Categoría','Monto'];
        filas = egresos.map(x=>[x.fecha,x.concepto,x.categoria,x.monto]);
    }
    if (seccion === 'plazosFijos') {
        cols = ['Banco','Capital','Tasa','Plazo','Inicio','Vencimiento','Rendimiento','Total','Estado'];
        filas = plazosFijos.map(x=>{
            const hoy = new Date();
            const vencimiento = new Date(x.fechaVencimiento);
            const estado = hoy > vencimiento ? 'Vencido' : 'Activo';
            return [x.banco,x.capital,x.tasa,x.plazo,x.fechaInicio,x.fechaVencimiento,x.rendimiento,x.total,estado];
        });
    }
    if (seccion === 'inversiones') {
        cols = ['Fecha','Tipo','Instrumento','Cantidad','Precio Compra','Precio Actual','Inversión Total','Valor Actual','Ganancia/Pérdida','% Rendimiento'];
        filas = inversiones.map(x=>[
            x.fecha,x.tipo,x.instrumento,x.cantidad,x.precioCompra,x.precioActual,x.inversionTotal,x.valorActual,x.gananciaP,x.rendimiento
        ]);
    }
    // Genera CSV simple
    let csv = cols.join(',') + '\n' + filas.map(f=>f.map(v=>`"${(v+'').replace(/"/g,'""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], {type: 'text/csv'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = nombre+'.csv';
    a.click();
}

function importarDatos() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const datos = JSON.parse(e.target.result);
                    // Validar estructura
                    const ok = datos.ingresos && datos.egresos && datos.plazosFijos && datos.inversiones;
                    if (!ok) throw new Error("Archivo inválido");
                    if (confirm('¿Deseas importar estos datos? Esto reemplazará todos los datos actuales.')) {
                        ingresos = datos.ingresos || [];
                        egresos = datos.egresos || [];
                        plazosFijos = datos.plazosFijos || [];
                        inversiones = datos.inversiones || [];
                        actualizarTablaIngresos();
                        actualizarTablaEgresos();
                        actualizarTablaPlazos();
                        actualizarTablaInversiones();
                        actualizarResumen();
                        alert('Datos importados correctamente');
                    }
                } catch (error) {
                    alert('Error al importar los datos. Verifica que el archivo sea válido.');
                }
            };
            reader.readAsText(file);
        }
    };
    input.click();
}

document.addEventListener('DOMContentLoaded', function() {
    const btn = document.getElementById('toggleDark');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    let isDark = localStorage.getItem('modoOscuro') === '1' || prefersDark;

    function setDark(dark) {
        document.body.classList.toggle('dark', dark);
        btn.textContent = dark ? '☀️ Modo Claro' : '🌙 Modo Oscuro';
        localStorage.setItem('modoOscuro', dark ? '1' : '0');
    }
    setDark(isDark);
    btn.onclick = () => {
        isDark = !isDark;
        setDark(isDark);
    };
});
