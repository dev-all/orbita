# Estado técnico y validaciones

Fecha: 22 de noviembre de 2026.

## Entorno

- Node.js detectado: 24.20.0.
- npm detectado: 11.19.0.
- Git detectado: 2.37.0.windows.1.
- Docker CLI detectado: 20.10.17. Motor no disponible al consultar `docker version`; no se inició Docker Desktop ni se modificaron opciones globales.
- No hay credenciales reales de Neon, Mercado Pago, Clerk o Correo configuradas por el agente.

## Resultados observados

| Comando o comprobación | Resultado |
| --- | --- |
| `npm install --no-fund --no-audit` | Correcto; primera descarga y extracción demoró aproximadamente 24 minutos |
| `npm ls --depth=0` | Árbol directo sin dependencias inválidas tras fijar ESLint compatible |
| `node node_modules/tsx/dist/cli.mjs --test tests/commerce.test.ts` | Nueve pruebas aprobadas, cero fallos |
| `npm run typecheck` | Correcto; cliente Prisma, tipos de rutas y TypeScript estricto |
| `npm run lint` | Correcto, sin errores ni advertencias de código |
| `node node_modules/prisma/build/index.js validate` | Esquema válido |
| `prisma migrate diff --from-empty --to-schema prisma/schema.prisma --script` | Migración inicial generada; se agregaron restricciones comerciales en otra migración |
| Migraciones en una instancia efímera de PGlite | Nueve tablas creadas; inventario reservado mayor al stock rechazado por CHECK |
| Seed ejecutado dos veces mediante Prisma y protocolo PostgreSQL local sobre PGlite | Se conservaron 20 productos, 40 variantes, 3 pedidos, 3 líneas, 3 pagos, 1 cliente y 1 proveedor; sin duplicados |
| Seed ejecutado sin confirmación | Bloqueado correctamente con salida 1 |
| `node node_modules/tsx/dist/cli.mjs scripts/export-catalog.ts` | CSV de cuarenta variantes y plantilla vacía generados |
| `npm run build` | Build final correcto; rutas, tipos y assets standalone generados |
| `npm start` | Servidor standalone inició correctamente; health respondió 200 |
| `npm run dev -- --hostname 127.0.0.1` | Inició correctamente; página principal compiló y respondió 200 |
| `npm audit --json` | Cero vulnerabilidades reportadas después del parche transitivo |
| `docker compose config --quiet` | Configuración válida |
| Imagen Docker y contenedor | Sin ejecutar; motor Docker inactivo |

La comprobación con PGlite usa PostgreSQL compilado a WebAssembly y un servidor de protocolo PostgreSQL efímero. No sustituye la prueba en Neon ni en PostgreSQL del VPS. La base de comprobación se cerró y no contiene datos reales.

## Rutas y comportamiento HTTP

En el servidor de producción se verificaron respuestas 200 para `/`, `/productos/platos-playos-alba`, `/checkout`, `/admin`, `/ayuda` y `/api/health`. Un producto inexistente devolvió 404.

`POST /api/checkout/preview` devolvió 200 para una cotización válida, 409 al exceder stock con líneas duplicadas y 400 para JSON inválido o un precio introducido en el cuerpo de la solicitud. `POST /api/webhooks/mercadopago` devolvió 503, indicando integración pendiente sin aceptar falsamente el evento. La cabecera `X-Content-Type-Options: nosniff` se comprobó en la respuesta.

Dos unidades de BAZ-001-01 produjeron subtotal de ARS 85.800, envío simulado de ARS 8.500 y total de ARS 94.300, tanto en HTTP como en la interfaz.

## Revisión del navegador

- Portada, carrito, aumento de cantidad y checkout de prueba verificados en navegador.
- Persistencia del carrito comprobada tras recargar y reiniciar el servidor.
- Una variante bajo pedido mostró siete días de preparación; al cambiar de variante, mostró stock propio y dos días.
- El filtro Organización dejó los dos productos de esa categoría, incluyendo un artículo agotado con botón deshabilitado.
- Vista móvil probada con override de 390 por 844; ancho útil de 375 px y contenido de 375 px, sin desbordamiento horizontal de la página. La navegación y pestañas tienen desplazamiento horizontal propio.
- Se corrigieron altura del título y separación de una frase en móvil.
- Sin errores de consola de la página durante las comprobaciones.

