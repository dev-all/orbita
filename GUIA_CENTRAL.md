# Guía central de la tienda y plan de lanzamiento

Actualización: 23 de noviembre de 2026. Estado: primera implementación local en curso; ventas deshabilitadas.

Crear una tienda propia para Argentina con Next.js y PostgreSQL, empezando con veinte productos de bazar para Navidad. El objetivo es completar primero una compra confiable y administrar pedidos e inventario desde un único panel. La marca debe permitir incorporar ferretería y tecnología después.

Esta guía concentra decisiones, alcance, dependencias y trabajo futuro. Las fechas son una propuesta de organización, no una fecha de entrega comprometida. Cada tarea se marcará completada únicamente cuando exista su resultado verificable. Consultar el estado real del primer hito al final de esta guía.

## Decisiones del negocio

| Tema | Definición | Estado |
| --- | --- | --- |
| Mercado | Argentina; moneda ARS | Confirmado |
| Marca | Nombre, logo y paleta moderna y profesional | Pendiente |
| Catálogo inicial | Veinte productos de bazar con campaña navideña | Confirmado |
| Variantes | Color, tamaño, capacidad o cantidad por juego según producto | Contempladas |
| Abastecimiento | Stock propio y productos que se compran al proveedor por pedido | Confirmado |
| Despacho | San Miguel, Buenos Aires; código postal informado por el usuario: 1643 | Verificar correspondencia con domicilio antes de cotizar |
| Entregas | Reparto a domicilio y envíos nacionales | Confirmado; tarifas y zonas pendientes |
| Atención presencial | Sin local abierto al público | Confirmado; no ofrecer retiro público por defecto |
| Cobros | Mercado Pago | Confirmado; cuentas y credenciales pendientes |
| Facturación | Definir circuito con responsable contable | Pendiente antes de operar |
| WhatsApp | Contacto y registro manual de pedidos en el panel | Primera versión propuesta |
| Mercado Libre | Integración y sincronización automáticas después del lanzamiento | Confirmado |
| Redes sociales | Canal de marketing | Contenido, cuentas y campañas pendientes |
| Desarrollo | Neon Free; aplicación local. Vercel Hobby condicionado a uso personal no comercial | Ver sección de entornos |

## Arquitectura propuesta

- Next.js 16 con App Router, React 19 y TypeScript estricto. Seleccionar versiones estables con parches de seguridad vigentes al instalar.
- Tailwind CSS v4 y componentes shadcn/ui para interfaz adaptable a teléfonos.
- PostgreSQL en Neon con Prisma y migraciones versionadas.
- Zod para validar datos recibidos por el servidor.
- Zustand para el carrito; el servidor vuelve a calcular importes y disponibilidad.
- Clerk como opción inicial para administradores; autorización por rol comprobada en servidor. Compra como invitado.
- Mercado Pago mediante una capa de integración, con credenciales separadas por ambiente.
- Correo Argentino mediante un adaptador que permita desarrollar con respuestas de prueba.
- Imágenes fuera de PostgreSQL: archivos locales de demostración al comenzar; almacenamiento de objetos por definir antes de publicar el catálogo real.
- Correo transaccional y monitoreo por definir antes de producción.

El repositorio de Sonny Sangha queda como referencia funcional. No se clonará ni reutilizará su código como base comercial bajo este plan; su licencia y hallazgos técnicos quedaron identificados en la auditoría previa.

## Entornos y planes gratuitos

### Desarrollo sin gasto de infraestructura

Ejecutar Next.js en la computadora y conectar a Neon Free. Usar únicamente datos ficticios, claves de prueba y un dataset de demostración. No es necesario contratar Vercel para desarrollar.

Neon publica un plan Free de USD 0 con 100 CU-horas mensuales por proyecto y 1 GB de almacenamiento PostgreSQL por proyecto. Es una capacidad inicial adecuada para probar veinte productos, según el volumen de uso; revisar consumos y límites antes de habilitar integraciones continuas. Las imágenes no se guardarán como binarios en la base de datos.

