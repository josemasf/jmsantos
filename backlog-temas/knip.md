> **Estado: escrito** — publicado como `27-knip-unused-no-significa-codigo-muerto.md` el 11 de agosto de 2026.

Perfecto. Este tema da para un post bastante bueno porque parte de una experiencia real y además evita el típico artículo de “instala Knip y ejecuta este comando”.

Yo lo enfocaría desde una idea central:

**Knip no es una herramienta para borrar código automáticamente. Es una herramienta para generar sospechas que luego tienes que validar.**

Y en tu caso hay una historia real detrás: en la auditoría aparecieron **182 archivos potencialmente no utilizados**, 4 dependencias, 2 devDependencies, 18 exports y 75 tipos exportados marcados como unused. Pero el propio análisis advertía que, en proyectos con Nuxt y layers, hay falsos positivos y que hay que afinar `knip.json` antes de eliminar nada.

Te propongo desarrollar el artículo así:

# Knip no sirve para borrar todo lo que marque como `unused`

Hace poco, mientras hacía una auditoría técnica de un proyecto frontend, incorporé [Knip] como una de las herramientas para detectar deuda técnica y código potencialmente muerto.

El resultado inicial fue de esos que llaman la atención enseguida: más de cien archivos marcados como no utilizados, varias dependencias aparentemente innecesarias, exports que nadie consumía y decenas de tipos exportados sin referencias.

La primera reacción podría ser bastante evidente:

“Pues borramos todo esto y listo”.

Y ahí es precisamente donde empieza el problema.

Knip es una herramienta muy útil, pero creo que hay que entender bien qué información nos está dando. No está diciendo necesariamente que ese código sea inútil. Está diciendo algo mucho más concreto: **“con la información que tengo y con la configuración actual del proyecto, no encuentro quién utiliza esto”**.

Y esas dos afirmaciones no son lo mismo.

## El descubrimiento

Durante la auditoría ejecuté algo tan sencillo como:

```bash
pnpm dlx knip
```

El informe devolvió un volumen bastante considerable de elementos potencialmente sin uso: archivos completos, dependencias, devDependencies, imports no resueltos, exports y tipos exportados.

Ese resultado es muy útil porque normalmente este tipo de código se va acumulando poco a poco.

Refactorizas una pantalla y queda un componente antiguo.

Cambias una librería y nadie elimina la dependencia anterior.

Mueves una funcionalidad y queda algún composable que ya nadie utiliza.

El proyecto sigue compilando, los tests siguen pasando y nadie tiene un motivo evidente para revisar esas piezas.

Con el paso del tiempo ese código termina formando parte del paisaje.

## Pero Knip no conoce necesariamente todo tu framework

El primer aprendizaje importante fue que no podía interpretar el resultado literalmente.

En proyectos con frameworks que utilizan convenciones, auto-imports, generación de rutas, plugins o carga dinámica de módulos, una herramienta de análisis estático puede no tener todo el contexto necesario para determinar si algo se utiliza realmente.

En nuestro caso había además una particularidad importante: se trataba de un proyecto basado en Nuxt y organizado mediante layers.

Y ahí empiezan a aparecer falsos positivos.

El propio análisis que hicimos terminó incluyendo una advertencia bastante clara: en proyectos Nuxt con layers es necesario ajustar correctamente la configuración de Knip y mantener un `knip.json` antes de utilizar sus resultados para eliminar código.

Por tanto, una regla que aplicaría siempre sería esta:

> **Nunca elimines código únicamente porque Knip diga que está `unused`.**

Primero hay que entender por qué lo está marcando.

## Un `unused file` no significa necesariamente código muerto

Imaginemos que Knip devuelve esto:

```text
Unused files
app/plugins/example.ts
layers/catalog/app/pages/products/[id].vue
```

Hay una diferencia enorme entre que un archivo no tenga imports explícitos y que el framework no lo utilice.

Una página puede entrar en la aplicación porque el framework genera automáticamente una ruta a partir del filesystem.

Un plugin puede cargarse porque existe en una determinada carpeta.

Un componente puede estar registrado mediante auto-import.

Un módulo puede resolverse dinámicamente.

Desde el punto de vista del código fuente, nadie está haciendo:

```ts
import ExamplePlugin from "./plugins/example";
```

pero eso no implica que el archivo no tenga ningún efecto en runtime.

Por eso lo primero que hago ahora cuando Knip señala un archivo es preguntarme:

**¿Quién debería estar consumiendo esto? ¿El código o el framework?**

Si la respuesta es “el framework”, necesito revisar la configuración antes de sacar conclusiones.

## Donde Knip sí resulta especialmente útil

Eso tampoco significa que haya que desconfiar de todo lo que devuelve.

Al contrario.

Hay varias categorías en las que me parece especialmente valioso.

### Dependencias que ya no utilizamos

Una dependencia olvidada en `package.json` no suele romper nada.

Y precisamente por eso puede quedarse ahí durante años.

Knip ayuda a localizar casos como:

```text
Unused dependencies
some-old-library
another-package
```

