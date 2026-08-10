---
title: "Guía completa de internacionalización (i18n) para aplicaciones web y APIs"
description: "Todo lo que debes considerar al internacionalizar una aplicación web empresarial: formatos numéricos, monedas, fechas, unidades de medida, direcciones y parámetros de localización en APIs."
date: 2026-01-09
tags: [i18n, internacionalización, frontend, API, localización]
category: Frontend
---

Internacionalizar una aplicación empresarial va mucho más allá de traducir textos. Cuando tu producto necesita dar servicio a mercados con culturas diferentes (español, anglosajón, alemán...), la lista de cosas que pueden salir mal es sorprendentemente larga.

Esta guía recopila todos los aspectos que debes revisar, con ejemplos concretos.

## 1. Formato de números

### Separadores de miles y decimales

| Cultura | Ejemplo |
|---------|---------|
| Español | 1.234,56 |
| Anglosajón | 1,234.56 |
| Alemán | 1.234,56 |

```typescript
// ✅ Usa Intl.NumberFormat
new Intl.NumberFormat('en-US').format(1234.56) // "1,234.56"
new Intl.NumberFormat('es-ES').format(1234.56) // "1.234,56"
```

**Regla de oro**: nunca formatees números manualmente con `replace()`. Siempre usa `Intl.NumberFormat`.

## 2. Moneda

### Símbolo y posición

| Cultura | Ejemplo |
|---------|---------|
| España | 1.234,56 € |
| EEUU | $1,234.56 |
| UK | £1,234.56 |

```typescript
new Intl.NumberFormat('es-ES', { 
  style: 'currency', 
  currency: 'EUR' 
}).format(1234.56) // "1.234,56 €"

new Intl.NumberFormat('en-US', { 
  style: 'currency', 
  currency: 'USD' 
}).format(1234.56) // "$1,234.56"
```

**Consideración**: si tu aplicación maneja múltiples monedas, necesitas un servicio de conversión de divisas además del formateo.

## 3. Fechas

### Formato y primer día de la semana

| Aspecto | España | UK | EEUU |
|---------|--------|----|------|
| Formato | 04/06/2024 | 04/06/2024 | 06/04/2024 |
| Primer día semana | Lunes | Lunes | Domingo |

```typescript
new Intl.DateTimeFormat('es-ES').format(new Date()) // "4/6/2024"
new Intl.DateTimeFormat('en-US').format(new Date()) // "6/4/2024"
```

> ⚠️ España y UK usan el mismo formato dd/mm/yyyy pero EEUU usa mm/dd/yyyy. Esto es fuente constante de bugs.

## 4. Horas

### Formato 24h vs 12h

| Cultura | Ejemplo |
|---------|---------|
| Español | 14:30 |
| Anglosajón | 2:30 PM |

```typescript
new Intl.DateTimeFormat('es-ES', { 
  timeStyle: 'short' 
}).format(new Date()) // "14:30"

new Intl.DateTimeFormat('en-US', { 
  timeStyle: 'short' 
}).format(new Date()) // "2:30 PM"
```

## 5. Unidades de medida

Si tu aplicación muestra datos de vehículos, productos o logística, las unidades importan:

| Magnitud | Métrico | Imperial |
|----------|---------|----------|
| Longitud | metros, km | pies, pulgadas, millas |
| Peso | kilogramos | libras |
| Volumen | litros | galones |
| Temperatura | °C | °F |

**Consejo**: usa una capa de conversión que aplique la transformación según el locale del usuario, no conviertas en el componente.

## 6. Formato de dirección y contacto

### Direcciones

| España | Anglosajón |
|--------|-----------|
| Calle, Ciudad, CP, País | Address, City, **State**, ZIP, Country |

Los países anglosajones incluyen el **estado** como campo obligatorio, lo que requiere cambios en formularios y modelos de datos.

### Teléfonos

Ajusta los formatos incluyendo códigos de país y área según la región del usuario.

## 7. Localización en APIs

### Parámetros de localización

Tus APIs deben aceptar y manejar parámetros de cultura:

```http
GET /api/vehicles?culture=en-GB
Accept-Language: en-GB
```

### Qué debe afectar la cultura en el backend

- Formato de números en respuestas
- Formato de fechas
- Ordenación de strings (collation)
- Mensajes de error y validación
- Formato de exportaciones (CSV, PDF)

## 8. Checklist de internacionalización

- [ ] Números formateados con `Intl.NumberFormat`
- [ ] Monedas con símbolo y posición correcta
- [ ] Fechas con `Intl.DateTimeFormat`
- [ ] Horas en formato 12h/24h según cultura
- [ ] Unidades de medida convertidas según región
- [ ] Formularios de dirección adaptados (con/sin estado)
- [ ] APIs aceptan parámetro de cultura
- [ ] Textos externalizados en archivos de traducción
- [ ] Pluralización correcta en cada idioma
- [ ] Dirección de lectura (LTR/RTL si aplica)

## Herramientas recomendadas

| Herramienta | Uso |
|-------------|-----|
| `Intl` API nativa | Formateo de números, fechas, monedas |
| `vue-i18n` | Gestión de traducciones en Vue |
| `date-fns` con locales | Manipulación de fechas localizada |
| [Weblate](https://weblate.org/) | Gestión de traducciones en equipo |

## Conclusiones

1. **Internacionalizar no es traducir**: es adaptar números, fechas, monedas, unidades y formularios.
2. **Usa las APIs nativas del navegador** (`Intl.*`) — son potentes y ya soportan todos los locales.
3. **La API también debe hablar el idioma del cliente**: parámetros de cultura en el backend son imprescindibles.
4. **Testea con datos reales** de cada cultura objetivo — los edge cases son infinitos.
5. **Empieza por lo que más duele**: generalmente son los formatos numéricos y las fechas.
