# Monitor Elecciones Colombia 2026

Web App para monitorizar el crecimiento en redes sociales de los candidatos presidenciales confirmados para 2026.

## Automatización con Modal.com

El script `execution/modal_updater.py` actualiza los datos cada 24 horas.

### Configuración:

1. Crea un Secret en Modal llamado `candidatos-secrets`.
2. Añade `APIFY_API_TOKEN` y `GITHUB_TOKEN`.
3. Despliega: `modal deploy execution/modal_updater.py`.