Aquí normalmente el proceso de comprobación es relativamente sencillo:

```bash
rg "some-old-library" .
```

o revisar si existe algún plugin, configuración o carga dinámica asociada.

Si realmente nadie la utiliza, podemos eliminarla y simplificar el proyecto.

## Exports que ya no tienen consumidores

También me parece muy útil para encontrar exports que han sobrevivido a varios refactors.

Por ejemplo:

```ts
export function buildLegacyPayload() {
  // ...
}
```

Quizá esa función tenía sentido hace seis meses, pero toda la funcionalidad que la consumía ya ha desaparecido.

Estos casos son especialmente interesantes porque no siempre aparecen en las herramientas tradicionales de linting.

## Tipos exportados innecesariamente

En el análisis aparecieron también decenas de tipos exportados que aparentemente no tenían consumidores.

No siempre hay que eliminarlos, pero sí merece la pena hacerse una pregunta:

```ts
export interface InternalConfiguration {
  // ...
}
```

¿Necesita realmente ser público?

Quizá sólo se utiliza dentro del mismo módulo:

```ts
interface InternalConfiguration {
  // ...
}
```

Reducir exports innecesarios también ayuda a limitar la superficie pública de nuestros módulos.

## El flujo que estoy utilizando

Después de esta experiencia, ya no considero `knip` una orden de limpieza.

Lo trato como el comienzo de una investigación.

Mi flujo suele ser aproximadamente este:

```bash
pnpm dlx knip
```

Primero reviso los resultados sin modificar nada.

Después intento clasificarlos:

```text
Seguro que está muerto
Probable falso positivo
Necesita investigación
Dependencia del framework
```

Los casos dudosos los valido buscando referencias, revisando rutas, plugins, auto-imports y configuración del framework.

Y sólo entonces empieza la limpieza.

En proyectos donde Knip devuelve mucho ruido, el siguiente paso debería ser configurar correctamente la herramienta:

```text
knip.json
```

El objetivo no es conseguir que Knip devuelva cero resultados.

El objetivo es conseguir que **cuando Knip marque algo, podamos confiar mucho más en la señal**.

## Yo no intentaría arreglar todo en un único PR

Otro error bastante fácil es convertir el primer análisis de Knip en una operación de demolición.

Si aparecen cientos de resultados, hacer un PR eliminándolo todo hace muy difícil saber qué ha provocado un problema si después aparece una regresión.

Prefiero hacerlo de manera progresiva.

Por ejemplo:

```text
PR 1
Dependencias claramente no utilizadas.

PR 2
Exports y tipos sin consumidores.

PR 3
Componentes o utilidades obsoletas.

PR 4
Archivos completos después de validar rutas y auto-imports.
```

Cada cambio debería seguir pasando por el mismo proceso que cualquier otro refactor:

```bash
pnpm test
pnpm build
pnpm lint
```

Y, si tenemos E2E, ejecutarlos también sobre las partes afectadas.

Porque eliminar código muerto debería ser una operación aburrida.

Si estamos cruzando los dedos al hacer merge, estamos limpiando demasiado rápido.

## El verdadero valor de Knip

Lo que más me gustó de la herramienta no fue que encontrase archivos que podía borrar.

Fue que hizo visible una parte de la deuda técnica que normalmente permanece escondida.

Cuando trabajamos sobre un proyecto solemos fijarnos mucho en el código que utilizamos.

Pero casi nunca miramos el que **hemos dejado de utilizar**.

Y ese código también tiene un coste.

Hay que entenderlo cuando aparece en una búsqueda.

Hay que mantener sus dependencias.

Puede confundir a alguien que llegue nuevo al proyecto.

Puede hacer que tengamos dudas durante un refactor.

Y puede llevarnos a creer que todavía existe una funcionalidad que en realidad desapareció hace meses.

Por eso creo que Knip merece estar dentro de una estrategia de mantenimiento técnico.

Pero no como una papelera automática.

Más bien como un detector de humo.

Te señala dónde merece la pena mirar.

Después seguimos siendo nosotros quienes tenemos que comprobar si realmente hay fuego.

---

## Cierre que usaría

Desde que incorporé Knip a este tipo de auditorías hay una pregunta que intento hacerme de manera periódica:

**¿Cuánto código estamos manteniendo que nuestra aplicación ya no necesita?**

No creo que tenga sentido convertir esa pregunta en una obsesión por conseguir un repositorio perfectamente limpio, pero sí revisarla de vez en cuando.

Mi recomendación sería ejecutar Knip periódicamente, dedicar tiempo a afinar su configuración y tratar cada resultado como una hipótesis, no como una sentencia.

Porque el comando para borrar un archivo tarda un segundo.

Descubrir después que Nuxt lo cargaba mágicamente suele llevar bastante más.

---

Creo que este enfoque encaja mejor con tu blog que hacer un tutorial puro. **Empiezas contando algo que te ha ocurrido, explicas qué aprendiste y después das una forma práctica de aplicar ese aprendizaje.** Además, permite meter código sin que el artículo se convierta en documentación de Knip.
