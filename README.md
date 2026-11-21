# Presentación MEN · Tecnología en Desarrollo de Medios Gráficos Visuales (DMGV)

**Nuevo Lugar de Desarrollo:** Municipio de Itagüí – Centro Tecnológico del Mobiliario (CTM · Cód. 9205)  
**Centro Núcleo:** Centro para la Industria de la Comunicación Gráfica (CENIGRAF · Bogotá D.C.)  
**Radicado:** RD34720 · **Código SOFIA:** 522309 V2 · **Red de Conocimiento:** Artes Gráficas

## Flujo de trabajo Git (`dev` → `main` → Railway)

- `main`: Rama de producción conectada a Railway (despliegue automático).
- `dev`: Rama de trabajo para nuevas actualizaciones y revisiones antes de publicar.

```bash
# Trabajar cambios en dev
git checkout dev
git add .
git commit -m "Descripción del ajuste"
git push origin dev

# Aprobar y publicar en Railway (merge dev -> main)
git checkout main
git pull origin main
git merge dev
git push origin main
git checkout dev
```
