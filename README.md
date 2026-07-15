# Star Coordinates D3.js

Aplicación web para visualización interactiva de datos multidimensionales mediante la técnica Star Coordinates, desarrollada con React y D3.js.

**Trabajo de Fin de Grado**
Grado en Ingeniería Informática
Universidad Rey Juan Carlos (2025-2026)

- **Autor:** Miguel Ángel Monreal Velasco
- **Tutor:** Manuel Rubio Sánchez
- **Título:** *Visualización interactiva de datos multidimensionales mediante Star Coordinates: una aplicación web desarrollada con React y D3.js*

**Enlaces:**
- Aplicación desplegada: <https://mkmonreal.github.io/star-coordinates-d3/>
- Repositorio de la memoria: <https://codeberg.org/mkmonreal/star-coordinates-d3-thesis>
- Repositorio de código: <https://codeberg.org/mkmonreal/star-coordinates-d3>

---

## Descripción

Star Coordinates D3.js es una **aplicación web de página única (SPA)** que permite explorar visualmente conjuntos de datos multidimensionales mediante la técnica de proyección Star Coordinates. La aplicación se ejecuta íntegramente en el navegador: **todos los datos se procesan localmente y nunca abandonan el equipo del usuario**.

Está diseñada para análisis exploratorio de datos por parte de investigadores, analistas de datos y estudiantes que necesiten visualizar relaciones entre múltiples variables en un espacio bidimensional sin perder el etiquetado de las dimensiones originales.

### ¿Qué es Star Coordinates?

Star Coordinates es una técnica de visualización que proyecta datos n-dimensionales en un plano 2D mediante la fórmula `P = X · V`, donde:

- `X` es la matriz de datos (N muestras × n variables)
- `V` es la matriz de ejes (n variables × 2 coordenadas)
- Cada variable tiene un eje etiquetado que parte del origen
- Cada muestra se proyecta como un punto en el plano

**Nota importante:** Los métodos de configuración automática de ejes (PCA, LDA, OSC) implementados en esta aplicación **reorientan los ejes sin reducir la dimensionalidad**. Los n ejes originales permanecen todos presentes y etiquetados; ninguna variable se descarta.

---

## Formato de Entrada

La aplicación acepta archivos CSV con las siguientes características:

**Requisitos obligatorios:**
- Primera fila con **cabecera** (nombres de columnas)
- Al menos **2 columnas numéricas** sin valores nulos
- Codificación UTF-8

**Características opcionales:**
- **Columna de clase:** columna categórica para colorear puntos por grupos (útil para LDA)
- Se genera automáticamente una columna de ID interno si no se especifica

**Ejemplos de datasets incluidos:**
- `public/datasets/Iris.csv` — 150 muestras, 4 variables, 3 clases
- `public/datasets/Wine dataset.csv` — 178 muestras, 13 variables, 3 clases

---

## Funcionalidades

### Carga y Preprocesamiento de Datos

- **Carga de CSV** desde el navegador con detección automática de cabecera y tipos
- **Normalización min-max:** escala cada variable a [0, 1]
- **Estandarización z-score:** transforma cada variable a media 0 y desviación típica 1
- **Selección de columnas:** activar/desactivar variables de la visualización
- **Selección de columna de ID** para identificar muestras

### Visualización Interactiva

- **Renderizado de Star Coordinates:** un eje por variable, un punto por muestra
- **Arrastre libre de ejes** con el ratón
- **Modificación numérica de vectores** por formulario (coordenadas cartesianas o polares)
- **Coloreado de puntos por clase** con paletas configurables (Viridis, Plasma, Inferno, etc.)
- **Ajuste de opacidad y radio** de los puntos de datos
- **Selección rectangular** de subconjuntos de puntos con modo de selección interactivo
- **Consulta del detalle de muestras:** hover para vista rápida, clic para drawer completo
- **Movimiento automático del lienzo** para mantener la visualización visible

### Configuración Automática de Ejes

- **Configuración inicial equiespaciada:** ejes distribuidos uniformemente en círculo
- **PCA (Principal Component Analysis):** orientación de ejes según componentes principales
- **LDA (Linear Discriminant Analysis):** orientación para maximizar separación entre clases (requiere columna de clase)
- **OSC (Orthographic Star Coordinates):** ortogonalización de Gram-Schmidt puramente geométrica

