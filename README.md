# AlojaManta · entorno local

Prototipo hotelero de Manta con React 19, TypeScript, Vite y Tailwind 4. Actualmente es una aplicación de demostración: los accesos, reservas, cobros y registros de auditoría se simulan en el navegador. Usar únicamente datos ficticios.

## Empezar en Windows / T3 Code

Requisitos: Node 22 >=22.12 y npm 10. El equipo revisado usa Node 22.23.4 / npm 10.9.9.

```powershell
npm.cmd ci
npm.cmd run dev
```

Abrir http://127.0.0.1:8443/. El servidor escucha solo en este equipo. Si ese puerto está ocupado, cerrar el proceso correspondiente o usar `npm.cmd run dev -- --port 8444`. No hace falta cambiar la política de ejecución de PowerShell: `npm.cmd` evita el bloqueo de `npm.ps1`.

Usamos npm y `package-lock.json` como referencia local. El `pnpm-lock.yaml` y `.mise.toml` originales se conservan por compatibilidad con el origen Figma; no alternar instalaciones npm/pnpm en este entorno. No se necesita `.env` para comenzar; `.env.example` documenta las opciones. `PORT` y `APP_BASE_PATH` se leen del entorno del proceso, no de un archivo `.env`.

## Verificar el proyecto

```powershell
npm.cmd run qa
npm.cmd run test:e2e:install
npm.cmd run qa:full
```

`qa` comprueba tipos, lint, pruebas unitarias y compilación. `qa:full` añade una prueba de navegador sobre `dist/` y auditoría de dependencias. La instalación de Chromium solo hace falta al preparar el equipo o actualizar Playwright. Los resultados de navegador se guardan localmente en `playwright-report/`; pueden contener capturas/trazas y no se versionan.

Los botones del proyecto en T3 permiten instalar, iniciar, verificar QA y ejecutar la revisión completa. Ningún botón hace commit, push o despliega. El inicio del servidor es manual.

## Documentación y siguientes pasos

- [Índice y contexto](docs/README.md).
- [Arquitectura actual y evolución](docs/ARCHITECTURE.md).
- [Pruebas y procedimiento QA](docs/QA.md).
- [Hallazgos de seguridad](docs/SECURITY.md).
- [Fuentes de ChatGPT y documentos locales](docs/sources/README.md).
- [Despliegue futuro](docs/DEPLOYMENT.md).
- [Pendientes priorizados](docs/BACKLOG.md).

El usuario controla la publicación. El workflow de GitHub Pages ahora es manual; ese cambio solo tendrá efecto en GitHub cuando el usuario decida subirlo. No se ha publicado ni cambiado ningún repositorio remoto.
