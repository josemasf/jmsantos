---
title: "Human in the loop: prepara los pasos que un agente no debe ejecutar solo"
description: "Cómo diseñar flujos donde el agente prepara y verifica el trabajo, mientras una persona realiza acciones sensibles, externas o difíciles de revertir."
date: 2026-10-22
tags: [IA, agentes, seguridad, operaciones, automatización, infraestructura]
category: DevOps
series:
  slug: matt-pocock-skills-flujo-desarrollo
  order: 13
image:
  src: /images/blog/64-human-in-the-loop-wizard-pasos-sensibles/human-in-the-loop-wizard.png
  alt: Un asistente prepara una secuencia de pasos y documentación, una persona confirma una acción sensible y después el asistente verifica el resultado.
  width: 1536
  height: 1024
---

Delegar una tarea no significa que todas sus acciones deban ejecutarse automáticamente. Obtener una credencial, cambiar una política en un dashboard, aplicar una migración de producción o realizar un cutover puede requerir permisos, conocimiento del entorno y responsabilidad humana. Pedir al agente que «lo haga todo» en esos pasos añade riesgo y suele depender de información que no debería estar en el chat.

La skill [`wizard`](https://github.com/mattpocock/skills/tree/main/skills/engineering/wizard) está pensada para procedimientos manuales que son tediosos de hacer y de explicar una y otra vez. El agente puede preparar un asistente de terminal que guíe a la persona, abra la documentación necesaria, indique qué valor debe copiar, lo guarde en el lugar correcto y confirme cada etapa. La persona mantiene el control sobre el paso sensible; la automatización reduce la carga de coordinación.

## Identifica qué parte requiere intervención humana

Antes de escribir un wizard, separa las acciones que el agente puede realizar de aquellas que necesitan a alguien con acceso o autoridad. La skill cita aprovisionar infraestructura, configurar credenciales o secretos de CI, recorrer un dashboard externo y realizar migraciones puntuales como ejemplos posibles. No todo proceso manual justifica un wizard: si son dos pasos claros que no volverán a repetirse, un documento puede bastar.

Una etapa debe identificar el lugar donde la persona actúa, qué valor obtiene, si es secreto y dónde se almacenará. Si no se conoce la interfaz actual de un proveedor, no inventes la navegación: consulta la documentación vigente o deja visible la incertidumbre. Un script guiado solo es más seguro que una explicación si sus instrucciones son correctas y sus valores no se exponen accidentalmente.

## Diseña confirmaciones alrededor del riesgo

El flujo puede avanzar de forma incremental: agente prepara instrucciones y comprobaciones; persona ejecuta una acción sensible; agente valida el resultado antes de continuar. Las confirmaciones son especialmente importantes antes de acciones irreversibles. Los secretos deben capturarse sin mostrarlos en terminal o logs y guardarse únicamente en los destinos previstos.

La skill recomienda usar una plantilla común para evitar que cada wizard reinvente funciones de interfaz, escritura segura e idempotencia. También define límites operativos: un wizard es efímero por defecto y puede guardarse en una ruta temporal; solo se versiona si el procedimiento debe convertirse en parte repetible del proyecto. No debe ejecutarse de extremo a extremo por el agente si abre navegadores o espera entrada humana.

## Verifica el guion sin ejecutar la acción sensible

Antes de entregarlo, revisa estáticamente que cada valor que se solicita tenga un destino, que los secretos se oculten, que las acciones destructivas requieran confirmación y que los nombres de secretos coincidan con lo configurado en CI. Comprueba la sintaxis del script y explica cómo se inicia. La verificación del flujo no exige que el agente cree credenciales reales o despliegue cambios en producción.

Un wizard bien diseñado distribuye la responsabilidad: el agente aporta precisión y repetibilidad; la persona aporta autoridad, acceso y juicio en el paso que lo requiere. Así la intervención humana deja de ser una pausa improvisada y pasa a ser una frontera explícita del procedimiento.
