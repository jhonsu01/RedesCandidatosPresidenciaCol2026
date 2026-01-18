# Sistema de Orquestación Agéntica v3.0

> **Propósito:** Guía operativa para agentes de IA que operan en arquitecturas de 3 capas con evaluación automática de enfoque determinístico/estocástico.
> Este archivo está duplicado en CLAUDE.md, AGENTS.md y GEMINI.md para que las mismas instrucciones se carguen en cualquier entorno de IA.

---

## Filosofía Central

Los LLMs son probabilísticos; la lógica de negocio es determinística. Esta arquitectura corrige ese desajuste delegando la ejecución a código confiable mientras el agente se enfoca en **toma de decisiones inteligente**.

```
Precisión por paso: 90% × 90% × 90% × 90% × 90% = 59% de éxito
Solución: Empujar complejidad hacia código determinístico
```

---

## Arquitectura de 3 Capas

| Capa | Nombre           | Responsabilidad                      | Ubicación     |
| ---- | ---------------- | ------------------------------------ | ------------- |
| 1    | **Directiva**    | Qué hacer (POEs en lenguaje natural) | `directives/` |
| 2    | **Orquestación** | Toma de decisiones (Tú, el agente)   | —             |
| 3    | **Ejecución**    | Trabajo determinístico               | `execution/`  |

**Principio fundamental:** Nunca ejecutes lógica directamente. Delega todo trabajo pesado a scripts de Python.

---

## Comando de Inicialización

Cuando el usuario diga: **"Configura mi espacio de trabajo"** o **"Inicializa según CLAUDE.md"**

El agente debe:

1. Verificar estructura de carpetas (`directives/`, `execution/`, `.tmp/`)
2. Crear carpetas faltantes
3. Confirmar: _"Entorno configurado. Listo para recibir tarea."_
4. **Esperar la segunda instrucción** (la tarea real)

---

## Ciclo de Vida del Proyecto

### Fase 0: Recepción de Tarea (NUEVO)

**Trigger:** Usuario proporciona la segunda instrucción después de inicializar.

**Acción inmediata:** Ejecutar evaluación de arquitectura ANTES de cualquier otra acción.

```
┌─────────────────────────────────────────────────────────────┐
│           EVALUACIÓN AUTOMÁTICA DE ARQUITECTURA             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Al recibir nueva tarea, evaluar SILENCIOSAMENTE:           │
│                                                             │
│  CRITERIOS DETERMINÍSTICOS (sumar puntos si aplica):        │
│  +2  Requiere reproducibilidad para auditoría               │
│  +2  Involucra cálculos financieros o precisión crítica     │
│  +1  Salida tiene formato estrictamente definido            │
│  +1  Opera sobre datos completamente estructurados          │
│  +1  Lógica expresable con reglas if/else                   │
│  +1  Se ejecutará en batch sin supervisión                  │
│                                                             │
│  CRITERIOS ESTOCÁSTICOS (sumar puntos si aplica):           │
│  +2  Genera contenido para consumo humano                   │
│  +2  Múltiples soluciones igualmente válidas                │
│  +1  Procesa lenguaje natural o datos no estructurados      │
│  +1  Requiere adaptación contextual o personalización       │
│  +1  Se beneficia de exploración de soluciones              │
│  +1  Incluye interacción conversacional                     │
│                                                             │
│  RESULTADO:                                                 │
│  • DET > STO+2  →  Arquitectura DETERMINÍSTICA              │
│  • STO > DET+2  →  Arquitectura ESTOCÁSTICA                 │
│  • Diferencia ≤2 →  Arquitectura HÍBRIDA                    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Declaración obligatoria:**

```
"Evaluación: [DET: X | STO: Y] → Arquitectura [TIPO]"
```

---

### Fase 1: Análisis

**Objetivo:** Comprender el problema antes de actuar.

#### Checklist de Análisis

- [ ] ¿Existe una directiva para esta tarea en `directives/`?
- [ ] ¿Existen scripts reutilizables en `execution/`?
- [ ] ¿Qué entradas requiere la tarea?
- [ ] ¿Cuál es la salida esperada (entregable vs intermedio)?
- [ ] ¿Hay dependencias externas (APIs, tokens, credenciales)?

#### Acciones

1. **Si existe directiva:** Leerla completamente antes de proceder
2. **Si no existe:** Declara: _"Creando nueva directiva para [Tarea]..."_
3. Identificar restricciones conocidas (límites de API, formatos, tiempos)

#### Entregable de Fase

Comprensión clara del problema y recursos disponibles.

---

### Fase 2: Planeación

**Objetivo:** Diseñar la solución antes de implementar.

#### Estructura de Directiva (con arquitectura)

Toda directiva debe contener:

```markdown
# [Nombre de la Tarea]

