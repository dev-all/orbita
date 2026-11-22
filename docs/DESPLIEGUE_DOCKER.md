# Desplegar la tienda con Docker y un VPS

Guía para quien empieza con Docker. La aplicación puede ejecutarse primero en la computadora y después en un VPS Linux en Argentina. La configuración inicial utiliza Neon para PostgreSQL. El despliegue comercial se habilitará cuando estén completas las integraciones y condiciones de la [guía central](../GUIA_CENTRAL.md).

## Conceptos básicos

Una imagen es un paquete de aplicación y dependencias. Un contenedor es una ejecución de esa imagen. Docker Compose reúne la configuración para iniciar los servicios. El repositorio y las migraciones se conservan en Git; los secretos y datos no se guardan dentro de la imagen.

`Dockerfile` compila Next.js en modo standalone y ejecuta el servidor con un usuario sin privilegios. `compose.yaml` inicia la aplicación; el servicio de migraciones se ejecuta manualmente. `compose.postgres.yaml` es una alternativa de base local que no se inicia por defecto.

## Estado de Docker en esta computadora

Se detectó el cliente Docker 20.10.17. La consulta al servidor indicó que el motor no estaba disponible en la tubería `docker_engine`. Tener instalado el comando no significa que Docker Desktop esté iniciado. No se modificó la configuración global ni se inició o actualizó Docker Desktop automáticamente.

Antes de probar contenedores, abrir Docker Desktop y esperar a que el motor esté listo. Verificar que se usan contenedores Linux. Si Docker solicita actualizar su instalación o habilitar WSL, revisar ese cambio de sistema antes de aceptarlo. La versión instalada del cliente es antigua; comprobar compatibilidad con el motor y Compose actuales antes del uso real.

## Verificar Docker

En una terminal PowerShell nueva:

```powershell
docker version
docker compose version
```

El primer comando debe mostrar tanto Client como Server. El segundo debe reconocer Compose. Si falla, resolver el arranque de Docker Desktop o la instalación de Compose antes de continuar. Para desarrollar la tienda localmente no es obligatorio resolverlo: `npm run dev` funciona sin contenedores.

## Primera prueba con catálogo ficticio

1. Abrir una terminal en el proyecto.
2. Si no existe `.env.local`, copiar `.env.example`. Mantener `CATALOG_SOURCE=demo`.
3. Construir e iniciar:

```powershell
cd E:\2026\Ecommerce
docker compose build app
docker compose up -d app
docker compose ps
docker compose logs --tail 100 app
```

4. Abrir `http://localhost:3000` y comprobar `/api/health`.

```powershell
Invoke-RestMethod http://localhost:3000/api/health
```

Compose publica el puerto solo en `127.0.0.1`. Esta primera prueba no publica la tienda en Internet. `health` verifica el proceso HTTP, no demuestra que PostgreSQL ni pagos funcionen.

Para detenerla conservando archivos y datos:

```powershell
docker compose stop app
```

El comando de build descarga imágenes y dependencias y requiere acceso a Internet. `.dockerignore` excluye todos los archivos `.env`; `env_file` inyecta los valores al ejecutar, no al compilar. Las futuras variables `NEXT_PUBLIC_` que realmente se usen en componentes cliente requerirán planificar su disponibilidad en build, porque Next.js las incorpora al JavaScript público.

## Usar Neon desde el contenedor

Completar las conexiones de desarrollo en `.env.local` como se indica en el README. Aplicar migraciones usando la imagen de herramientas:

```powershell
docker compose --profile tools build migrate
docker compose --profile tools run --rm migrate
```

El seed se ejecuta fuera del contenedor de producción, siguiendo el README, con confirmación explícita y una base de desarrollo. No bajar las protecciones para sembrar datos ficticios en una base comercial.

Después de cargar los datos, definir `CATALOG_SOURCE=database` y recrear la aplicación:

```powershell
docker compose up -d --force-recreate app
```

