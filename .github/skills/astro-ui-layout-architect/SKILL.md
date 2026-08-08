---
name: astro-ui-layout-architect
description: "Diseña, revisa e implementa interfaces Astro modernas, responsive y accesibles usando layouts, pages y components con criterio de arquitectura visual. Use when piden mejorar UI, maquetacion, responsive, UX, accesibilidad, rendimiento o estructura de layout/componentes en Astro."
argument-hint: "Objetivo visual, pagina/seccion a trabajar, restricciones y nivel de cambio (ajuste puntual o refactor de arquitectura)."
user-invocable: true
disable-model-invocation: false
---

# Astro UI & Layout Architect

Especialista senior en UI, UX engineering y arquitectura frontend para Astro.

## Resultado Esperado

Este skill convierte requisitos funcionales, ideas visuales o revisiones de pantallas en:

- una propuesta de arquitectura visual coherente;
- un plan de implementacion mantenible en Astro;
- cambios concretos en layouts/pages/components/styles;
- validaciones de responsive, accesibilidad, rendimiento y SEO tecnico.

## Cuando Usarlo

Usa este skill cuando el usuario pida:

- mejorar una pagina Astro en diseno o maquetacion;
- reorganizar `src/layouts`, `src/pages` y `src/components`;
- corregir problemas de responsive, espaciado o jerarquia visual;
- revisar capturas y priorizar problemas estructurales de UI/UX;
- aumentar reutilizacion de componentes sin sobre-ingenieria;
- mejorar accesibilidad WCAG y Core Web Vitals sin JS innecesario.

## Stack y Areas Clave

- Astro Layouts, Components, Pages, Content Collections
- Slots y named slots
- Islands Architecture y estrategias `client:*`
- HTML5 semantico
- CSS moderno, Grid, Flexbox, container queries
- Mobile-first, tipografia fluida, `clamp()`, `minmax()`, `auto-fit`
- Design tokens y CSS custom properties
- Tailwind CSS cuando el proyecto lo utilice
- Optimizacion de imagenes en Astro
- Accesibilidad, SEO tecnico y rendimiento

## Flujo de Trabajo

### 1) Descubrimiento Inicial

1. Analiza estructura actual del proyecto.
2. Localiza layout efectivo de la pagina objetivo.
3. Identifica componentes existentes reutilizables.
4. Revisa estilos globales y tokens visuales.
5. Localiza assets e imagenes disponibles.
6. Define limite del cambio: ajuste local o refactor parcial.

### 2) Clasificacion Arquitectonica

Antes de editar, clasifica cada cambio como:

1. layout global;
2. layout de seccion;
3. seccion reutilizable;
4. componente UI;
5. pagina puntual;
6. estilos globales;
7. asset visual.

Regla: evita meter codigo en paginas si debe vivir como componente reutilizable.

### 3) Evaluacion de Problemas

Detecta y prioriza:

- espacios muertos o padding excesivo;
- contenido estrecho o columnas desequilibradas;
- jerarquia visual debil;
- headings o landmarks inconsistentes;
- responsive fragil por medidas fijas;
- JS innecesario para interacciones resolubles con CSS.

### 4) Toma de Decisiones

Si hay varias soluciones, prioriza en este orden:

1. experiencia de usuario;
2. claridad visual;
3. responsive;
4. accesibilidad;
5. reutilizacion;
6. simplicidad;
7. rendimiento;
8. mantenibilidad;
9. consistencia visual;
10. efectos esteticos.

### 5) Estrategia de Implementacion

1. Define archivos afectados.
2. Explica problema y solucion propuesta.
3. Elige el punto correcto de composicion (layout/seccion/componente/pagina).
4. Implementa mobile-first.
5. Reutiliza tokens existentes antes de crear valores nuevos.
6. Usa named slots cuando una pagina necesite zonas especificas (hero, sidebar, actions, breadcrumbs).
7. Si se necesita interactividad, elige la hidratacion menos agresiva (`client:visible`, `client:idle`, etc.).

### 6) Validacion Final

Comprobar siempre:

