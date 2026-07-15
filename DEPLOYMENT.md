# Deployment Guide

Este proyecto está configurado para desplegarse automáticamente en **Codeberg Pages** y **GitHub Pages** mediante CI/CD.

## Codeberg Pages (Principal)

### Configuración Inicial

1. **Habilitar Woodpecker CI en Codeberg:**
   - Ve a tu repositorio en Codeberg: https://codeberg.org/mkmonreal/star-coordinates-d3
   - Navega a **Settings → Woodpecker CI**
   - Activa Woodpecker CI para el repositorio

2. **Crear token de acceso (necesario para deploy):**
   - Ve a tu perfil en Codeberg → **Settings → Applications → Access Tokens**
   - Crea un nuevo token con permisos de **write:repository**
   - Copia el token (solo se muestra una vez)

3. **Configurar el secret en Woodpecker:**
   - En la interfaz de Woodpecker CI (https://ci.codeberg.org)
   - Ve a tu repositorio → **Settings → Secrets**
   - Añade un secret llamado `codeberg_token` con el valor del token creado

4. **Habilitar Pages:**
   - En Codeberg, ve a **Settings → Pages**
   - Selecciona la rama `pages` como fuente
   - Guarda los cambios

### URL de la aplicación desplegada

Una vez configurado, la aplicación estará disponible en:
```
https://mkmonreal.codeberg.page/star-coordinates-d3/
```

### Funcionamiento

- Cada `push` a la rama `main` dispara automáticamente:
  1. Build de la aplicación con Vite
  2. Deploy a la rama `pages`
  3. Codeberg Pages sirve el contenido de la rama `pages`

## GitHub Pages (Alternativo)

### Configuración Inicial

1. **Habilitar GitHub Pages:**
   - Ve a **Settings → Pages** en GitHub
   - En **Source**, selecciona **GitHub Actions**
   - Guarda los cambios

2. **Permisos del workflow:**
   - Ve a **Settings → Actions → General**
   - En **Workflow permissions**, selecciona:
     - ✅ "Read and write permissions"
   - Guarda los cambios

### URL de la aplicación desplegada

```
https://mkmonreal.github.io/star-coordinates-d3/
```

### Funcionamiento

- El workflow de GitHub Actions (`.github/workflows/publish.yml`) se ejecuta automáticamente en cada push a `main`
- El workflow hace build y despliega usando la acción oficial `actions/deploy-pages`

## Configuración Local para Testing

### Build de producción

```bash
# Build para GitHub Pages (usa base path /star-coordinates-d3/)
pnpm run build

# Build para Codeberg Pages (usa base path /)
CODEBERG_PAGES=true pnpm run build
```

### Preview del build

```bash
pnpm run preview
```

## Base Path

El proyecto usa configuración dinámica del `base` en `vite.config.js`:

- **Codeberg Pages**: `base: '/'` (root del dominio)
- **GitHub Pages**: `base: '/star-coordinates-d3/'` (subpath)

La detección es automática mediante la variable de entorno `CODEBERG_PAGES`.

## Troubleshooting

### Woodpecker CI no se ejecuta

1. Verifica que Woodpecker está habilitado en Settings → Woodpecker CI
2. Revisa los logs en https://ci.codeberg.org
3. Verifica que el archivo `.woodpecker/deploy.yml` está en la raíz del repo

### Error de permisos en deploy

1. Verifica que el secret `codeberg_token` está configurado
2. Verifica que el token tiene permisos de `write:repository`
3. Regenera el token si es necesario

### GitHub Pages no se actualiza

1. Ve a **Actions** y verifica que el workflow se ejecutó correctamente
2. Verifica los permisos del workflow en Settings → Actions → General
3. Revisa que Pages está configurado con "GitHub Actions" como source

### La aplicación no carga (404 en assets)

1. Verifica el `base` en `vite.config.js`
2. Comprueba que el build se hizo con la variable de entorno correcta
3. Inspecciona las rutas en `dist/index.html`

## Monitoreo

- **Codeberg CI**: https://ci.codeberg.org/mkmonreal/star-coordinates-d3
- **GitHub Actions**: https://github.com/mkmonreal/star-coordinates-d3/actions
- **Codeberg Pages**: https://mkmonreal.codeberg.page/star-coordinates-d3/
- **GitHub Pages**: https://mkmonreal.github.io/star-coordinates-d3/