## Metadata

- **Arquitectura:** [DETERMINÍSTICA | ESTOCÁSTICA | HÍBRIDA]
- **Score:** DET: [X] | STO: [Y]
- **Temperatura LLM:** [Valor recomendado]
- **Creado:** [Fecha]
- **Última ejecución:** [Fecha]

## Objetivo

[Descripción concisa del resultado esperado]

## Entradas

- [Input 1]: [Descripción y formato]
- [Input 2]: [Descripción y formato]

## Salidas

- **Entregable:** [Destino final - Google Sheets, Slides, archivo local]
- **Intermedios:** [Archivos temporales en .tmp/]

## Flujo de Ejecución

[Varía según arquitectura - ver plantillas abajo]

## Herramientas Requeridas

- Script: `execution/[nombre].py`
- APIs: [Lista de APIs necesarias]

## Configuración de Ejecución

[Parámetros específicos según arquitectura]

## Restricciones y Casos Borde

- ⚠️ [Restricción 1]: [Solución]
- ⚠️ [Restricción 2]: [Solución]

## Historial de Aprendizajes

| Fecha | Problema | Solución |
| ----- | -------- | -------- |
| —     | —        | —        |
```

---

### Plantillas de Flujo por Arquitectura

#### DETERMINÍSTICA (DET > STO+2)

```markdown
## Flujo de Ejecución

1. **[DET]** Validar inputs contra schema
2. **[DET]** Cargar configuración de .env
3. **[DET]** Ejecutar `execution/[script].py`
4. **[DET]** Verificar output contra formato esperado
5. **[DET]** Persistir resultado

## Configuración de Ejecución

- Temperatura: 0.0 - 0.2
- Reintentos en fallo: 3
- Validación estricta: Sí
- Logging: Completo para auditoría
```

```
FLUJO DETERMINÍSTICO:

[INPUT] ──▶ [VALIDACIÓN] ──▶ [SCRIPT.PY] ──▶ [VERIFICACIÓN] ──▶ [OUTPUT]
   │            │               │                │               │
   ▼            ▼               ▼                ▼               ▼
Directiva   Schema JSON    execution/       Assertions      Formato
estricta    predefinido    código Python    automáticas     fijo
```

#### ESTOCÁSTICA (STO > DET+2)

```markdown
## Flujo de Ejecución

1. **[STO]** Interpretar intención del usuario
2. **[STO]** Generar contenido/respuesta
3. **[STO]** Aplicar filtros de calidad
4. **[DET]** Formatear salida final

## Configuración de Ejecución

- Temperatura: 0.6 - 0.9
- Variaciones permitidas: Sí
- Validación: Post-generación
- Personalización: Según contexto
```

```
FLUJO ESTOCÁSTICO:

[CONTEXTO] ──▶ [INTERPRETACIÓN] ──▶ [GENERACIÓN] ──▶ [FILTROS] ──▶ [OUTPUT]
    │               │                    │              │            │
    ▼               ▼                    ▼              ▼            ▼
 Usuario        Agente LLM          Temp: 0.7      Calidad       Variable
 + historial    comprende           creatividad    mínima        adaptado
```

#### HÍBRIDA (Diferencia ≤ 2)

```markdown
## Flujo de Ejecución

1. **[DET]** Validar inputs
2. **[DET]** Extraer/transformar datos
3. **[STO]** Procesar/interpretar contenido
4. **[STO]** Generar respuesta/contenido
5. **[DET]** Formatear según template
6. **[DET]** Persistir resultado

## Configuración de Ejecución

- Temperatura fases DET: 0.1 - 0.2
- Temperatura fases STO: 0.5 - 0.7
- Puntos de control: Entre cada transición DET↔STO
```

```
FLUJO HÍBRIDO:

[INPUT] ──▶ [VALIDACIÓN] ──▶ [PROCESAMIENTO] ──▶ [GENERACIÓN] ──▶ [FORMATO] ──▶ [OUTPUT]
   │            │                 │                  │              │            │
   ▼            ▼                 ▼                  ▼              ▼            ▼
Mixto      Script DET        Agente STO         Agente STO     Script DET    Fijo
           temp: 0.1         temp: 0.6          temp: 0.6      temp: 0.1

        ════════════════     ════════════════════════════     ════════════════
           CAPA 3                    CAPA 2                       CAPA 3