Fuente: [planes de Neon](https://neon.com/pricing), consultados el 22 de noviembre de 2026.

### Vercel y la condición de uso comercial

Vercel Hobby está restringido al uso personal no comercial. Un despliegue destinado al negocio no se considera automáticamente permitido porque sea de desarrollo, esté oculto o todavía no cobre. Hobby solo se contempla para un prototipo personal no comercial que cumpla sus condiciones; para desplegar el desarrollo comercial, utilizar Pro o confirmar expresamente la elegibilidad con Vercel.

La decisión para avanzar sin gasto es desarrollo local más Neon Free, manteniendo la aplicación preparada para Vercel. No se contratarán planes ni se crearán despliegues como parte de esta documentación.

Fuentes: [Hobby](https://vercel.com/docs/plans/hobby), [uso permitido](https://vercel.com/docs/limits/fair-use-guidelines), [condiciones de Vercel](https://vercel.com/legal/terms).

### Separación de datos

Desarrollo y producción tendrán conexiones y secretos separados. Los previews no deben apuntar a pedidos reales. El seed con pedidos ficticios debe rechazar explícitamente su ejecución en producción. Un backup independiente y su restauración se verificarán antes de ventas reales; una rama de base de datos no sustituye un backup.

## Alcance de la primera versión

1. Portada, categorías, colección de Navidad, buscador y filtros básicos.
2. Producto con imágenes, variantes, precio, disponibilidad y plazo de preparación.
3. Carrito y checkout como invitado con validación del servidor.
4. Cotización de entrega según origen, destino y paquete, cuando exista acceso al proveedor; tarifas simuladas claramente identificadas solo en desarrollo.
5. Mercado Pago con estados pendiente, aprobado y rechazado, además de conciliación y manejo de notificaciones repetidas.
6. Confirmación de compra y consulta del pedido mediante un mecanismo seguro, sin exponer datos por un identificador predecible.
7. Administración de productos, variantes, proveedores, existencias, pedidos y preparación de envíos.
8. Registro manual de pedidos de WhatsApp con el mismo inventario y una referencia de pago verificable. Abrir WhatsApp no crea una venta ni reserva stock.
9. Política de privacidad, condiciones de compra, entregas, cambios y devoluciones adecuadas al negocio, revisadas antes de publicar.

Mercado Libre automático, IA y automatización fiscal no forman parte de la primera versión. El circuito de facturación sí debe estar definido para operar aunque inicialmente sea manual.

## Stock propio y compra al proveedor

Cada variante tendrá un SKU único y una política de abastecimiento. En una primera versión, la compra al proveedor se organizará con recepción y despacho desde San Miguel; el despacho directo del proveedor se deja para otra etapa.

| Modalidad | Disponibilidad | Flujo previsto | Condición para vender |
| --- | --- | --- | --- |
| Stock propio | Unidades físicas menos reservas vigentes | Reservar al iniciar el pago; confirmar salida al aprobar; liberar al vencer o cancelar según estado conciliado | Existencias suficientes |
| Bajo pedido | Disponibilidad confirmada del proveedor | Informar plazo; confirmar proveedor y precio antes de habilitar el cobro; registrar compra y recepción | No publicar disponibilidad ilimitada ni cobrar sin confirmación |
| Mixta | Prioridad a stock físico; excedente bajo pedido si está habilitado | Calcular por variante y cantidad; mostrar el plazo mayor del carrito | Confirmar todos los artículos antes de cobrar |

El panel registrará proveedor, SKU del proveedor, costo de referencia, fecha de confirmación y plazo estimado. La tienda mostrará disponibilidad y plazos de manera explícita.

Precio, nombre, variante y condiciones de entrega se conservarán en el pedido como fotografía de la compra. Los importes se almacenarán en centavos. Los eventos de pago repetidos no deben duplicar pedidos, cobros registrados ni movimientos de stock.

La estrategia de reservas debe contemplar pagos pendientes, vencimiento y aprobaciones tardías. Si un pago se aprueba cuando el stock ya no está reservado, el pedido pasa a revisión para resolver abastecimiento o devolución, sin prometer disponibilidad inexistente.

## Datos iniciales de demostración

El seed de catálogo se implementará con claves estables y operaciones repetibles para evitar duplicados. Un seed separado cargará escenarios de clientes, pedidos y pagos solo en desarrollo. Los datos reales nunca se reemplazarán silenciosamente al repetir una carga.

### Veinte productos propuestos

| SKU base | Producto de muestra | Variante orientativa |
| --- | --- | --- |
| BAZ-001 | Juego de platos playos | Color y cantidad por juego |
| BAZ-002 | Juego de platos de postre | Color y cantidad por juego |
| BAZ-003 | Juego de bowls | Capacidad y color |
| BAZ-004 | Fuente rectangular | Tamaño |
| BAZ-005 | Ensaladera | Capacidad |
| BAZ-006 | Bandeja para servir | Tamaño y color |
| BAZ-007 | Tabla para picada | Tamaño |
| BAZ-008 | Juego de vasos | Capacidad y cantidad |
| BAZ-009 | Juego de copas | Capacidad y cantidad |
| BAZ-010 | Jarra para bebidas | Capacidad |
| BAZ-011 | Botella para agua | Capacidad y color |
| BAZ-012 | Juego de cubiertos | Cantidad de piezas |
| BAZ-013 | Mantel para mesa | Medida y color |
| BAZ-014 | Camino de mesa navideño | Medida y diseño |
| BAZ-015 | Juego de individuales | Color y cantidad |
| BAZ-016 | Servilletas de tela | Color y cantidad |
| BAZ-017 | Aros para servilletas | Color y cantidad |
| BAZ-018 | Azucarera | Capacidad y color |
| BAZ-019 | Frasco hermético | Capacidad |
| BAZ-020 | Recipiente para alimentos | Capacidad |

Las variantes generan SKU propios. Los veinte productos padre no equivalen a veinte unidades ni necesariamente a veinte variantes.

Cada registro contendrá descripción, categoría, slug, imágenes ilustrativas, precio ARS, stock ficticio, política de abastecimiento, peso y medidas de paquete de prueba. Ningún precio, certificación, material o disponibilidad de muestra se publicará como dato real sin validación.

También se incluirán casos de stock agotado, bajo pedido, carrito mixto, pago pendiente/rechazado/aprobado, notificación duplicada y envío no disponible. Se entregará una plantilla CSV para completar catálogo real y reglas de importación sin secretos ni datos personales innecesarios.

## Cronograma propuesto tipo Gantt

S1: 23 al 29 de noviembre. S2: 30 de noviembre al 6 de diciembre. S3: 7 al 13 de diciembre. S4: 14 al 20 de diciembre de 2026. Posterior: después de estabilizar la tienda. La puesta en marcha depende del catálogo real, medios de cobro, logística y facturación; no queda comprometida una fecha de apertura.

Leyenda: **■** trabajo previsto; **◆** hito condicionado a validación. El Gantt representa la planificación; el estado de implementación se registra por separado al final de la guía.

| ID | Frente | S1 | S2 | S3 | S4 | Posterior | Depende de |
| --- | --- | :---: | :---: | :---: | :---: | :---: | --- |
| T01 | Nombre, paleta y propuesta visual | ■ | | | | | Decisión del titular |
| T02 | Proyecto, Git, versiones y entornos | ■ | | | | | Plan de despliegue |
| T03 | Modelo de datos y migraciones | ■ | ■ | | | | Reglas de abastecimiento |
| T04 | Seeds y plantilla de catálogo | ■ | ■ | | | | T03 |
| T05 | Catálogo, producto, variantes y carrito | | ■ | ■ | | | T01, T03, T04 |
| T06 | Panel y pedidos de WhatsApp | | ■ | ■ | | | T03, autenticación |
| T07 | Mercado Pago y conciliación | | ■ | ■ | | | Credenciales y T03 |
| T08 | Correo y reglas de reparto local | ■ | ■ | ■ | | | CP, paquetes y acceso API |
| T09 | Catálogo real y circuito de facturación | ■ | ■ | ■ | | | Titular y proveedores |
| T10 | Compra completa, reservas y pruebas | | | ■ | ■ | | T05 a T09 |
| T11 | Apertura controlada | | | | ◆ | | Criterios de lanzamiento |
| T12 | Correcciones y seguimiento | | | | ■ | ■ | T11 |
| P01 | Sincronización con Mercado Libre | | | | | ■ | Inventario estable y acceso API |
| P02 | Marketing y medición avanzada | | | | | ■ | Marca y eventos validados |
| P03 | Automatización de facturación | | | | | ■ | Circuito fiscal definido |
| P04 | Agentes e IA | | | | | ■ | Catálogo y permisos confiables |

Este cronograma contempla tareas en paralelo cuando no dependen entre sí; no implica agentes adicionales ni trabajo ya ejecutado. Si falta una credencial, el adaptador se desarrolla con pruebas simuladas y su validación real permanece pendiente.

## Trabajo posterior al lanzamiento

| ID | Trabajo | Resultado esperado | Prioridad |
| --- | --- | --- | --- |
| P01 | Mercado Libre: autorización, vínculo SKU-publicación, variantes, notificaciones, sincronización y conciliación | Ventas y existencias consistentes, con reintentos y manejo de conflictos | Alta |
| P02 | Campañas en redes, enlaces medibles, catálogo social y consentimiento para analítica | Atribuir visitas y compras sin duplicar eventos | Alta |
| P03 | Integración de facturación y conciliación contable | Emisión y seguimiento según circuito validado | Alta |
| P04 | Asistente de productos y consultas seguras de pedidos | IA con permisos, límites de costo y evaluación | Media |
| P05 | Cuenta de cliente y recuperación de carritos | Historial seguro y comunicaciones autorizadas | Media |
| P06 | Automatización de compras al proveedor y despacho directo | Disponibilidad y plazos sincronizados por origen | Media |
| P07 | Etiquetas y seguimiento automático de Correo | Operación de despacho con menos carga manual | Media |
| P08 | Ferretería y tecnología | Nuevos atributos, garantías, categorías y contenido real | Según negocio |
| P09 | Capacidad, recuperación y monitoreo ampliados | Responder al volumen real con restauraciones comprobadas | Según uso |

Hasta integrar Mercado Libre, registrar sus ventas manualmente en el panel o separar un cupo de inventario para ese canal. No asumir que la tienda detectará ventas externas automáticamente.

## Condiciones para lanzar

- [ ] Marca y dominio elegidos; revisión de disponibilidad realizada.
- [ ] Veinte productos reales revisados: fotos autorizadas, variantes, precios, stock, paquetes y plazos.
- [ ] Código postal y origen de despacho confirmados con el domicilio real.
- [ ] Cuenta de Mercado Pago del titular configurada; pruebas y transición a producción verificadas.
- [ ] Disponibilidad del proveedor confirmada para productos bajo pedido.
- [ ] Entrega cotizada y confirmada antes del pago; sin tarifas simuladas en producción.
- [ ] Circuito de facturación y atención de cambios/devoluciones definidos.
- [ ] Autorización administrativa, protección de datos y secretos comprobadas.
- [ ] Webhook repetido, pago pendiente, cancelación y aprobación tardía probados.
- [ ] Validación de tipos, lint y build completados, más pruebas del flujo comercial crítico.
- [ ] Hosting permitido para uso comercial y base de datos de producción separados de desarrollo.
- [ ] Backup y restauración comprobados; registros de errores disponibles.
- [ ] Seeds ficticios excluidos de producción y compra controlada de extremo a extremo validada.

## Próximas acciones

1. Elegir una dirección entre las tres [propuestas de marca](docs/MARCA.md); Órbita se usa provisionalmente en la interfaz.
2. Comprobar correspondencia del CP 1643 con el domicilio de despacho y definir reparto local.
3. Validar la primera versión local y conectar una base Neon de desarrollo.
4. Configurar y validar el acceso de Clerk y Neon; después implementar pedidos y reservas.
5. Conectar y verificar Mercado Pago, Correo y correo transaccional, sin inventar credenciales.

## Registro de decisiones

| Fecha | Decisión |
| --- | --- |
| 22 nov 2026 | Registrar San Miguel y CP 1643 como origen informado, sujeto a comprobación logística |
| 22 nov 2026 | Contemplar stock propio y compra al proveedor; no asumir despacho directo inicial |
| 22 nov 2026 | Posponer sincronización automática con Mercado Libre y documentar sus dependencias |
| 22 nov 2026 | Elegir Neon Free para desarrollo; condicionar Vercel Hobby a sus términos y mantener alternativa local gratuita |
| 22 nov 2026 | Crear esta guía como referencia central; todas las implementaciones continúan pendientes |
| 22 nov 2026 | Autorizar comienzo del desarrollo desde cero y preparación del instructivo Docker |
| 22 nov 2026 | Usar npm y un único package-lock en el proyecto nuevo; nombre Órbita provisional |

## Estado del primer hito local

| Área | Implementación | Validación |
| --- | --- | --- |
| Git | main inicial y rama feat/local-setup; sin remoto | Repositorio inicializado |
| Marca | Tres propuestas documentadas; Órbita provisional | Elección del titular pendiente |
| Catálogo | Veinte productos, cuarenta variantes, búsqueda, filtros y ficha | Ver informe técnico |
| Carrito | Persistencia local y revisión de cantidades/precios en servidor | Ver informe técnico |
| Checkout | Cotización simulada; no cobra, reserva ni crea pedidos | Prueba local; integración real pendiente |
| Administración | Editor de variantes existentes, borradores locales y guardado transaccional con auditoría | Pruebas locales aprobadas; acceso externo Clerk y Neon pendiente |
| PostgreSQL | Esquema Prisma, seed protegido y migraciones | Seed probado dos veces en PGlite efímero; Neon pendiente de conexión |
| Docker | Dockerfile, Compose e [instructivo para principiantes](docs/DESPLIEGUE_DOCKER.md) | Motor local inactivo; imagen sin validar |
| Integraciones | Clerk instalado, lista de administradores y guía de Neon; pagos bloqueados | Verificar Clerk y Neon con cuentas reales; Mercado Pago y Correo pendientes |

Los resultados concretos de los comandos y las limitaciones se conservan en [validaciones](docs/VALIDACIONES.md). El prototipo no equivale a una tienda habilitada para vender.

El primer hito pasó tipos, lint, nueve pruebas de reglas comerciales y build de producción. Se comprobaron rutas HTTP y el recorrido del carrito en escritorio y móvil. Queda mantenimiento de la cadena de lint por la compatibilidad de los plugins de Next.js con ESLint 10.

## Cómo mantener la guía

Actualizar estados, dependencias y fechas al cerrar cada hito. Registrar aquí los cambios de alcance y enlazar los documentos específicos cuando existan. No marcar una integración completa por disponer solo de un mock ni guardar claves o datos personales en esta guía.

## Segundo hito de administración

23 de noviembre de 2026: se implementó el editor de productos y variantes existentes. En demostración guarda, restaura y descarta borradores por navegador; no cambia la tienda pública. En PostgreSQL exige una sesión Clerk cuyo ID figure en ADMIN_USER_IDS, valida la versión, protege el inventario reservado y registra auditoría y movimientos en una transacción.

Trece pruebas automáticas y cinco escenarios de persistencia en PGlite efímero aprobados. El guardado y recuperación de borrador se probaron en navegador. La autenticación externa y las escrituras en Neon quedan pendientes de completar las variables locales; no se crearon cuentas ni se inventaron claves. Seguir [configuración de Neon y Clerk](docs/CONFIGURAR_NEON_CLERK.md).

La paleta actual de Órbita fue confirmada; el nombre continúa provisional. Alta de productos y variantes, imágenes, proveedores, pedidos de WhatsApp y reservas de compra siguen en el alcance pendiente de T06.