- funciona en movil pequeno, movil, tablet, portatil, desktop y pantallas grandes;
- no hay regresiones visuales;
- estructura semantica correcta y foco visible por teclado;
- contraste y areas tactiles adecuados;
- no se introdujo JS innecesario;
- se mantiene o mejora rendimiento;
- se aprovecha mejor el viewport sin alturas fijas arbitrarias.

## Reglas de Diseno y Arquitectura

### Layouts

- centraliza estructura compartida, `<head>`, metadata SEO, header/footer y contenedores base;
- usa `<slot />` para contenido de pagina;
- usa named slots para variaciones concretas;
- evita duplicar estructura entre paginas;
- si varias paginas comparten patron, propone layout especializado.

### Responsive

- enfoque mobile-first obligatorio;
- prioriza composicion fluida sobre media queries aisladas;
- evita anchuras/alturas rigidas y posicionamiento absoluto como solucion por defecto;
- adapta el layout al contenido, no el contenido al layout.

### Sistema Visual

- mantiene consistencia en tipografia, espaciados, radios, sombras, colores y anchos maximos;
- reutiliza design tokens y custom properties;
- no introduzcas valores arbitrarios sin validar equivalentes existentes.

### Tailwind (Si Esta Presente)

- si el proyecto ya usa Tailwind, prioriza utilidades y patrones existentes antes de CSS nuevo;
- usa clases utilitarias para ajustes locales y composicion de secciones;
- usa `src/styles` y custom properties para tokens globales compartidos;
- evita mezclar en el mismo bloque estilos utilitarios y CSS ad hoc redundante;
- cuando una pieza crece en complejidad, extraela a componente reutilizable con API clara.

Decision CSS vs Tailwind:

1. ajuste puntual y local: Tailwind;
2. patron repetido en varias pantallas: componente reutilizable;
3. token global o decision de sistema visual: CSS custom properties/global styles;
4. layout complejo contextual: combinar utilidades con reglas minimas encapsuladas.

### Componentes

- primero busca componentes existentes;
- crea componentes pequenos, semanticos y de responsabilidad clara;
- evita componentes gigantes con estructura y estilo acoplados.

### Imagenes

- cuida formato, peso, ratio, recorte y foco visual;
- evita CLS con dimensiones coherentes;
- una imagen decorativa no debe forzar alturas artificiales.

### Accesibilidad

- headings en orden logico;
- landmarks claros;
- labels y alt text correctos;
- teclado navegable y focus visible;
- respeta `prefers-reduced-motion`.

### Rendimiento

- no hidrates componentes sin necesidad;
- selecciona la estrategia `client:*` minima viable;
- protege Core Web Vitals en cada iteracion.

## Modo Revision de Capturas

Cuando el input sea una captura, responde en este orden:

1. que funciona;
2. problemas visuales;
3. problemas UX;
4. riesgos responsive;
5. que convertir en componentes;
6. que mover al layout;
7. cambios de mayor impacto;
8. cambios cosmeticos de baja prioridad.

## Formato de Salida

Para implementaciones, usar este formato con recomendaciones priorizadas:

### Archivos afectados

### Problema

### Solucion

### Implementacion

### Responsive

### Validacion

### Recomendaciones Priorizadas

1. cambios de alto impacto estructural;
2. mejoras de UX/accesibilidad de impacto medio;
3. ajustes cosmeticos o de refinamiento final.

## Criterios de Cierre

Una tarea se considera terminada solo si:

- funciona correctamente;
- es responsive;
- no introduce regresiones visuales;
- respeta el diseno existente;
- utiliza Astro de forma correcta;
- evita duplicacion y mantiene semantica;
- es accesible;
- no introduce JS innecesario;
- mantiene o mejora rendimiento;
- aprovecha mejor el espacio disponible.

## Restricciones

Nunca:

- modificar indiscriminadamente estilos globales;
- anadir JS cuando CSS sea suficiente;
- duplicar componentes existentes;
- crear componentes innecesarios;
- usar alturas fijas para parchear layout;
- abusar de `position: absolute`;
- esconder contenido como unica solucion responsive;
- introducir dependencias sin necesidad;
- romper el sistema visual por arreglos locales;
- sacrificar accesibilidad por estetica.
