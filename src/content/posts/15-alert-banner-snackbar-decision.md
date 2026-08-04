---
title: "Alert, Banner o Snackbar: cuándo usar cada componente de notificación"
description: "Guía de decisión rápida para elegir el componente correcto de notificación en tu aplicación web, basada en Material Design y experiencia real."
date: 2024-02-16
tags: [UX, componentes, Material Design, Vue, frontend]
category: UX
---

Es una de las preguntas más frecuentes en desarrollo frontend: ¿debo usar un Alert, un Banner o un Snackbar para mostrar este mensaje? La respuesta parece simple, pero en la práctica muchos equipos usan estos componentes de forma intercambiable, generando una experiencia inconsistente.

Esta guía define criterios claros basados en Material Design y experiencia real.

## La regla rápida

| Componente | Cuándo usarlo | Acumulable | Acciones |
|-----------|--------------|------------|----------|
| **Alert** | Errores de la vista, cambios de estado, avisos que requieren atención | ✅ Sí | No accionable |
| **Banner** | Cambios en la aplicación, solicitudes de permisos | ❌ No | Hasta 2 acciones |
| **Snackbar** | Acción completada, avisos de poco impacto | ❌ No | Hasta 1 acción |

## Alert: "algo requiere tu atención"

Usa **Alert** cuando:
- Hay un **error en la vista** que el usuario debe conocer
- Una acción se completó parcialmente
- Hay un aviso importante que requiere atención
- El estado de algo ha cambiado

**Características**:
- Son **acumulables**: puede haber varios simultáneamente
- No son accionables (no llevan botones)
- Persisten hasta que la condición se resuelve

```vue
<v-alert type="error">
  No se pudo guardar el formulario. Revisa los campos marcados.
</v-alert>

<v-alert type="warning">
  Tu sesión expirará en 5 minutos.
</v-alert>

<v-alert type="success">
  Datos sincronizados correctamente.
</v-alert>
```

## Banner: "algo cambió en la aplicación"

Usa **Banner** cuando:
- Necesitas solicitar **permisos** al usuario
- Hay un **cambio en la aplicación** (nueva versión, mantenimiento programado)
- El mensaje **no requiere atención inmediata** pero es importante

**Características**:
- **No son acumulables**: solo uno a la vez
- Pueden tener **hasta 2 acciones** (generalmente una redirección)
- Se muestran en la parte superior de la vista

```vue
<v-banner>
  <template v-slot:text>
    Hay una nueva versión disponible de la aplicación.
  </template>
  <template v-slot:actions>
    <v-btn @click="dismiss">Más tarde</v-btn>
    <v-btn color="primary" @click="refresh">Actualizar</v-btn>
  </template>
</v-banner>
```

## Snackbar: "algo se completó"

Usa **Snackbar** cuando:
- Una **acción se completó** exitosamente
- Una **tarea finalizó** en segundo plano
- Quieres dar un **aviso de poco impacto**

**Características**:
- **No son acumulables**: solo uno a la vez
- Pueden tener **hasta 1 acción** (generalmente "Deshacer")
- Se auto-ocultan después de unos segundos
- Aparecen en la parte inferior de la pantalla

```vue
<v-snackbar v-model="show" :timeout="3000">
  Pedido guardado correctamente.
  <template v-slot:actions>
    <v-btn variant="text" @click="undo">Deshacer</v-btn>
  </template>
</v-snackbar>
```

## Árbol de decisión

```
¿El mensaje requiere atención inmediata?
├─ SÍ → ¿Es un error de la vista actual?
│  ├─ SÍ → ALERT
│  └─ NO → ¿Es un cambio a nivel de aplicación?
│     ├─ SÍ → BANNER
│     └─ NO → ALERT
└─ NO → ¿Es la confirmación de una acción?
   ├─ SÍ → SNACKBAR
   └─ NO → ¿Necesita acciones?
      ├─ SÍ → BANNER
      └─ NO → SNACKBAR
```

## Implementación simplificada

En lugar de tener múltiples sistemas de gestión de mensajes, centraliza todo en un único handler:

```typescript
// composables/useNotifications.ts
type NotificationType = 'alert' | 'banner' | 'snackbar'

interface Notification {
  type: NotificationType
  severity: 'info' | 'success' | 'warning' | 'error'
  message: string
  action?: { label: string; handler: () => void }
}

export function useNotifications() {
  const notifications = ref<Notification[]>([])

  function notify(notification: Notification) {
    if (notification.type === 'alert') {
      notifications.value.push(notification) // Acumulable
    } else {
      // Banner y Snackbar reemplazan al anterior
      notifications.value = notifications.value
        .filter(n => n.type !== notification.type)
      notifications.value.push(notification)
    }
  }

  return { notifications, notify }
}
```

## Conclusión

La diferencia entre Alert, Banner y Snackbar no es estética — es funcional. Cada uno tiene un propósito claro y usarlos correctamente hace que tu aplicación sea más predecible y profesional para el usuario.

**Regla de oro**: si dudas entre Alert y Banner, probablemente es un Alert. Si dudas entre Banner y Snackbar, probablemente es un Snackbar.
