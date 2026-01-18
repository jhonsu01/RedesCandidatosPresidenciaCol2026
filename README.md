# Monitor Elecciones Colombia 2026

Web App para monitorizar en tiempo real el crecimiento en redes sociales de los candidatos presidenciales confirmados para 2026.

## Características

- **Diseño Premium**: Interfaz moderna con glassmorphism y animaciones.
- **Datos Reales**: Lista de 20 candidatos confirmados (Fuente: Pares.com.co).
- **Competencia**: Ranking por total de seguidores y actualización de tendencias.
- **Cuenta Regresiva**: Contador automático hasta el día de las elecciones (Estimado: Mayo 2026).
- **Backend Serverless**: Script preparado para ejecutarse en Modal.com cada 24 horas.

## Estructura del Proyecto

- `index.html`, `style.css`, `app.js`: Frontend estático.
- `data.json`: Base de datos ligera con los candidatos y sus métricas.
- `execution/modal_updater.py`: Script para actualizar `data.json`.

## Cómo Desplegar en GitHub Pages

1.  Sube, `index.html`, `style.css`, `app.js` y `data.json` a la raíz de tu repositorio `RedesCandidatosPresidenciaCol2026`.
2.  Ve a `Settings` > `Pages` en GitHub.
3.  Selecciona la rama `main` y guarda.
4.  Tu web estará online en segundos.

## Automatización con Modal.com

El archivo `execution/modal_updater.py` contiene la lógica para actualizar los datos diariamente.

1.  Instala Modal: `pip install modal`.
2.  Configura tus secretos de API si decides usar una herramienta como Apify o scraping personalizado.
3.  Modifica el script para que haga `git push` de los cambios a este repositorio una vez actualice el JSON, o configura un endpoint que la web consuma.

## Donaciones

Botón de Ko-fi incluido en el footer.

---

Generado por Antigravity Agent.
