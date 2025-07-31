# 💰 Control de Ahorros e Inversiones

**Proyecto Web para la gestión simple y potente de tus finanzas personales.**  
Registra ingresos, egresos, inversiones, plazos fijos y genera reportes y gráficos de manera intuitiva y **offline**.  
Funciona como **PWA (Progressive Web App)**, lista para instalar en cualquier dispositivo móvil (iPhone/Android) o escritorio.

---

## ✨ Características principales

- **Gestión de ingresos y egresos** con categorías personalizadas.
- **Control de inversiones** (acciones, bonos, dólares, cripto, etc.).
- **Seguimiento de plazos fijos** y cálculo de vencimientos/rendimientos.
- **Gráficos y reportes** dinámicos por mes y por categoría.
- **Modo oscuro/claro** con un clic.
- **Soporte completo offline** gracias a IndexedDB y Service Worker.
- **Exportación/Importación de datos** en JSON y CSV.
- **100% Responsive:** usable en PC, tablet y móvil.
- **Instalable como app** desde el navegador (PWA real).

---

## 🚀 Demo rápida

1. **Cloná o descargá este repositorio**
   ```bash
   git clone https://github.com/TowaCAI/control-ahorros.git
   cd control-ahorros
   ```
2. **Subilo a tu servidor VPS con HTTPS** (recomendado para PWA).
3. **Accedé desde tu navegador.**
   - En Chrome o Safari (iPhone): “Agregar a pantalla de inicio” para instalar la app.

---

## 📦 Estructura del proyecto

```
control-ahorros/
├── index.html
├── estilos.css
├── app.js
├── db.js
├── manifest.json
├── service-worker.js
├── icon-192.png
├── icon-512.png
```

---

## 🛠️ Instalación y uso local

1. **Serví la carpeta en un servidor local o VPS con HTTPS**  
   (Ejemplo simple con [http-server](https://www.npmjs.com/package/http-server)):
   ```bash
   npx http-server -c-1 -p 8080 --ssl --cert ./cert.pem --key ./key.pem
   ```
2. **Asegurate de tener archivos `manifest.json` y `service-worker.js`** en la raíz.
3. **Abrí `https://tu-dominio/` en tu navegador.**
4. ¡Listo! Podés usar y guardar la app en tu inicio como una aplicación más.

---

## 📱 Funciona como PWA en iPhone (y Android)

- **Instalá la app:**  
  Abrí en Safari, tocá “Compartir” → “Agregar a pantalla de inicio”.
- **Uso offline:**  
  La app funciona sin Internet y guarda todos tus datos en tu dispositivo.
- **Backup:**  
  Podés exportar e importar tu información en JSON/CSV en cualquier momento.

---

## 📝 Dependencias

- **[Chart.js](https://www.chartjs.org/)** para gráficos (CDN incluido en el HTML).
- **No requiere backend ni frameworks externos.**
- Solo JavaScript puro + IndexedDB.

---

## ⚡ Créditos y licencia

Proyecto realizado por [TowaCAI](https://github.com/TowaCAI).  
Licencia **MIT** — libre uso, modificación y distribución.

---

## 💡 ¿Querés contribuir?

¡Contribuciones, ideas y mejoras son bienvenidas!  
Abrí un issue o mandá un PR.

---
