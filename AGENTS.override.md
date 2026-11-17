# AlojaManta: acuerdos para trabajar en este proyecto

- Responder en español. Leer README.md y docs/README.md antes de cambios amplios.
- Trabajo local por defecto. No hacer commit, push, publicar, desplegar ni escribir en servicios externos sin instrucción explícita del usuario. El usuario controla la publicación.
- Respetar cambios y eliminaciones existentes. No restaurar documentos borrados ni ejecutar scripts Python de documentos sin revisar sus entradas y salidas.
- npm y package-lock.json son la referencia del entorno local. En PowerShell usar npm.cmd si npm.ps1 está bloqueado; no cambiar ExecutionPolicy.
- Node 22 (>=22.12). Instalar con npm.cmd ci; desarrollar con npm.cmd run dev.
- Verificar con npm.cmd run qa. Para cambios de interfaz: compilar y ejecutar npm.cmd run test:e2e. Seguridad: npm.cmd run security:audit.
- La aplicación actual es una demostración frontend. localStorage, roles, accesos, pagos y auditoría del navegador no ofrecen seguridad de producción. Usar datos ficticios.
- No poner secretos en VITE_*, código, fixtures ni documentación. Los documentos privados van en docs/sources/private/, excluida de Git.
- Fuentes: docs/sources/README.md. Citar archivo y sección al implementar requisitos; registrar ambigüedades en docs/BACKLOG.md. No asumir que se tiene acceso a proyectos o conversaciones de ChatGPT.
- Evolucionar por funcionalidad siguiendo docs/ARCHITECTURE.md; evitar mover todo el prototipo en una sola tarea.
- Revisiones: reportar severidad, archivo, evidencia, impacto, corrección y verificación. No afirmar certificaciones PCI, SRI o cumplimiento legal sin evidencia.
- Las pruebas y audit no equivalen a un pentest. No ejecutar escáneres contra terceros.