No es necesario instalar PostgreSQL en el VPS si se conserva Neon. Revisar la región de Neon: la aplicación puede estar en Argentina mientras la base de datos está en otro país.

## Base PostgreSQL local opcional

Este paso es opcional y no cambia la elección de Neon. Usarlo solo si se necesita desarrollar sin base remota.

```powershell
# Sustituir el marcador por una contraseña local elegida por vos.
$env:POSTGRES_PASSWORD = 'REEMPLAZAR_CON_CONTRASENA_LOCAL'
docker compose -f compose.postgres.yaml up -d
docker compose -f compose.postgres.yaml ps
```

La conexión de una aplicación que corre en Windows usa `localhost:5432`. Si la aplicación también corre en un contenedor, `localhost` representa ese contenedor; será necesario configurar la red y el host de base de datos apropiados. No copiar sin cambios la conexión de Windows a un contenedor.

El volumen `orbita_pgdata` conserva los datos al detener PostgreSQL. No utilizar comandos que borren volúmenes si se quieren conservar. Nunca exponer 5432 públicamente.

## Preparar el VPS de producción

Cuando se elija proveedor y dominio, verificar antes de ejecutar comandos:

- Linux compatible y Docker Engine con Compose disponibles.
- Usuario de despliegue, acceso SSH por clave y actualizaciones del sistema.
- Puerto 3000 accesible solo desde el propio servidor; acceso público mediante HTTPS en 443.
- Dominio apuntando al VPS y proxy Caddy o Nginx con certificado TLS.
- Base de producción separada, almacenamiento de imágenes, copias externas y monitoreo.

La instalación del motor, reglas de firewall y configuración de SSH modifican el sistema. Esta guía no las ejecuta ni presupone un proveedor. Se documentarán los comandos concretos al conocer el sistema y los accesos.

## Secuencia de publicación

1. Revisar los criterios de lanzamiento de la guía central.
2. Seleccionar un commit o etiqueta conocida; conservar la versión anterior.
3. Hacer y verificar un backup antes de migraciones de datos.
4. Copiar el código al VPS mediante Git y preparar `.env.local` allí, con permisos restrictivos y sin subirlo al repositorio.
5. Compilar las imágenes de aplicación y herramientas.
6. Ejecutar `docker compose --profile tools run --rm migrate` una sola vez.
7. Iniciar `docker compose up -d app` y comprobar estado, logs y `/api/health`.
8. Probar catálogo de producción, autenticación, compra, webhook y envío desde el dominio HTTPS.
9. Habilitar tráfico comercial después de esa validación.

No ejecutar `prisma migrate dev`, `db push` ni el seed de muestra en producción. Si una migración falla, diagnosticar antes de repetirla o iniciar la aplicación nueva.

## Backups y recuperación

Guardar los backups de PostgreSQL fuera del VPS, cifrados y con acceso limitado. Un volumen Docker conserva datos ante reinicios, pero no es un backup. La frecuencia y retención deben elegirse según las ventas y la pérdida máxima de datos aceptable. Probar restauración en una base aislada antes de operar.

Un rollback de imagen no revierte una migración. Las migraciones deben conservar compatibilidad con la versión anterior cuando sea posible; documentar la recuperación antes de cambios destructivos. Al migrar de Neon a PostgreSQL propio, realizar exportación/restauración, una ventana de corte de escrituras y reconciliación de pedidos y pagos; cambiar solo `DATABASE_URL` no transfiere los datos.

## Verificaciones pendientes

La construcción y ejecución real de la imagen Docker requieren un motor activo. El estado actualizado de las pruebas está en [validaciones](VALIDACIONES.md). La guía no implica que exista un VPS contratado ni una tienda publicada.

Referencias: [Next.js standalone](https://nextjs.org/docs/app/api-reference/config/next-config-js/output), [Docker Compose](https://docs.docker.com/compose/), [Neon](https://neon.com/pricing).
