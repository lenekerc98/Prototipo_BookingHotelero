# Preparación para despliegue

Todo el trabajo se mantiene local. No se ha desplegado ni se ha hecho push. Publicar la demo y operar una plataforma con clientes reales son hitos distintos; los P0 de `docs/SECURITY.md` bloquean el segundo.

## Artefacto estático local

```powershell
npm.cmd ci
npm.cmd run qa:full
npm.cmd run preview
```

Vite genera `dist/`; preview sirve para revisar ese artefacto, no para usarlo como servidor de producción. La base local es `/`. Para compilar bajo una subruta:

```powershell
$env:APP_BASE_PATH = '/Prototipo_BookingHotelero/'
npm.cmd run build
Remove-Item Env:APP_BASE_PATH
```

`FIGMA_PUBLIC_URL` conserva prioridad por compatibilidad con Figma.

## Contenedor opcional

Se incluyen `Dockerfile`, `.dockerignore`, `compose.yaml` y `deploy/nginx.conf`. Si Docker Desktop está instalado y en ejecución:

```powershell
docker compose up --build -d
# Abrir http://127.0.0.1:8080/
docker compose down
```

El build ejecuta QA básico; el navegador E2E se ejecuta antes, en el equipo. El contenedor final sirve solo `dist/`, sin fuentes privadas ni dependencias de desarrollo, escucha en 8080 y Compose publica solo en loopback. Las imágenes base usan versiones móviles; antes de producción fijar digests revisados, escanear la imagen y verificar arquitectura/actualizaciones. Docker no estaba disponible en el equipo durante la preparación, por lo que esta ruta aún no está validada ejecutándola.

## GitHub Pages futuro

`.github/workflows/deploy.yml` usa exclusivamente `workflow_dispatch`: requerirá que el usuario lo suba y lo ejecute manualmente desde Actions. Usa Node 22 y calcula la subruta con el nombre del repositorio. Pages debe estar configurado para GitHub Actions; el remoto conserva su workflow anterior hasta que el usuario publique estos cambios. No hay garantía local que desactive una automatización que ya exista en el remoto.

Antes de publicar incluso una demo: revisar contenido de `dist/`, datos del catálogo y credenciales demo; evitar datos personales o privados. GitHub Pages sirve frontend estático y no reemplaza un backend. No se configuraron proveedores, cuentas, dominios ni credenciales.
