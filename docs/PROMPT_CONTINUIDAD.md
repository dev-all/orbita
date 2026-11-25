# Prompt para continuar Órbita en otra sesión

Copiar el siguiente bloque completo en una sesión de Codex con acceso a la carpeta clonada. Si se usa ChatGPT sin herramientas locales, aclarar esa limitación y utilizar estas instrucciones como contexto, sin afirmar que se ejecutaron cambios o verificaciones.

```text
Continuá el desarrollo del proyecto Órbita como Senior Full-Stack Engineer. Trabajá sobre el repositorio existente y conservá su arquitectura y decisiones. Primero inspeccioná el estado actual; no reinicies ni vuelvas a crear el proyecto.

REPOSITORIO Y ENTORNO
- GitHub: https://github.com/dev-all/orbita.git
- El código funcional fue verificado y sincronizado con main hasta 330e866. Puede haber commits posteriores: comprobá HEAD, remoto y cambios locales antes de trabajar.
- La ruta anterior era E:\2026\Ecommerce; en esta PC usá la carpeta realmente abierta, sin asumir que coincide.
- Node 24 LTS; máquina original Node 24.20.0, npm 11.19.0. Usamos npm y package-lock.json.
- Leé AGENTS.md y la documentación pertinente de node_modules/next/dist/docs/ antes de escribir código Next.js.

OBJETIVO DEL NEGOCIO
- Tienda propia para Argentina: bazar, luego ferretería y tecnología.
- Primer catálogo: 20 artículos de bazar para Navidad, con variantes.
- Stock propio y compra al proveedor bajo pedido, con confirmación y plazos explícitos.
- Despacho desde San Miguel, Buenos Aires. CP informado 1643, pendiente de verificar con el domicilio real. No hay local al público.
- Ventas por web y WhatsApp; Mercado Libre automático queda para después.
- Mercado Pago será el medio de cobro. Correo Argentino para cotizaciones; reparto local por definir. Facturación pendiente antes de vender.
- Compras como invitado; las cuentas de clientes no son requisito inicial.

MARCA Y STACK
- Se confirmó la paleta actual de Órbita: verde petróleo #17594F, tinta #172D34, blanco #FFFFFF y coral #CA6145. El nombre sigue provisional.
- Next.js 16.4.6 App Router, React 19.3.1, TypeScript estricto, Tailwind CSS 4.3.5, Zustand y Zod.
- Prisma 7.10.1 y PostgreSQL en Neon. Clerk 7.10.7 integrado para administración.
- Hay override acotado de effect a 3.22.5 por una vulnerabilidad transitiva de @prisma/config. Conservarlo salvo diagnóstico y validación de un reemplazo.
- ESLint 9.39.5 está fijado por compatibilidad con los plugins actuales de Next; emite aviso de fin de soporte al instalar. No forzar ESLint 10 sin resolver los peers.
- Desarrollo local y Neon Free. Vercel Hobby no se asumirá apto para uso comercial. Existe Dockerfile standalone, Compose y guía para futuro VPS en Argentina. Docker no es necesario para arrancar.

LO IMPLEMENTADO
- Portada, filtros, búsqueda, ordenamiento y fichas con variantes.
- Carrito persistente y cotización simulada con precios y cantidades validados en servidor.
- Catálogo ficticio de 20 productos / 40 variantes, ilustraciones SVG, CSV de muestra y plantilla de catálogo real.
- /admin permite probar borradores por navegador en modo demo, con guardar, restaurar y descartar. Esos borradores no modifican la tienda pública.
- En modo database, el panel exige sesión Clerk y coincidencia exacta con ADMIN_USER_IDS. Cada guardado vuelve a comprobar permisos en servidor.
- Edición de productos y variantes existentes: descripción, categoría, visibilidad, destacado, precio, presentación, color, inventario y abastecimiento. No hay todavía altas o eliminaciones desde el panel.
- Guardado transaccional con AdminAudit, movimientos físicos de inventario, control de versión y protección de stock reservado. Se probaron cinco escenarios de persistencia en PGlite efímero.
- /api/webhooks/mercadopago devuelve 503 deliberadamente: no se implementó el procesamiento real.

NEON YA CONECTADO
- La rama de Neon denominada production se usa temporalmente como desarrollo por decisión explícita del titular. No renombrarla ni migrar datos automáticamente.
- Se comprobó que estaba vacía y se aplicaron las tres migraciones versionadas. Se cargaron 20 productos, 40 variantes, 3 pedidos ficticios, 1 cliente ficticio y 1 proveedor ficticio.
- Las conexiones pooled y directa se verificaron. CATALOG_SOURCE=database y APP_ENV=development son la configuración local prevista.
- No recrear tablas ni repetir el seed para cambiar de computadora. Ambas PCs comparten la misma base.
- En la PC original hubo ETIMEDOUT por selección automática IPv4/IPv6 de Node. DATABASE_IPV4_ONLY=true solucionó la conexión con un ajuste del proceso, manteniendo TLS y sin IP fija. En otra PC probar false primero y usar true si se reproduce el problema.
- El seed tiene apertura previa de conexión, maxWait 20 s y timeout 120 s para la carga remota inicial.

SERVICIOS Y PENDIENTES
- Clerk seguía sin claves ni ADMIN_USER_IDS en el último estado comprobado. Está instalado y preparado en código, pero el login externo y la edición autenticada con una cuenta real todavía no fueron verificados.
- Se propuso usar Continuar con Google mediante Clerk. El usuario estaba evaluando esa opción; no asumir que ya habilitó Google ni cambiar de proveedor de autenticación por iniciativa propia.
- Gestión de imágenes todavía pendiente: el panel NO permite subir fotos. Se acordó como siguiente módulo propuesto subir JPEG/PNG/WebP, varias fotos, portada, orden, texto alternativo y asociación a variantes. Almacenamiento de archivos separado de PostgreSQL; el proveedor no está elegido ni configurado.
- Faltan reservas y pedidos reales, integración completa de Mercado Pago, webhooks idempotentes, Correo, correos transaccionales, políticas y circuito de facturación.
- Los productos, precios, existencias y pedidos de muestra no son información comercial real.

DOCUMENTOS QUE DEBÉS LEER
1. README.md
2. GUIA_CENTRAL.md: decisiones, Gantt y trabajo posterior.
3. docs/CONTINUAR_EN_OTRA_PC.md
4. docs/CONFIGURAR_NEON_CLERK.md
5. docs/VALIDACIONES.md
6. docs/DESPLIEGUE_DOCKER.md
7. docs/MARCA.md

PRIMERAS ACCIONES
1. Revisar git status, rama, commits, Node y npm. Preservar cualquier cambio existente.
2. Si faltan dependencias, instalar con npm ci y generar Prisma con npm run db:generate.
3. Revisar únicamente presencia y estado de variables, nunca imprimir sus valores. Usar npm run db:check; env:check puede fallar legítimamente mientras Clerk siga pendiente.
4. Comprobar el catálogo con npm run dev. Reutilizar servidores del usuario cuando existan y no detenerlos sin necesidad.
5. Detener el servidor propio antes de typecheck/build: ejecutar ambos a la vez con dev ya produjo errores por tipos regenerados en .next/dev/types.
6. Informar qué funciona en esta PC y qué sigue pendiente. Continuar con la configuración de Clerk si el titular ya completó sus claves; mientras falten, avanzar en tareas independientes como la gestión de imágenes, explicitando la dependencia del almacenamiento real.

REGLAS
- No pedir claves en el chat, inventar credenciales ni subir .env.local a Git. Indicar al titular dónde completarlas localmente.
- No desactivar TLS, permisos del panel o protecciones de stock para hacer pasar una prueba.
- No ejecutar reset, borrar datos, repetir seeds remotos, force push ni modificar configuraciones globales sin justificar y respetar autorización.
- Diagnosticar la causa antes de corregir fallos; no actualizar dependencias indiscriminadamente.
- Mantener la paleta y actualizar la guía central y el informe de validaciones con avances reales.
- Distinguir implementación, pruebas locales y validación externa. No afirmar que una cuenta o integración funciona hasta comprobarlo.
- El repo de Sonny Sangha solo se usó como referencia funcional; su código no es la base comercial del proyecto.
- El usuario prefiere que avances sin confirmaciones repetidas para trabajo reversible ya autorizado. Pedí solamente datos o decisiones que realmente falten, sin detener tareas independientes.
```
