# Guía de Instalación y Compatibilidad de Versiones

## Versiones Recomendadas

### Versiones Compatibles Actualizadas:
- **Node.js**: 20.18.0 (LTS)
- **npm**: 10.x.x
- **React**: 18.3.1
- **Vite**: 6.0.1
- **@vitejs/plugin-react**: 4.3.3
- **Tailwind CSS**: 3.4.13
- **ESLint**: 9.15.0

## Instalación

### 1. Verificar/Instalar Node.js

```bash
# Verificar versión actual
node --version

# Si usas nvm, instalar la versión recomendada
nvm install 20.18.0
nvm use 20.18.0

# En Windows con nvm-windows
nvm install 20.18.0
nvm use 20.18.0
```

### 2. Limpiar e Instalar Dependencias

```bash
# Limpiar cache de npm
npm cache clean --force

# Eliminar node_modules y package-lock.json
rm -rf node_modules package-lock.json

# Instalar dependencias del frontend
npm install

# Instalar dependencias del backend
cd backend
rm -rf node_modules package-lock.json
npm install
```

### 3. Ejecutar el Proyecto

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
npm run dev
```

## Problemas Comunes y Soluciones

### Error: React 19 incompatibilidad
**Solución**: Hemos bajado a React 18.3.1 que es más estable y compatible.

### Error: Vite 7 problemas con plugins
**Solución**: Hemos bajado a Vite 5.4.8 que tiene mejor soporte.

### Error: Node.js versión muy nueva
**Solución**: Usar Node.js 20.18.0 LTS.

### Error: Tailwind CSS no carga
**Solución**: Configurado Tailwind CSS como PostCSS plugin en lugar del plugin de Vite.

## Comandos de Diagnóstico

```bash
# Verificar versiones instaladas
node --version
npm --version
npm list react react-dom
npm list vite

# Verificar problemas de dependencias
npm audit
npm outdated
```

## Notas Importantes

1. **Node.js**: Usar versión LTS (20.18.0) para máxima estabilidad
2. **React 18**: Más estable que React 19, mejor soporte del ecosistema
3. **Vite 5**: Mejor compatibilidad con React 18 y plugins
4. **Cache**: Siempre limpiar cache y node_modules al cambiar versiones

## Estructura de Archivos de Configuración

- `.nvmrc`: Especifica la versión de Node.js
- `package.json`: Dependencias actualizadas a versiones compatibles
- `vite.config.js`: Configuración optimizada para React 18
