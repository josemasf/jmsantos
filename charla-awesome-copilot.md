Cuando Tony Stark enchufa su traje, no configura puertos ni protocolos. Simplemente... funciona.
Eso es lo que busca el MCP para la IA.

🎬 El problema
Los LLMs no viven aislados: necesitan acceder a datos, herramientas y servicios reales.

Hoy lo resolvemos con APIs (REST, GraphQL, gRPC...), SDKs y mucho glue code.

Cada integración es distinta, frágil y costosa de mantener.

Resultado: los LLMs hablan bien, pero no hacen cosas.

 

humanveil-tony-stark.gif
 

🧭 Origen del MCP
Surge para crear un idioma común entre LLMs y servicios.

Propuesto por Anthropic (Claude).

Apoyado y extendido por:

OpenAI (ChatGPT / GPTs)

LangChain

LlamaIndex

Comunidad open source

👉 No es un proyecto cerrado, es un estándar abierto en construcción.

🔌 ¿Qué es MCP?
Model Context Protocol (MCP)

Un protocolo abierto para conectar modelos con herramientas y datos.

No es “otra API”, es un estándar de conexión.

Piensa en MCP como el HDMI de la IA:
enchufas → fluye todo lo necesario.

avengers-infinity-war-iron-man.gif
 

🛠️ ¿Cómo funciona?
MCP define un protocolo bidireccional entre modelos y sistemas externos.

Un servidor MCP registra tools y resources con metadatos descriptivos.

Un cliente MCP (el modelo o app LLM)

descubre las tools disponibles (list_tools)

invoca las que necesita (call_tool)

recibe resultados estructurados (JSON schema).

Soporta autenticación, permisos, y streaming de resultados.



🤖  Modelo LLM
  │        ↑
  │  🔌 MCP (protocolo)
  │        ↓
🗂️  Servicios / Datos / APIs / Infra
🚀 Ventajas
🔌 Conexión estándar → como enchufar HDMI.

🤝 Interoperable → un solo protocolo para muchos servicios.

⏱️ Rápido de integrar → menos endpoints, más descubrimiento.

🔍 Tipado y validación → contratos claros vía JSON Schema.

iron-man-iron-man2.gif
 

🧩 Awesome-Copilot (MCP)
Proyecto open source de Microsoft y la comunidad.

Implementa un servidor MCP que expone tools listas para usar.

Permite a un LLM (como Copilot) conectarse a recursos reales:

Documentación técnica y ejemplos de código.

Cheatsheets, guías de buenas prácticas y APIs útiles.

Repositorios de conocimiento para desarrolladores.

En lugar de sólo “responder”, el modelo consulta, explora y aprende en tiempo real.

Announcing Awesome Copilot MCP Server - Microsoft for Developers 

💡 Casos de uso con Awesome-Copilot
📊 Informes automáticos → deuda técnica, riesgos de arquitectura.

✍️ Mejora de prompts → reescribirlos con más claridad y potencia.

💾 Commits inteligentes → mensajes siguiendo conventional commits.

🔍 Revisión de PRs → aplicar chatmodes/instructions para detectar problemas.

🧪 Generación de tests → sugerencias de buenas prácticas y generación de mocks.

📚 Documentación viva → resúmenes de módulos, actualización de README.

🤝 Onboarding de equipos → un nuevo dev aprende el stack rápido.

📂 Estructura del repo: Awesome-Copilot


awesome-copilot/
├─ chatmodes/       → Roles (arquitecto, devops, seguridad...)
├─ collections/     → Conjuntos de prompts + instrucciones
├─ instructions/    → Guías y reglas de estilo/código
├─ prompts/         → Prompts listos para usar
├─ scripts/         → Utilidades para validar/generar colecciones
├─ .schemas/        → Definiciones estándar (YAML/JSON)
├─ README.*.md      → Documentación de cada recurso
✨ Incluye un MCP Server listo para ejecutar con Docker,
permitiendo instalar y usar estos recursos desde el editor.

GitHub - github/awesome-copilot: Community-contributed instructions, agents, skills, and configurations to help you make the most of GitHub Copilot. 

💬 Cómo interactuar con Awesome-Copilot (chat)
Ejemplos de prompts reales:

📊 Informe de deuda técnica

“Genera un informe de deuda técnica centrado en el frontend Vue, priorizando mantenibilidad y cobertura de tests.”

📝 Mejora de un prompt

“Optimiza este prompt para que sea más claro y produzca respuestas concisas.”

💾 Commit con convención

“Genera un mensaje de commit en formato conventional commits para este cambio en el login.”

🔍 Revisión de PR

