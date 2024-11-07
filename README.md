# TechMobile 📱

Una aplicación web para la gestión de inventario y asignación de productos móviles, desarrollada con React, Node.js y MongoDB.

## 🌟 Características

- Gestión completa de productos (CRUD)
- Gestión de usuarios (CRUD)
- Asignación de productos a usuarios
- Autenticación y autorización con Auth0
- Interfaz de usuario moderna con Ant Design
- Paginación y búsqueda en tiempo real
- API RESTful documentada con Swagger

## 🚀 Tecnologías Utilizadas

### Frontend
- React 18
- React Router DOM
- Auth0 React SDK
- Ant Design
- Axios

### Backend
- Node.js
- Express
- MongoDB
- Mongoose
- JWT Authentication
- Swagger

## 📋 Prerrequisitos

- Node.js (v14 o superior)
- MongoDB
- Cuenta en Auth0

## ⚙️ Configuración

1. Clona el repositorio
```bash
git clone https://github.com/tu-usuario/techmobile.git
cd techmobile
```

2. Instala las dependencias del servidor
```bash
cd server
npm install
```

3. Instala las dependencias del cliente
```bash
cd client
npm install
```

4. Crea un archivo `.env` en la raíz del servidor con las siguientes variables:
```env
PORT=3000
MONGODB_URI=tu_uri_de_mongodb
AUTH0_DOMAIN=tu_dominio_auth0
AUTH0_AUDIENCE=tu_audience_auth0
```

5. Crea un archivo `.env` en la raíz del cliente con las siguientes variables:
```env
REACT_APP_API_URL=http://localhost:3000/api
REACT_APP_AUTH0_DOMAIN=tu_dominio_auth0
REACT_APP_AUTH0_CLIENT_ID=tu_client_id_auth0
REACT_APP_AUTH0_AUDIENCE=tu_audience_auth0
```

## 🏃‍♂️ Ejecución

1. Inicia el servidor:
```bash
cd server
npm start
```

2. En otra terminal, inicia el cliente:
```bash
cd client
npm start
```

La aplicación estará disponible en `http://localhost:3000`

## 🛣️ Estructura del Proyecto

```
techmobile/
├── client/                 # Frontend React
│   ├── public/
│   └── src/
│       ├── components/     # Componentes React
│       ├── auth/          # Configuración de Auth0
│       └── App.js         # Componente principal
└── server/                # Backend Node.js
    └── src/
        ├── models/        # Modelos Mongoose
        ├── modules/       # Módulos de la API
        └── utils/         # Utilidades

```

## 📚 API Documentation

La documentación de la API está disponible en `/api-docs` cuando el servidor está en ejecución. Utiliza Swagger UI para una visualización interactiva de todos los endpoints disponibles.

## 🔐 Seguridad

- Autenticación mediante Auth0
- JWT para la protección de rutas
- Validación de datos en el backend
- Control de acceso basado en roles

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor, sigue estos pasos:

1. Fork el proyecto
2. Crea una rama para tu característica (`git checkout -b feature/AmazingFeature`)
3. Realiza tus cambios
4. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
5. Push a la rama (`git push origin feature/AmazingFeature`)
6. Abre un Pull Request

## ✍️ Autores

* **Camila Urenda** - *Trabajo Inicial* - camiurenda - (https://github.com/camiurenda)