Capturas: [portada de escritorio](capturas/inicio-escritorio.jpg) y [catálogo móvil](capturas/catalogo-movil.jpg).

## Advertencias y decisiones técnicas

1. Next.js detectó lentitud del sistema de archivos en E: con benchmark de 576 ms. No se movió el proyecto ni se alteraron exclusiones de antivirus o configuraciones globales.
2. ESLint 9.39.5 emite una advertencia de fin de soporte al instalarse. Se conserva porque los plugins actuales de `eslint-config-next@16.4.6` declaran compatibilidad hasta ESLint 9. Se probó ESLint 10 y se descartó al comprobar peers incompatibles; no se forzó esa combinación. Revisar la cadena de lint como mantenimiento pendiente.
3. npm informó scripts de instalación de Prisma, engines y esbuild no cubiertos por su política `allowScripts`. No se amplió la política global. Generación, pruebas y build se ejecutaron correctamente con el entorno existente.
4. La auditoría inicial detectó `effect@3.20.0` a través de `@prisma/config`. Se fijó `effect@3.22.5` mediante un override acotado a ese paquete. La configuración Prisma y el build se volvieron a comprobar y la auditoría final reportó cero vulnerabilidades. [Aviso y corrección desde 3.22.1](https://github.com/advisories/GHSA-7589-6fvf-x4pw).
5. El arranque usa el servidor standalone y carga `.env.local` explícitamente con Node. Los assets estáticos se copian al finalizar el build; no se copian secretos dentro del artefacto por ese script.

## Límites actuales

El modo demo permite verificar interfaz y cotización sin Neon. El seed requiere una base de desarrollo y confirmación explícita. La imagen Docker necesita un motor activo. Mercado Pago, Correo y la autenticación administrativa real son integraciones pendientes. La tienda no recibe ventas, y los pedidos del seed son exclusivamente fixtures de desarrollo.

## Administración del 23 de noviembre de 2026

- Clerk 7.10.7 instalado con peers compatibles. Claves y lista ADMIN_USER_IDS todavía pendientes, comprobadas sin mostrar valores.
- TypeScript, lint y build aprobados. El build incluye proxy condicional y ruta /admin/ingresar/[[...rest]].
- npm test: trece pruebas aprobadas, incluyendo autorización por ID exacto, importes decimales y entradas administrativas inválidas.
- Cinco comprobaciones con Prisma sobre PGlite efímero: guardado con auditoría y movimiento, rechazo de versión antigua, rechazo de stock inferior a reservas, rechazo de variante ajena y rollback de producto/stock/movimiento ante fallo de auditoría. No se utilizaron datos reales.
- npm audit: cero vulnerabilidades reportadas con Clerk instalado.
- env:check y db:check detectaron variables pendientes; no se intentó conectar a Neon con marcadores ni se aplicaron migraciones remotas.
- Editor demo verificado en navegador: cambio de nombre y precio decimal, guardado, recarga, recuperación y descarte. Sin errores de consola en la instancia de producción local de prueba, puerto 3002; esa instancia se cerró al terminar.
- Se reutilizó para inspección HTTP el servidor de desarrollo ya existente del proyecto, sin detenerlo. La comprobación de formularios se aisló en producción local después de observar envío nativo antes de que el editor estuviera interactivo. Se deshabilitó el envío hasta la hidratación y se fijó método POST para evitar campos en la URL.
- Captura nueva: [editor administrativo](capturas/panel-editor.jpg).

El login externo de Clerk, la autorización con una cuenta real y el guardado en Neon no se consideran verificados. Ya existe su implementación; se validarán cuando el titular complete la configuración. La guía CONFIGURAR_NEON_CLERK.md describe los pasos y los comandos que no revelan secretos.