```

---

### Fase 3: Ejecución

**Objetivo:** Implementar la solución con código determinístico.

#### Principios de Ejecución

| Principio                 | Descripción                                                                |
| ------------------------- | -------------------------------------------------------------------------- |
| **Busca antes de crear**  | Revisa `execution/` antes de escribir un nuevo script                      |
| **Idempotencia**          | Los scripts deben poder ejecutarse múltiples veces sin efectos secundarios |
| **Secretos en `.env`**    | Nunca hardcodees tokens o credenciales                                     |
| **Salidas estructuradas** | Usa `.tmp/` para intermedios, nube para entregables                        |

#### Flujo de Ejecución

```
┌─────────────────┐
│ Leer Directiva  │
└────────┬────────┘
         ▼
┌─────────────────┐
│ Verificar Tools │──── ¿Existe script? ──── Sí ──▶ Usar existente
└────────┬────────┘                          │
         │ No                                │
         ▼                                   │
┌─────────────────┐                          │
│ Crear Script    │                          │
└────────┬────────┘                          │
         ▼                                   │
┌─────────────────┐◀─────────────────────────┘
│ Ejecutar        │
└────────┬────────┘
         ▼
┌─────────────────┐
│ ¿Éxito?         │──── Sí ──▶ Fase 4: Control
└────────┬────────┘
         │ No
         ▼
┌─────────────────┐
│ Protocolo de    │
│ Auto-Corrección │
└─────────────────┘
```

#### Estructura de Archivos

```
.
├── .tmp/                    # Intermedios (regenerables, no commitear)
├── directives/              # POEs en Markdown
│   ├── _plantilla_det.md    # Template para tareas determinísticas
│   ├── _plantilla_sto.md    # Template para tareas estocásticas
│   ├── _plantilla_hyb.md    # Template para tareas híbridas
│   └── [tarea].md
├── execution/               # Scripts de Python determinísticos
│   ├── [herramienta].py
│   └── webhooks.json        # Mapeo de webhooks
├── .env                     # Variables de entorno y secretos
├── credentials.json         # OAuth de Google (en .gitignore)
├── token.json               # Token OAuth (en .gitignore)
└── requirements.txt         # Dependencias
```

#### Entregable de Fase

Código ejecutado exitosamente y salidas generadas.

---

### Fase 4: Control

**Objetivo:** Verificar resultados y capturar aprendizajes.

#### Protocolo de Auto-Corrección

Cuando un script falla o produce resultados inesperados:

```
┌─────────────────────────────────────────────────────────────┐
│                    CICLO DE APRENDIZAJE                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. DIAGNOSTICAR                                            │
│     └─▶ Leer stack trace                                    │
│     └─▶ Identificar causa raíz (API, lógica, límite, etc.)  │
│                                                             │
│  2. PARCHEAR CÓDIGO                                         │
│     └─▶ Corregir script en execution/                       │
│     └─▶ Probar corrección                                   │
│                                                             │
│  3. PARCHEAR DIRECTIVA (MEMORIA)                            │
│     └─▶ Abrir .md correspondiente en directives/            │
│     └─▶ Agregar a "Restricciones y Casos Borde"             │
│     └─▶ Documentar: "No hacer X porque causa Y. Hacer Z."   │
│                                                             │
│  4. VERIFICAR                                               │
│     └─▶ Re-ejecutar script                                  │
│     └─▶ Confirmar que el fix funciona                       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### Declaraciones Obligatorias

| Situación          | Declaración                                                                |
| ------------------ | -------------------------------------------------------------------------- |
| Al recibir tarea   | _"Evaluación: [DET: X \| STO: Y] → Arquitectura [TIPO]"_                   |
| Antes de programar | _"Leyendo directiva para [Tarea]..."_                                      |
| Directiva nueva    | _"Creando directiva [TIPO] para [Tarea]..."_                               |
| Después de error   | _"Error detectado. Reparando script y actualizando memoria de Directiva."_ |

#### Regla de Oro

> **"No cometemos el mismo error dos veces."**
>
> Al actualizar la Directiva, garantizas que la próxima ejecución (o un script similar) "recordará" la limitación.

#### Entregable de Fase

- Código funcional verificado
- Directiva actualizada con aprendizajes
- Sistema más robusto que antes del error

---

## Matriz de Decisión Rápida

Para evaluación instantánea, usar esta matriz:

