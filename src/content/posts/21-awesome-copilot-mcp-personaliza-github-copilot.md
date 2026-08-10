---
title: "Awesome Copilot MCP: encuentra y aplica personalizaciones para GitHub Copilot desde el editor"
description: "Qué aporta Awesome Copilot MCP, cómo configurarlo en VS Code y cómo usar sus instrucciones, prompts y agentes para mejorar revisiones, tests y documentación."
date: 2026-05-29
tags: [MCP, GitHub Copilot, VSCode, DX, prompts, calidad de código]
category: Herramientas
---

Un asistente de código resulta mucho más útil cuando entiende las reglas del proyecto: el stack, los criterios de revisión, el formato de los commits y la forma en que el equipo prueba sus componentes. El problema es que esa personalización suele empezar de cero en cada repositorio.

[Awesome Copilot](https://github.com/github/awesome-copilot) es una colección abierta de agentes, instrucciones, _skills_, _prompts_, _hooks_ y configuraciones para GitHub Copilot. Su servidor MCP permite buscar esos recursos desde el chat del editor y cargar los que encajan con una necesidad concreta. No sustituye al conocimiento del equipo; ayuda a encontrar un punto de partida que después hay que revisar y adaptar.

En este artículo veremos qué papel juega MCP, cómo configurar el servidor y cómo incorporarlo a un flujo de desarrollo sin convertir las recomendaciones de una IA en reglas incuestionables.

## El problema: Copilot conoce el código, pero no siempre las convenciones

Un modelo puede leer los ficheros abiertos y responder preguntas generales, pero eso no le da automáticamente una política de arquitectura, unas convenciones de testing o el tono de la documentación del producto.

La consecuencia es conocida:

- Las revisiones de PR dependen de que cada persona recuerde los mismos criterios.
- Los prompts importantes se repiten y evolucionan en conversaciones privadas.
- Los nuevos miembros tardan en localizar las reglas reales del repositorio.
- Se aceptan sugerencias técnicamente plausibles, pero incompatibles con el stack o las decisiones del equipo.

La personalización de Copilot soluciona una parte de este problema. Por ejemplo, una instrucción puede indicar que el proyecto usa Vue 3 con Composition API y TypeScript; un prompt puede estandarizar cómo se solicita una revisión de seguridad; y un agente puede delimitar las herramientas y el tipo de tarea que puede realizar.

El reto pasa a ser descubrir recursos de calidad, compararlos y llevar solo los necesarios al repositorio.

## MCP: el conector entre el asistente y las herramientas

El [Model Context Protocol](https://modelcontextprotocol.io/docs/getting-started/intro) (MCP) es un estándar abierto para conectar aplicaciones de IA con herramientas, fuentes de datos y flujos externos. No reemplaza REST, GraphQL ni un SDK: define una forma común de que un cliente de IA descubra qué capacidades ofrece un servidor y las utilice.

En términos prácticos intervienen tres piezas:

```text
VS Code + GitHub Copilot (host MCP)
              │
              │  stdio o HTTP
              ▼
       Servidor MCP
              │
              ▼
  herramientas, recursos y prompts
```

Un servidor puede publicar, entre otras primitivas, herramientas ejecutables, recursos con contexto y prompts reutilizables. El cliente decide qué mostrar o invocar según sus capacidades y permisos. Por eso MCP no hace que un modelo sea fiable por sí mismo: normaliza el acceso a capacidades que deben seguir teniendo contratos, autenticación y control de acceso.

## Qué ofrece Awesome Copilot MCP

El servidor de Awesome Copilot está orientado a la colección de personalizaciones de GitHub Copilot. Según el anuncio de Microsoft, expone dos herramientas y un prompt:

- `search_instructions`: busca personalizaciones relacionadas con unas palabras clave.
- `load_instruction`: carga el contenido de una personalización concreta.
- `mcp.awesome-copilot.get_search_prompt`: prepara un flujo guiado de búsqueda.

El valor no está en que el servidor audite un repositorio o genere tests de forma autónoma. Su función es facilitar el descubrimiento y la incorporación de recursos como instrucciones de Vue, guías de revisión, prompts de documentación o agentes especializados. El análisis posterior lo realiza Copilot con el contexto del repositorio y las instrucciones que decidamos adoptar.

## Configuración en VS Code

El servidor se ejecuta localmente en un contenedor, así que necesitas Docker Desktop instalado y en ejecución. En el espacio de trabajo, crea o edita `.vscode/mcp.json` y añade esta configuración:

```json
{
  "servers": {
    "awesome-copilot": {
      "type": "stdio",
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "ghcr.io/microsoft/mcp-dotnet-samples/awesome-copilot:latest"
      ]
    }
  }
}
```

`stdio` indica que VS Code inicia el proceso y se comunica con él por entrada y salida estándar. La opción `--rm` elimina el contenedor al terminar; no elimina la imagen descargada. Tras guardar el archivo, comprueba desde el panel de herramientas de Copilot que el servidor aparece conectado.

La configuración anterior da al servidor acceso únicamente al contenido que distribuye en su imagen. Si añades otros servidores MCP —por ejemplo, uno de repositorios, navegador o base de datos— evalúa cada permiso por separado: un servidor con herramientas de escritura o acceso a secretos puede ejecutar acciones reales.

## De una búsqueda a una regla del proyecto

Una vez conectado, inicia el prompt guiado del servidor:

```text
/mcp.awesome-copilot.get_search_prompt
```

Introduce términos que describan el problema y el stack, no una petición genérica como «mejora mi código». Por ejemplo:

```text
Vue 3 TypeScript testing Vitest Testing Library
```

El flujo busca recursos relacionados y los compara con los que ya existan en `.github/`. Antes de guardar uno, léelo y responde estas preguntas:

1. ¿Está alineado con la versión real de Vue, TypeScript y las herramientas del proyecto?
2. ¿Contradice decisiones documentadas, como convenciones de carpetas o reglas de lint?
3. ¿Pide permisos, herramientas o datos que el equipo no quiere conceder?
4. ¿Es suficientemente concreto para que otro desarrollador entienda cuándo se aplica?

Solo después tiene sentido guardar el recurso y versionarlo junto al código. La personalización debe ser una decisión técnica revisable, no una configuración opaca de una máquina concreta.

## Casos de uso que sí encajan en un equipo frontend

### Revisiones de pull request con criterios repetibles

Una instrucción de revisión puede pedir que se evalúen flujos de estado, accesibilidad, errores de red, regresiones en tipos y cobertura de pruebas. El prompt define la tarea; la instrucción define el criterio con el que debe resolverse.

```text
Revisa estos cambios como responsable de arquitectura frontend.

Busca regresiones de accesibilidad, estados de carga o error ausentes,
tipos `any` nuevos y tests que dependan de detalles de implementación.

Devuelve:
1. Bloqueantes, con fichero y motivo.
2. Recomendaciones ordenadas por impacto.
3. Tests concretos que faltan.
```

Una salida útil debe incluir evidencias del código. Si se limita a enumerar consejos genéricos, hay que pedirle que cite el fichero, el flujo afectado y una alternativa concreta.

### Tests que validan comportamiento

Para un proyecto Vue, una personalización de testing puede reforzar que las pruebas se escriban con Vue 3, Vitest, Testing Library y MSW cuando haya llamadas HTTP. El resultado esperado no es «más tests», sino pruebas legibles que cubran lo que una persona usuaria puede observar.

```text
Genera los tests para este formulario Vue.

Usa Vitest y Testing Library. Cubre validación, estado de envío,
respuesta correcta y error del API usando MSW. No pruebes métodos
internos ni detalles de implementación.
```

El modelo puede proponer la estructura inicial, pero la suite debe ejecutarse y revisarse como cualquier otra contribución. Un mock que no representa el contrato del backend solo añade confianza falsa.

### Documentación y onboarding

Las instrucciones del proyecto también pueden ayudar a mantener una documentación consistente. Por ejemplo, se puede pedir un README de un componente con propósito, API pública, estados, ejemplos de uso y decisiones relevantes.

```text
Documenta este componente Vue para una persona que se incorpora al equipo.
Incluye responsabilidad, props y eventos, estados de carga/error,
ejemplo de uso y dependencias externas. No inventes comportamiento:
si falta información, indícalo como pendiente.
```

En este caso, el recurso de Awesome Copilot sirve para encontrar una base; el README final debe respetar la estructura y el vocabulario del producto.

### Mensajes de commit consistentes

Un prompt de _conventional commits_ reduce discusiones mecánicas y hace más útil el historial. Aun así, el mensaje debe describir el cambio que de verdad se ha realizado, no la intención con la que se empezó.

```text
Propón un mensaje Conventional Commit en inglés para este diff.
Indica el tipo correcto y una descripción imperativa de menos de 72 caracteres.
No incluyas cambios que no aparezcan en el diff.
```

## Una adopción prudente: pequeño, visible y versionado

El enfoque más seguro es empezar con una única necesidad repetitiva. Por ejemplo, una instrucción de pruebas para el frontend y un prompt de revisión. El ciclo recomendado es:

1. Buscar recursos por tecnología y objetivo.
2. Leer el contenido antes de instalarlo.
3. Adaptarlo a las convenciones locales y eliminar reglas irrelevantes.
4. Guardarlo en el repositorio y revisarlo mediante pull request.
5. Medir si reduce retrabajo o mejora la consistencia de las revisiones.

Evita instalar colecciones completas sin revisión. Una instrucción demasiado amplia puede generar respuestas largas, contradictorias o costosas en contexto. Varias reglas que se solapan pueden confundir al asistente igual que confunden a una persona que se incorpora al proyecto.

## Seguridad: MCP amplía la superficie de acción

MCP conecta al asistente con sistemas externos, así que la comodidad no debe ocultar los límites de seguridad. La documentación del protocolo recomienda tratar los servidores MCP como componentes con riesgos propios, especialmente cuando pueden leer información sensible o ejecutar acciones.

Aplica estas reglas mínimas:

- Usa servidores de imágenes y editores confiables, y revisa sus actualizaciones.
- Concede el mínimo privilegio: separa herramientas de solo lectura de las que pueden escribir o desplegar.
- No incluyas tokens en ficheros versionados; usa las variables de entorno o el mecanismo de secretos del cliente.
- Lee los recursos que un servidor carga antes de integrarlos en el repositorio.
- Mantén confirmación humana para operaciones de impacto: borrar datos, cambiar permisos, abrir PRs o desplegar.

También conviene separar dos conceptos: una instrucción puede orientar al modelo, pero no es una barrera de seguridad. Las restricciones efectivas deben estar en los permisos del servidor, en las credenciales y en los controles de la plataforma.

## Conclusión

Awesome Copilot MCP no convierte a Copilot en un arquitecto que conoce automáticamente tu producto. Hace algo más concreto y útil: reduce el coste de descubrir personalizaciones reutilizables para que el equipo pueda adoptarlas de forma explícita.

Su mejor uso es como catálogo y acelerador de buenas bases. Busca un recurso, entiéndelo, adáptalo al repositorio y revísalo como código. Cuando las convenciones viven versionadas junto al proyecto, el copiloto deja de ser solo un generador de respuestas y se convierte en una ayuda más consistente para desarrollar, revisar y documentar.
