# Órbita tienda

Primera base funcional de una tienda propia para Argentina. Órbita es una identidad provisional. Incluye veinte productos ficticios, cuarenta variantes, filtros, carrito persistente, cotización simulada y una vista administrativa de solo lectura.

## Arrancar en Windows

Requisitos: Node.js 24 LTS, npm y Git. Docker es opcional para el desarrollo inicial.

```powershell
cd E:\2026\Ecommerce
npm ci
Copy-Item .env.example .env.local
npm run db:generate
npm run dev
```

Si `.env.local` ya existe, conservarlo en lugar de copiar encima. Abrir la URL Local que imprima Next.js, normalmente `http://localhost:3000`. Por defecto el catálogo proviene de un archivo de demostración; no requiere cuentas ni conexión a PostgreSQL. Los datos ficticios son los mismos que usa el seed.

## Qué funciona

- Catálogo de veinte productos, búsqueda, filtros y ordenamiento.
- Ficha con variantes y disponibilidad de stock propio o bajo pedido.
- Carrito con persistencia local y cantidades limitadas por variante.
- Revisión en servidor de cantidades, disponibilidad y precios del catálogo.
- Simulación del envío, sin recopilar datos personales ni cobrar.
- Vista `/admin` de inventario ficticio, solo lectura.
- Modelo Prisma, migración inicial y seed protegido para PostgreSQL.
- Exportación CSV con cuarenta variantes y plantilla de catálogo real.
- Configuración standalone, Docker y guías de despliegue.

## Qué sigue pendiente

La aplicación todavía no está habilitada para ventas. Faltan autenticación y edición administrativa, reservas transaccionales y vencimientos, creación de pedidos reales, integración de Mercado Pago, validación del webhook, Correo Argentino real, correos, facturación, políticas y catálogo comercial. El endpoint de Mercado Pago devuelve 503 deliberadamente: no afirma haber procesado una notificación.

No se entrega una integración falsa ni se usa un botón de pago decorativo. En modo `database`, el checkout y la administración real permanecen bloqueados hasta implementar esas funciones.

## Conectar Neon Free

1. Crear un proyecto de desarrollo en Neon y obtener sus conexiones. No usar la base de producción.
2. Completar `DATABASE_URL` con la conexión pooled y `DIRECT_URL` con la conexión directa del mismo proyecto. Mantener los parámetros TLS provistos por Neon.
3. Mantener `APP_ENV=development` y ejecutar:

```powershell
npm run db:deploy
$env:SEED_DEMO = 'CONFIRM_DEVELOPMENT'
npm run db:seed
Remove-Item Env:SEED_DEMO
```

4. Cambiar `CATALOG_SOURCE=database` en `.env.local` y reiniciar el servidor para leer el catálogo de PostgreSQL.

El seed crea registros ausentes y conserva los existentes. No es un comando para actualizar precios ni restaurar inventario. Los fixtures incluyen un proveedor, un cliente con correo `example.test` y tres pedidos ficticios; no tienen relación con pagos reales.

## Comandos

| Comando | Resultado |
| --- | --- |
| `npm run dev` | Servidor de desarrollo |
| `npm run typecheck` | Generar cliente Prisma y tipos Next; comprobar TypeScript estricto |
| `npm run lint` | ESLint de Next.js y TypeScript |
| `npm test` | Pruebas de validación y cotización |
| `npm run build` | Generar cliente y compilar producción |
| `npm start` | Servir el build en el host |
| `npm run db:deploy` | Aplicar migraciones ya versionadas |
| `npm run db:migrate -- --name cambio` | Crear una migración en desarrollo |
| `npm run db:seed` | Cargar muestra con controles de entorno y confirmación |
| `npm run catalog:export` | Exportar catálogo ficticio y plantilla CSV a `data/` |

Se eligió npm para este proyecto nuevo y se versiona un único `package-lock.json`. No se reutilizaron los lockfiles del repositorio de referencia.

## Documentos

- [Guía central y Gantt](GUIA_CENTRAL.md)
- [Despliegue con Docker y VPS](docs/DESPLIEGUE_DOCKER.md)
- [Propuestas iniciales de marca](docs/MARCA.md)
- [Validaciones y estado técnico](docs/VALIDACIONES.md)

## Git

`main` conserva el punto inicial documentado y `feat/local-setup` contiene el desarrollo. No hay remoto propio configurado. Cuando exista:

```powershell
git remote add origin URL_DE_TU_REPOSITORIO
git push -u origin main
git push -u origin feat/local-setup
```

Reemplazar el marcador antes de ejecutar. Los secretos se guardan en archivos `.env` ignorados por Git. No subirlos al remoto ni incluirlos en una imagen Docker.