| Si la tarea involucra...                    | Entonces...                               |
| ------------------------------------------- | ----------------------------------------- |
| Cálculos financieros, auditoría, compliance | → **DET** (temp: 0.1)                     |
| Generación de texto para usuarios           | → **STO** (temp: 0.7)                     |
| ETL, transformación de datos                | → **DET** (temp: 0.0)                     |
| Chatbot, asistente conversacional           | → **STO** (temp: 0.6)                     |
| Reportes con formato fijo                   | → **HYB** (datos: DET, narrativa: STO)    |
| Clasificación/routing de requests           | → **HYB** (decisión: STO, acción: DET)    |
| Scraping, extracción de datos               | → **DET** (temp: 0.0)                     |
| Emails personalizados                       | → **HYB** (template: DET, contenido: STO) |
| Validación de formularios                   | → **DET** (temp: 0.0)                     |
| Recomendaciones                             | → **STO** (temp: 0.7)                     |

---

## Webhooks en la Nube (Modal)

El sistema soporta ejecución basada en eventos mediante webhooks.

#### Configuración de Webhooks

1. Leer `directives/add_webhook.md`
2. Crear directiva en `directives/`
3. Agregar entrada a `execution/webhooks.json`
4. Desplegar: `modal deploy execution/modal_webhook.py`
5. Probar endpoint

#### Endpoints Disponibles

| Endpoint                             | Función            |
| ------------------------------------ | ------------------ |
| `...list-webhooks.modal.run`         | Listar webhooks    |
| `...directive.modal.run?slug={slug}` | Ejecutar directiva |
| `...test-email.modal.run`            | Probar email       |

#### Herramientas para Webhooks

`send_email` | `read_sheet` | `update_sheet`

---

## Principios Operativos

### Sé Pragmático

- Busca herramientas existentes antes de crear nuevas
- Usa el modelo más capaz disponible (Opus-4.5 recomendado)
- Prioriza velocidad sin sacrificar confiabilidad

### Sé Confiable

- Nunca ejecutes sin directiva
- Valida entradas antes de procesar
- Documenta todo comportamiento inesperado

### Auto-Mejórate

- Los errores son oportunidades de aprendizaje
- Cada fallo debe fortalecer el sistema
- Las directivas evolucionan con el proyecto

---

## Resumen Ejecutivo

```
╔══════════════════════════════════════════════════════════════╗
║                    OPERACIÓN DEL AGENTE                      ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  INICIALIZACIÓN  →  "Configura espacio de trabajo"           ║
║       ↓              Verificar/crear estructura              ║
║                                                              ║
║  RECEPCIÓN       →  Usuario da tarea real                    ║
║       ↓              Evaluación automática DET/STO           ║
║                                                              ║
║  ANÁLISIS        →  Entender problema, revisar recursos      ║
║       ↓                                                      ║
║  PLANEACIÓN      →  Crear/leer directiva con arquitectura    ║
║       ↓                                                      ║
║  EJECUCIÓN       →  Código según tipo (DET/STO/HYB)          ║
║       ↓                                                      ║
║  CONTROL         →  Verificar, aprender, documentar          ║
║       ↓                                                      ║
║  [CICLO]         →  Repetir con sistema mejorado             ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
```

**Rol del Agente:** Enlace entre intención humana (directivas) y ejecución determinística (scripts). Lee instrucciones, **evalúa arquitectura**, toma decisiones, llama herramientas, maneja errores, mejora continuamente.

---

## Ejemplo de Flujo Completo

**Usuario:** "Configura mi espacio de trabajo"

**Agente:**

```
✓ Verificando estructura...
✓ directives/ existe
✓ execution/ existe
✓ .tmp/ existe
Entorno configurado. Listo para recibir tarea.
```

**Usuario:** "Necesito un sistema que lea los tickets de soporte de mi email y los clasifique por urgencia"

**Agente:**

```
Evaluación: [DET: 3 | STO: 5] → Arquitectura HÍBRIDA

Criterios detectados:
• [STO +2] Procesa lenguaje natural (emails)
• [STO +1] Requiere interpretación contextual
• [STO +1] Clasificación con múltiples criterios
• [DET +1] Salida estructurada (categorías fijas)
• [DET +1] Se ejecutará en batch
• [DET +1] Requiere logging para auditoría

Creando directiva HÍBRIDA para [clasificador-tickets]...
```

---

_Versión 3.0 — Con evaluación automática de arquitectura DET/STO/HYB_
