# Continuar Órbita en otra computadora

Estado del proyecto al 25 de noviembre de 2026. Repositorio: [dev-all/orbita](https://github.com/dev-all/orbita). El código funcional de referencia está en el commit `330e866`; los commits posteriores pueden incluir esta documentación o nuevos avances. Usar siempre el estado actual de Git como fuente de verdad.

La tienda tiene un catálogo inicial y un panel preparado. Neon ya contiene las tablas y los datos de prueba. Para cambiar de computadora hay que clonar el código, instalar sus dependencias y volver a configurar las variables locales. No hay que crear otra base ni volver a cargar los seeds.

## Qué se transfiere

| Elemento | Cómo se recupera |
| --- | --- |
| Código, migraciones y documentación | Clonar GitHub |
| Productos y pedidos de prueba | Siguen en el mismo proyecto de Neon |
| Variables y claves | Completar localmente desde los paneles de los proveedores |
| Borradores del panel y carrito | Son locales al navegador; no viajan con Git ni Neon |
| Dependencias y archivos compilados | Generar de nuevo en la otra PC |
| Historial de esta conversación | No se incluye en el repositorio; usar el prompt de continuidad |

## Preparar la otra computadora

Instalar Git y Node.js 24 LTS. La computadora original utilizó Node 24.20.0 y npm 11.19.0. Mantener las versiones del proyecto indicadas en `package.json` y `package-lock.json`; no actualizar todas las dependencias al empezar. Docker es opcional para esta etapa y no hace falta instalar PostgreSQL local.

En PowerShell:

```powershell
node --version
npm --version
git --version
```

Si GitHub solicita iniciar sesión para clonar, usar el flujo normal de Git Credential Manager. No escribir un token en la URL ni incluirlo en el prompt.

## Clonar e instalar

Este ejemplo utiliza una carpeta nueva. Si ya existe una copia con trabajo, revisar su estado antes de utilizarla y no sobrescribirla.

```powershell
New-Item -ItemType Directory -Force C:\proyectos | Out-Null
Set-Location C:\proyectos
git clone https://github.com/dev-all/orbita.git
Set-Location orbita
git status --short --branch
git log -3 --oneline
npm ci
npm run db:generate
```

`npm ci` utiliza el lockfile existente. No copiar `node_modules`, `.next` ni la carpeta `.git` desde la computadora anterior. La primera instalación puede tardar; en la computadora original se detectó lentitud del disco E:.

## Configurar las variables locales

En una clonación nueva:

```powershell
Copy-Item .env.example .env.local
notepad .env.local
```

Si `.env.local` ya existe, editarlo sin reemplazarlo por la plantilla. Se puede utilizar otro editor local. Las claves se obtienen de los paneles de los proveedores o de un gestor de secretos privado; no se pegan en ChatGPT, GitHub, capturas o documentos compartidos.

Completar las siguientes variables:

| Variable | Configuración |
| --- | --- |
| `DATABASE_URL` | Conexión pooled del mismo proyecto, rama, base y usuario de Neon |
| `DIRECT_URL` | Conexión directa del mismo destino, con Connection pooling desactivado al copiar |
| `CATALOG_SOURCE` | `database`, para leer los datos ya cargados en Neon |
| `APP_ENV` | `development` |
| `DATABASE_IPV4_ONLY` | Empezar con `false`; usar `true` si se reproduce el ETIMEDOUT de selección IPv4/IPv6 |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000`, o el puerto local utilizado |
| `SHIPPING_ORIGIN_POSTAL_CODE` | `1643`, origen informado por el titular, pendiente de comprobación logística |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Completar cuando se configure la aplicación Development de Clerk |
| `CLERK_SECRET_KEY` | Clave secreta de esa misma aplicación de Clerk |
| `ADMIN_USER_IDS` | IDs de Clerk autorizados, separados por comas, cuando existan los usuarios |

Neon: se está utilizando por decisión del titular la rama llamada **production como desarrollo inicial**. El nombre no significa que haya una tienda operativa. Conservar los parámetros TLS de las conexiones. La solución local de IPv4 no desactiva TLS ni cambia el firewall del sistema.

Clerk estaba pendiente en el último estado verificado. Dejar sus claves vacías hasta obtenerlas; no inventar valores. Mercado Pago, Correo Argentino y WhatsApp también tienen marcadores pendientes: no hacen falta para comprobar el catálogo y no se procesan ventas reales.

Alternativa para revisar diseño sin conectarse a servicios: `CATALOG_SOURCE=demo`. En ese modo, el panel guarda borradores solo en el navegador y no modifica Neon.

## Comprobar conexión y arrancar

```powershell
npm run db:check
npm run env:check
npm run dev
```

`db:check` consulta la conexión y la presencia de tablas sin imprimir credenciales. `env:check` devuelve salida 1 si faltan claves o IDs de Clerk; esto puede ser esperado mientras Clerk esté pendiente y no significa que Neon esté fallando.

Abrir la URL Local que imprima Next.js, normalmente [localhost:3000](http://localhost:3000).

- `/`: catálogo.
- `/productos/platos-playos-alba`: producto de muestra.
- `/admin`: editor demo o acceso protegido, según el modo.
- `/admin/ingresar`: inicio de sesión de Clerk cuando esté configurado.

En modo database, el panel debe permanecer protegido si falta Clerk. No desactivar la autorización para entrar. Para terminar la configuración, seguir [Neon y Clerk](CONFIGURAR_NEON_CLERK.md).

## Verificaciones del proyecto

Detener `npm run dev` con Ctrl+C antes de comprobar tipos y build. Ejecutar secuencialmente:

```powershell
npm run typecheck
npm run lint
npm test
npm run build
```

No ejecutar desarrollo y build al mismo tiempo: ya se observó un conflicto con los tipos generados en `.next/dev/types`. Las últimas validaciones del código funcional aprobaron trece pruebas automáticas, tipos, lint y build; volver a comprobarlos en la nueva máquina permite detectar diferencias de entorno.

## Conservar la base existente

Las tres migraciones y el seed ya se aplicaron en Neon. Se verificaron veinte productos, cuarenta variantes y tres pedidos ficticios, además de un cliente y un proveedor de prueba.

No ejecutar `db:seed`, `migrate reset`, `db push` ni recrear la base para cambiar de PC. Si faltan tablas, primero comprobar que ambas URL corresponden a la base correcta. Aplicar nuevas migraciones únicamente cuando el desarrollo lo requiera y después de revisar su contenido.

## Trabajar entre las dos computadoras

Al comenzar en una copia ya existente:

```powershell
git status --short --branch
git pull --ff-only
```

Si hay cambios locales, conservarlos antes de actualizar. Si Git indica divergencia, revisar los commits sin usar reset o force push para resolverla automáticamente.

Para un nuevo trabajo desde un main limpio y actualizado:

```powershell
git switch -c feat/siguiente-hito
```

Al cerrar un avance, revisar los archivos y diferencias, hacer un commit de los cambios concretos y subir esa rama. Las variables locales permanecen fuera de Git. No editar simultáneamente la misma rama desde ambas computadoras sin sincronizar.

Recordar que ambas computadoras sí comparten los datos de Neon: una edición real del catálogo desde un panel autorizado será visible en las dos.

## Continuar en ChatGPT o Codex

Abrir la carpeta clonada como proyecto en Codex y pegar el contenido de [PROMPT_CONTINUIDAD.md](PROMPT_CONTINUIDAD.md). Una sesión de ChatGPT sin acceso a archivos puede orientar, pero no inspeccionar ni ejecutar el proyecto local; en ese caso, utilizar Codex o una sesión con herramientas para el repositorio.

El prompt no contiene secretos. La nueva sesión debe inspeccionar el estado actual antes de cambiar archivos o asumir que las cuentas externas están configuradas.
