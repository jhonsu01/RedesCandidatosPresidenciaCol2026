# Monitor de Candidatos Presidencia Colombia 2026

## Metadata

- **Arquitectura:** HÍBRIDA
- **Score:** DET: 3 | STO: 2
- **Temperatura LLM:** 0.1 (Scripting/Datos) | 0.7 (Búsqueda/Validación)
- **Creado:** 2026-01-18
- **Estado:** En proceso

## Objetivo

Crear una webapp ("Leaderboard") que rastree y compare la cantidad de seguidores en Instagram, TikTok y Facebook de los candidatos presidenciales confirmados de Colombia 2026. La data se debe actualizar cada 24 horas mediante un script en Modal.com.

## Entradas

- **Fuente de Candidatos:** [Pares.com.co](https://www.pares.com.co/elecciones-colombia-2026/)
- **Redes a rastrear:** Instagram, TikTok, Facebook
- **Repositorio Destino:** RedesCandidatosPresidenciaCol2026 (GitHub Pages)

## Salidas

- **Web App:** `index.html`, `style.css`, `app.js` (Frontend con Countdowns, Gráficos/Lista, Ko-fi)
- **Datos:** `candidates.json` (Base de datos ligera)
- **Backend:** `execution/modal_updater.py` (Script de Modal para scraping/API)

## Flujo de Ejecución

1.  **[STO]** Investigar y extraer lista de candidatos confirmados desde la URL provista.
2.  **[STO]** Buscar y verificar las URLs oficiales de sus redes sociales.
3.  **[DET]** Crear estructura inicial de `candidates.json`.
4.  **[DET]** Desarrollar el frontend (HTML/CSS/JS) con diseño "premium" y contador regresivo.
5.  **[DET]** Implementar script en Python (`modal_updater.py`) para:
    - Leer `candidates.json`.
    - Obtener contadores actuales (Scraping/API).
    - Calcular deltas (subió/bajó).
    - Actualizar `candidates.json`.
    - (Opcional para flujo local) Git commit/push de la data actualizada.
6.  **[DET]** Desplegar/Configurar instrucciones para GitHub Pages.

## Herramientas Requeridas

- Browser (para investigación inicial)
- Python (Modal client, requests, scraping libs)
- HTML5/CSS3/JS (Vanilla preferiblemente, o framework ligero si se justifica)
- Git

## Restricciones y Casos Borde

- ⚠️ **Scraping de Redes Sociales:** Es frágil. Se debe intentar usar APIs públicas si existen, o librerías de scraping robustas (nitter, bibliogram, playwright headless). Para este MVP, se implementará la mejor aproximación posible en Modal.
- ⚠️ **Simplicidad:** La web debe ser estática (GitHub Pages), leyendo un JSON estático. Modal actúa como el "backend" cron job que actualiza ese JSON.