“Como software-architect, revisa el PR #123 en busca de violaciones a SOLID y deuda técnica. Dame un resumen ejecutivo, issues bloqueantes y sugerencias de tests.”

📚 Onboarding / documentación

“Explícame cómo funciona el módulo de autenticación en este repo en 5 puntos claros.”

👉 La clave: dar rol + instrucciones + tarea clara.

“¿Y si tu copiloto supiera cómo se estructura tu proyecto, tus convenciones, tus tests y tu stack?
Con MCP, eso deja de ser un sueño.”
🎤 Live Demo: Awesome-Copilot en acción
 

.vscode/mcp.json

{
	"inputs": [],
	"servers": {
        "awesome-copilot": {
            "type": "stdio",
            "command": "docker",
            "args": [
                "run",
                "-i",
                "--rm",
                "GitHub "
            ]
            }
    }
}

VUE DRAGGABLE

#awesome-copilot añade un README al proyecto

#awesome-copilot aplica las mejores prácticas para que un README sea de utilidad

SIMASUITE BLAZOR

#awesome-copilot necesito que me hagas un análisis de malas prácticas en este proyecto
#awesome-copilot necesito añadir test a mis vistas web

WORKSHOP BACKOFFICE

#awesome-copilot Como software-architect,
revisa este proyecto.
Busca riesgos de seguridad (XSS, SSRF) y problemas de rendimiento.
Entrega:

Riesgos detectados
Soluciones sugeridas
Acciones prioritarias
Genera un documento .md en la raiz del proyecto

🤖 Awesome-Copilot para todos los públicos
MCP convierte al copiloto en un colaborador técnico completo.

jarvis-iron-man.gif
 

🔐 Auditoría de seguridad y rendimiento


Como software-architect,
revisa este módulo de autenticación.
Busca riesgos de seguridad (XSS, SSRF) y problemas de rendimiento.
Entrega:
1. Riesgos detectados
2. Soluciones sugeridas
3. Acciones prioritarias


Busca en C# y Blazor: concatenaciones SQL/NoSQL, FromSqlRaw inseguro, interpolaciones, uso de HttpClient sin timeouts, 
SSRF potencial, deserialización peligrosa, y acceso directo a headers Authorization. Para cada patrón, 
incluye snippet antes/después y test xUnit que prueba el fallo y el fix.


Escanea logging (Serilog/ILogger) y telemetry. Señala PII potencial (emails, phone, IDs, tokens) y elimina/anonimiza. 
Genera un LoggingPolicy.md y un Roslyn analyzer rule set que marque como error log.<Level>(object) sin redactor. 
Sugiere métricas/labels seguras para OpenTelemetry.
🧩 Documentación contextual


Genera un README para este componente Vue.
Incluye descripción funcional, props, ejemplos de uso y buenas prácticas.
Aplica las instructions de estilo del proyecto.


Actualiza el README del proyecto con información de utilidad sobre el proyecto


Crea un diagrama de arquitectura (en texto Mermaid) que represente el flujo de datos entre módulos front y backend.


Reescribe la documentación técnica para que sea comprensible por 
un nuevo miembro del equipo, manteniendo el rigor técnico pero con tono pedagógico.


Analiza toda la documentación actual del proyecto y genera un informe de calidad:
- Cobertura de documentación por módulo
- Legibilidad y consistencia de tono
- Recomendaciones de mejora
Bola Extra
MCP de Playwright
Vuetify con columnas ordenables
El data grid Vuetify (librería de componentes para Vue que implementa Material Desing, lo que Radzen es a Blazor) no implementa la recolocación de columnas.

Con ChatGPT mantuvimos esta conversación



Como puedo hacer con vuetify drag reorder
Nos dio la versión Vue2



usa esta librería que es para vue3 https://www.npmjs.com/package/vue-draggable-next
Obtuvimos la estructura de la prueba con los archivos, nos lo llevamos a VS Code y en el chat le pusimos la estructura generada

MCP PLaywright en acción
Haciendo uso del MCP de Playwright le pedimos que revisara que las columnas podían ser recolocadas

Abrió un navegador

Reviso la vista

Intentó mover las columnas y falló

Revisó la consola del navegador para ver los mensajes de error.

Detectó que estaba usando un slot que no existía

Repitió el proceso y se ayudo de capturas de pantalla para ver el antes y el después de sus iteraciones

Movió varias columnas para asegurarse que todo estaba correcto.

Le tuvimos que pedir que usase sólo componentes de vuetify, porque optó por usar html estándar

Resultado
vuetify-reorder.gif
 

🧱 Cierre
MCP no conecta máquinas. Conecta contextos.

Y un copiloto con contexto... es un compañero, no una herramienta.
