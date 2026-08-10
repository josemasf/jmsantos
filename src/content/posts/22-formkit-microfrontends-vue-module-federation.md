---
title: "FormKit: cómo llevar una plataforma de microfrontends con Vue 3 a un nivel de entrega verificable"
description: "Caso práctico de una plataforma de formularios con Vite Module Federation: configuración por entorno, pruebas con MSW y quality gates para cuatro aplicaciones."
date: 2026-06-12
tags: [Vue 3, Vite, Module Federation, microfrontends, Vitest, MSW, CI]
category: Arquitectura frontend
---

Un *spike* demuestra que una idea es posible. Un proyecto de ingeniería tiene que responder además a otras preguntas: ¿se construye de forma reproducible?, ¿puede configurarse fuera de localhost?, ¿detecta regresiones?, ¿qué ocurre cuando una dependencia introduce una vulnerabilidad?

[FormKit](https://github.com/josemasf/formkit) parte de una plataforma de formularios basada en Vue 3 y Vite Module Federation. Su estructura combina un host orquestador con tres aplicaciones remotas. El objetivo de la evolución no fue reemplazar esa arquitectura, sino convertirla en una entrega más fiable y defendible: configuración por entorno, pruebas automatizadas, controles de calidad y documentación de colaboración.

Este artículo resume las decisiones y los compromisos detrás del resultado. Los detalles y el estado de las validaciones proceden del [caso de estudio del proyecto](https://github.com/josemasf/formkit/blob/main/CASE_STUDY_ES.md).

## El punto de partida: una integración que funcionaba, pero no era aún operable

La aplicación podía renderizar formularios desde varios microfrontends, pero arrastraba problemas que son especialmente sensibles en una arquitectura federada:

- El build de producción del host no era estable.
- Las URLs de APIs de los remotos estaban fijadas a `localhost`.
- La inicialización y el envío de formularios no seguían un patrón homogéneo.
- Faltaba una verificación fiable desde la raíz del repositorio.
- CI no reunía build, test, lint, tipos y seguridad en una puerta de calidad.

No son detalles aislados. En un sistema compuesto, la confianza depende de que host, remotos, configuración y automatización funcionen como una unidad.

## La arquitectura: un host y tres remotos independientes

El host es responsable de integrar los tres remotos; cada remoto mantiene su API mock para desarrollar y probar los formularios en aislamiento.

```text
orchestrator host
  ├─ formkit-app  → json-server :3000
  ├─ formkit-app2 → json-server :4002
  └─ formkit-app3 → json-server :4003
```

Este reparto permite desplegar piezas por separado, pero introduce un contrato runtime: el host debe localizar las entradas remotas correctas y cada remoto debe conocer el endpoint que le corresponde. Por tanto, el diseño de configuración deja de ser secundario.

## 1. Estabilizar el build de federación

La salida de Module Federation usada por el host depende de *top-level await*. El build productivo fallaba porque el objetivo de compilación no estaba alineado con ese requisito.

La corrección consistió en fijar el target del host en `esnext`. Es una decisión pequeña de configuración, pero expresa un contrato importante: el artefacto generado necesita una base de navegadores moderna.

El compromiso es explícito. Se reduce ligeramente la compatibilidad con navegadores antiguos a cambio de un build determinista y compatible con el patrón de federación elegido. Si el soporte legado fuese una necesidad del producto, habría que evaluar una estrategia de carga diferente, no esconder esa limitación tras una configuración ambigua.

## 2. Llevar la configuración fuera del código

Las APIs de los remotos y las URLs de sus *remote entry* se movieron a variables de entorno, acompañadas de plantillas `.env.example`.

La diferencia práctica es notable:

| Antes | Después |
| --- | --- |
| Endpoints de desarrollo fijados en el código | URLs resueltas por entorno |
| Cambio manual para cada despliegue | Promoción entre entornos mediante configuración |
| Riesgo de publicar referencias a localhost | Contrato de runtime documentado |

Una configuración por entorno no elimina el acoplamiento entre host y remotos; lo hace visible y gestionable. Para que funcione, la matriz de URLs debe formar parte del proceso de despliegue y comprobarse en cada entorno.

## 3. Hacer predecible el envío de formularios

El flujo de submit se normalizó con dos decisiones: construir el payload de forma explícita, en lugar de mutarlo, y generar identificadores mediante `crypto.randomUUID()`.

La ventaja no es solo estética. Una construcción explícita limita efectos laterales y deja claro qué datos cruzan el límite de la aplicación. Un patrón consistente en los tres remotos reduce además la divergencia de comportamiento cuando la plataforma evoluciona.

```ts
const submission = {
  id: crypto.randomUUID(),
  ...formValues,
};
```

El ejemplo ilustra el patrón; el contrato real del payload debe seguir perteneciendo al esquema de cada formulario y a su API.

## 4. Proteger el comportamiento con pruebas

FormKit incorpora Vitest, Testing Library y MSW para probar formularios remotos. La combinación es útil porque cada herramienta cubre una responsabilidad distinta:

- **Vitest** ejecuta la suite.
- **Testing Library** favorece pruebas sobre lo que una persona usuaria puede ver y hacer.
- **MSW** simula las respuestas HTTP en el límite de red, sin acoplar los tests a la implementación interna del cliente.

El host añade una prueba de humo de router. No pretende sustituir una batería de integración completa, sino detectar que la aplicación coordinadora arranca y resuelve su navegación básica.

En microfrontends conviene evitar que los tests se conviertan en copias de la arquitectura interna. Una prueba más duradera valida que el formulario muestra su estado, acepta una entrada, envía una petición con el contrato esperado y responde bien a éxito o error.

## 5. Convertir la calidad en una puerta única

La mejora más operativa fue concentrar la verificación en scripts raíz y ejecutarla también en CI. El proyecto expone una puerta de calidad única:

```sh
pnpm run verify
```

Según el caso de estudio, esta verificación ejecuta con éxito lint y comprobación de tipos del host, build y tests de las cuatro aplicaciones, y auditoría de dependencias sin vulnerabilidades conocidas. CI replica esos controles para que un cambio no dependa de una revisión manual o de la configuración de una máquina concreta.

La idea no es que un único comando sustituya el criterio técnico. Es un punto de entrada claro que hace repetible el mínimo exigible antes de integrar una contribución.

## Seguridad y gobernanza también forman parte de la entrega

El proyecto aplica actualizaciones de lockfile y *overrides* de dependencias para mitigar vulnerabilidades conocidas, y ejecuta `pnpm audit --prod` dentro de su automatización. Esta clase de control necesita mantenimiento periódico: un override útil hoy puede crear conflictos o dejar de ser necesario cuando cambien las dependencias upstream.

Junto al código, la documentación de contribución y seguridad aclara cómo colaborar y cómo reportar incidencias. En proyectos con varias aplicaciones, esa documentación reduce decisiones implícitas y facilita que el estándar de calidad sea compartido.

## Próximos pasos razonables

El caso de estudio identifica tres evoluciones coherentes con la base actual:

1. *Contract tests* entre el host y los remotos para proteger sus límites de integración.
2. Pruebas de regresión visual para los flujos de formulario críticos.
3. Observabilidad de cliente para diagnosticar errores runtime y fallos de integración.

También sería útil documentar una estrategia de despliegue con una matriz de entornos. La configuración runtime ya prepara el terreno; falta convertirla en un procedimiento verificable de promoción.

## Conclusión

La arquitectura de microfrontends no se vuelve madura por añadir más aplicaciones remotas. Gana credibilidad cuando los contratos de build, configuración, comportamiento, dependencias y colaboración están definidos y se comprueban de forma repetible.

FormKit conserva un enfoque incremental —un host y tres remotos con formularios orientados a esquema— y refuerza precisamente esos contratos. El resultado es una plataforma más fácil de evolucionar, revisar y explicar: no solo demuestra que la integración es posible, sino cómo se mantiene bajo control.