---

## Stack Tecnológico

**Frontend:**
- React 18.3.1 — componentes e interfaz
- D3.js 7.9.0 — renderizado SVG, escalas y manejo de eventos
- Ant Design 5.24.3 — componentes de UI
- Zustand 5.0.3 — gestión de estado global

**Cálculo Numérico:**
- math.js 14.3.1 — álgebra lineal (matrices, autovectores, operaciones numéricas)

**Herramientas de Desarrollo:**
- Vite 6.2.0 — bundler y servidor de desarrollo
- Vitest 3.0.9 — runner de tests unitarios
- ESLint 9.21.0 — análisis estático de código
- pnpm 10.18.3 — gestor de dependencias

### Arquitectura

La aplicación sigue una arquitectura por capas lógicas:

1. **Capa de datos:** carga de CSV (d3-dsv) y preprocesado
2. **Capa de dominio/cálculo:** normalización, proyección (P = X·V), PCA, LDA, OSC
3. **Capa de estado:** almacenes de Zustand como fuente de verdad
4. **Capa de presentación:** componentes React + Ant Design + lienzo SVG gestionado por D3.js

La capa de cálculo está deliberadamente aislada de la presentación para permitir validación exhaustiva mediante pruebas unitarias.

---

## Puesta en Marcha

### Requisitos Previos

- Node.js 22+ (según configuración del proyecto)
- pnpm 10+ (especificado en `packageManager` de package.json)

### Instalación

```bash
# Clonar el repositorio
git clone https://codeberg.org/mkmonreal/star-coordinates-d3.git
cd star-coordinates-d3

# Instalar dependencias
pnpm install
```

### Desarrollo

```bash
# Iniciar servidor de desarrollo
pnpm dev

# La aplicación estará disponible en http://localhost:5173
```

### Producción

```bash
# Generar build de producción
pnpm build

# Preview del build (opcional)
pnpm preview
```

Los archivos generados estarán en el directorio `dist/`.

### Calidad de Código

```bash
# Ejecutar tests unitarios
pnpm test

# Ejecutar tests en modo watch
pnpm test:ui

# Ejecutar linter
pnpm lint
```

---

## Despliegue

La aplicación se despliega automáticamente a **GitHub Pages** y **Codeberg Pages** mediante CI/CD:

- **GitHub Pages:** <https://mkmonreal.github.io/star-coordinates-d3/>
  - GitHub Actions ejecuta el workflow `.github/workflows/publish.yml`
  - Se dispara automáticamente en cada push a `main`

- **Codeberg Pages:** (configuración en `.woodpecker/deploy.yml`)
  - Woodpecker CI ejecuta el pipeline de despliegue
  - Despliega a la rama `pages`

Consulta `DEPLOYMENT.md` para instrucciones detalladas de configuración de los servicios de CI/CD.

---

## Tests

El proyecto implementa **95 tests unitarios** que validan la capa matemática:

- **Normalización:** min-max y z-score con casos límite
- **Proyección:** cálculo de P = X·V con verificación manual
- **PCA:** centrado, matriz de covarianza, descomposición espectral, ortonormalidad
- **LDA:** matrices de dispersión (Sw, Sb), problema de autovalores, caso de 2 clases
- **OSC:** ortonormalidad (Vᵀ·V = I), independencia de datos, idempotencia con PCA

**Conjuntos de validación:**
- Iris (150 × 4, 3 clases)
- Wine (178 × 13, 3 clases)

**Validación cruzada:** Los resultados de PCA se contrastan con sklearn (scikit-learn) para verificar corrección numérica.

**Capa visual:** La interfaz de usuario se valida manualmente mediante pruebas exploratorias, sin tests automatizados.

---

## Licencia

Este proyecto está licenciado bajo **Apache License 2.0**. Consulta el archivo [`LICENSE`](./LICENSE) para más detalles.

---

## Reconocimientos

- Desarrollado con React, D3.js, math.js y Zustand
- Inspirado en la técnica de visualización Star Coordinates
- Datasets de ejemplo: Iris y Wine (UCI Machine Learning Repository)
