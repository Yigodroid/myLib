# miBib - Gestión de Biblioteca

Una aplicación web moderna para gestionar tu biblioteca personal de libros.

## 🚀 Características

- ✅ Agregar nuevos libros a tu biblioteca
- ✅ Ver lista completa de tus libros
- ✅ Gestionar estado de disponibilidad (Disponible, Prestado, En Lectura, Leído)
- ✅ Interfaz moderna y responsive
- ✅ Construcción con Next.js 14 y React 18

## 📋 Requisitos Previos

- Node.js 18+ instalado
- npm o yarn

## 🔧 Instalación

1. **Instala las dependencias:**
```bash
npm install
```

2. **Configura las variables de entorno (.env.local):**
```
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## ▶️ Ejecutar la Aplicación

### Modo Desarrollo
```bash
npm run dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)

### Modo Producción
```bash
npm run build
npm start
```

## 📁 Estructura del Proyecto

```
.
├── app/
│   ├── api/
│   │   └── libros/
│   │       └── route.ts        # API endpoints para libros
│   ├── layout.tsx              # Layout principal
│   ├── page.tsx                # Página principal
│   └── globals.css             # Estilos globales
├── components/
│   ├── FormCrearLibro.tsx      # Formulario para agregar libros
│   └── ListaLibros.tsx         # Componente para mostrar lista de libros
├── lib/
│   └── api.ts                  # Funciones auxiliares de API
├── package.json                # Dependencias del proyecto
├── tsconfig.json               # Configuración TypeScript
└── tailwind.config.ts          # Configuración Tailwind CSS
```

## 🎨 Tecnologías Utilizadas

- **Next.js 14** - Framework React con SSR
- **React 18** - Librería UI
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos CSS
- **ESLint** - Linting de código

## 📝 API Endpoints

### GET /api/libros
Obtiene la lista de todos los libros.

**Respuesta:**
```json
[
  {
    "id": 1,
    "titulo": "El Quijote",
    "autorId": 1,
    "autor": "Miguel de Cervantes",
    "estado": "disponible",
    "fechaCreacion": "2024-01-15T00:00:00.000Z"
  }
]
```

### POST /api/libros
Crea un nuevo libro.

**Body:**
```json
{
  "titulo": "Nuevo Libro",
  "autor": "Nombre del Autor",
  "autorId": 1,
  "estado": "disponible"
}
```

## 🤝 Contribuir

Las contribuciones son bienvenidas. Para cambios mayores, abre primero un issue para discutir los cambios propuestos.

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

---

**Creado con ❤️ para amantes de los libros**
