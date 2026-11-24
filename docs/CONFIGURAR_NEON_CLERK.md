# Conectar Neon y habilitar administración

Las credenciales se completan en `.env.local` en tu computadora. No se pegan en el chat, no se incluyen en capturas y no se guardan en Git. El panel permite probar borradores sin configurar servicios; esos cambios no modifican el catálogo público.

## Neon de desarrollo

1. Crear una cuenta y un proyecto en [Neon](https://console.neon.tech). Elegir una base o rama dedicada a desarrollo.
2. En Connect, copiar la conexión con pooling a `DATABASE_URL` y la conexión directa del mismo proyecto a `DIRECT_URL`. Conservar las opciones TLS que provee Neon.
3. Mantener `APP_ENV=development` y `CATALOG_SOURCE=demo` hasta aplicar migraciones y cargar la muestra.
4. Ejecutar desde el proyecto:

```powershell
npm run db:deploy
$env:SEED_DEMO = 'CONFIRM_DEVELOPMENT'
npm run db:seed
Remove-Item Env:SEED_DEMO
npm run db:check
```

`db:check` solo consulta la conexión y presencia de tablas. No imprime la URL, usuario, contraseña ni contenido de tablas. Si falla, no repetir migraciones sin revisar el diagnóstico. El seed no sobrescribe productos existentes y contiene pedidos ficticios, por lo que solo se usa en desarrollo.

## Clerk de desarrollo

1. Crear una aplicación Development en [Clerk Dashboard](https://dashboard.clerk.com).
2. Completar `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` y `CLERK_SECRET_KEY` con sus claves de desarrollo. No usar producción.
3. Reiniciar Next.js. Abrir `/admin/ingresar` e iniciar sesión; crear el usuario mediante el flujo configurado en Clerk si todavía no existe.
4. En Clerk Dashboard, abrir ese usuario y copiar su ID `user_…` a `ADMIN_USER_IDS` en `.env.local`. Para varios administradores, separar IDs con comas. No se autoriza automáticamente al primer usuario ni a todos los usuarios registrados.
5. Ejecutar `npm run env:check`. Muestra únicamente si cada variable está configurada; no muestra valores ni garantiza que una clave sea válida.
6. Cambiar `CATALOG_SOURCE=database` y reiniciar Next.js. Entrar a `/admin` con el usuario autorizado.

Las claves públicas de Clerk se incorporan al build: al cambiarlas, reconstruir antes de usar `npm start` o Docker. En desarrollo basta reiniciar. Los permisos se verifican en servidor al acceder y nuevamente al guardar. Ocultar botones no sustituye la autorización.

## Comportamiento del editor

- Modo demo: guarda borradores por navegador, permite restaurarlos y descartarlos; no escribe en PostgreSQL ni altera la tienda pública.
- Modo database: edita nombre, descripción, categoría, visibilidad, destacados, precios, colores, presentación, stock físico y reglas de abastecimiento de variantes existentes.
- El stock físico incluye unidades reservadas; no puede bajarse por debajo de ellas.
- Una edición sobre una versión antigua se rechaza y requiere recargar. Variantes de otro producto o repetidas no se aceptan.
- Cada guardado real registra administrador, producto y valores anteriores y posteriores en `AdminAudit`. Los ajustes físicos generan movimientos de stock, todo dentro de una transacción.

En esta etapa no se crean ni eliminan productos, variantes, proveedores o pedidos desde el panel. Tampoco se habilitan cobros reales. Esos flujos conservan sus pendientes en la guía central.

## Cuando termines

Podés avisar únicamente «variables completadas». No enviar valores. La configuración real de cuentas, el login externo y la escritura en Neon deben verificarse con tus servicios; las pruebas locales no se presentan como integración externa completada.

## Conexión verificada en este proyecto

Se utiliza por decisión del titular la rama de Neon llamada production como entorno de desarrollo inicial. Se verificó que estaba vacía antes de aplicar las tres migraciones. Se cargaron veinte productos, cuarenta variantes, un cliente ficticio, un proveedor ficticio y tres pedidos de prueba. No se cargaron ventas ni datos personales reales.

La configuración local ya utiliza CATALOG_SOURCE=database. Las claves de Clerk y ADMIN_USER_IDS siguen pendientes, por lo que el panel real permanece protegido.

En esta computadora, la autoselección IPv4/IPv6 de Node produjo ETIMEDOUT. Las conexiones directas por IPv4 con certificado TLS verificado funcionaron. DATABASE_IPV4_ONLY=true habilita un ajuste optativo de los valores de red por defecto del proceso Node. No cambia DNS ni firewall del sistema, no fija una IP de Neon y no reduce la validación TLS. La plantilla lo deja en false para otros entornos.

El seed abre la conexión antes de su transacción y permite 20 segundos de espera y hasta 120 segundos de ejecución para la carga inicial remota. No volver a ejecutar el seed para actualizar productos editados: conserva registros existentes.
