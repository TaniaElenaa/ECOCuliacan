# ECO Culiacán: Sistema Inteligente de Gestión de Residuos

![Logo de ECO Culiacán](/public/images/ECO.png)
(/public/images/camion.gif)

## Tabla de Contenidos

- [Introducción](#-introducción)
- [Características Principales](#-características-principales)
- [Arquitectura del Sistema](#-arquitectura-del-sistema)
- [Tecnologías Utilizadas](#-tecnologías-utilizadas)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Instalación y Uso](#-instalación-y-uso)
  - [Prerrequisitos](#prerrequisitos)
  - [Configuración del Entorno](#configuración-del-entorno)
  - [Ejecución del Proyecto](#ejecución-del-proyecto)
- [Rutas de la Aplicación Web](#-rutas-de-la-aplicación-web)
- [Contacto](#-contacto)

## Introducción

**ECO Culiacán** es un sistema inteligente diseñado para revolucionar la gestión tradicional de residuos en la ciudad de Culiacán, Sinaloa. Nuestro objetivo es optimizar la recolección de basura, facilitar la interacción entre ciudadanos y personal de recolección, y promover una ciudad más limpia y sostenible.

Este repositorio contiene el código fuente y la documentación para el desarrollo del **Portal Web** de ECO Culiacán, que permite a los usuarios iniciar sesión y gestionar sus reportes, así como un panel de administración para la gestión de operaciones (si aplica).

## Características Principales

* **Autenticación de Usuarios:** Registro e inicio de sesión seguro para ciudadanos y personal de recolección/administración.
* **Gestión de Reportes:** (Menciona si los usuarios pueden ver sus reportes, crear nuevos, etc. Si es solo login, puedes omitir esto por ahora o indicar que es una funcionalidad futura).
* **Interfaz Responsiva:** Adaptable a diferentes tamaños de pantalla (escritorio, tabletas, móviles).
* **Notificaciones Flash:** Mensajes de éxito o error para una mejor experiencia de usuario.
* **Seguimiento de Contraseña:** Funcionalidad para mostrar/ocultar la contraseña en el formulario de login.
* **Integración Social:** Enlaces a las redes sociales de ECO Culiacán en el pie de página.

## Arquitectura del Sistema

El sistema ECO Culiacán sigue una arquitectura **Cliente-Servidor en Capas**, diseñada para ser modular, escalable y fácil de mantener.

* **Capa de Presentación (Frontend):**
    * **Aplicación Móvil:** Interfaz de usuario para dispositivos móviles (Android/iOS).
    * **Portal Web (Este Proyecto):** Interfaz de usuario accesible desde navegadores web para ciudadanos y administradores.
    * Ambas interfaces se comunican con el backend a través de una **API REST**.

* **Capa de Lógica de Negocio (Backend):**
    * Un servidor backend (basado en **Node.js** con **Express.js** en este caso para el portal web, o el lenguaje/framework que uses para tu backend principal) que procesa la lógica del sistema: validación de reportes, asignación de rutas, gestión de usuarios, etc.

* **Capa de Datos:**
    * **Base de Datos (MongoDB):** Almacena toda la información del sistema (usuarios, reportes, rutas, vehículos, recolecciones, etc.).

Esta arquitectura permite que los componentes operen de forma independiente, facilitando futuras mejoras y la adaptación a nuevos requisitos.

## Tecnologías Utilizadas

### Frontend (Portal Web)
* **HTML5:** Estructura de la página web.
* **CSS:** Estilos y diseño responsivo.
* **EJS (Embedded JavaScript):** Motor de plantillas para renderizar vistas dinámicas desde el servidor.
* **JavaScript (Vanilla JS):** Lógica del lado del cliente para interactividad (ej. mostrar/ocultar contraseña).

### Backend (Parte del servidor para este proyecto)
* **Node.js:** Entorno de ejecución JavaScript del lado del servidor.
* **Express.js:** Framework web para Node.js, utilizado para construir la API y gestionar rutas.
* **`express-session`:** Middleware para manejar sesiones de usuario.
* **`connect-flash`:** Middleware para mensajes flash (notificaciones temporales).
* **`passport` & `passport-local`:** Módulos para autenticación de usuarios (estrategia local con usuario y contraseña).
* **`bcryptjs`:** Librería para cifrado de contraseñas (hashing).
* **Mongoose:** Librería para modelado de objetos MongoDB en Node.js, facilitando la interacción con la base de datos.
* **`mongodb` (o `mongoose`):** Driver para conexión con la base de datos MongoDB.

### Base de Datos
* **MongoDB:** Base de datos NoSQL orientada a documentos.

## Estructura del Proyecto
├── public/                # Archivos estáticos (CSS, JS del cliente, imágenes)
│   ├── css/
│   │   └── style.css      # Estilos globales (si decides usarlo separado)
│   ├── images/
│   │   ├── ECO.png
│   │   ├── facebook.png
│   │   ├── twitter.png
│   │   ├── ig.png
│   │   ├── usuario.png
│   │   ├── iconousuario.png
│   │   ├── ojo.png
│   │   └── ojoff.png
├── views/                 # Archivos de plantillas EJS
│   ├── login.ejs          # Página de inicio de sesión
│   ├── registro.ejs       # Página de registro
│   ├── lBienvenida.ejs    # Página de bienvenida
│   └── index.ejs          # Página de inicio
├── config/                # Configuraciones (ej. base de datos, Passport)
│   ├── passport.js        # Configuración de Passport
│   └── db.js              # Configuración de conexión a la base de datos (MongoDB)
├── models/                # Definición de esquemas y modelos de Mongoose
│   ├── User.js            # Esquema y modelo para usuarios
│   └── Report.js          # Esquema y modelo para reportes
├── server.js              # Archivo principal de la aplicación Node.js
├── package.json           # Metadatos del proyecto y dependencias
├── package-lock.json      # Bloqueo de versiones de dependencias
└── README.md              # Este archivo
## Instalación y Uso

Sigue estos pasos para configurar y ejecutar el proyecto en tu máquina local.

### Prerrequisitos

Asegúrate de tener instalado lo siguiente:

* **Node.js** (versión 14 o superior recomendada)
* **npm** (viene con Node.js)
* **MongoDB Server** 

### Configuración del Entorno

1.  **Clona este repositorio:**
    ```bash
    git clone https://github.com/TaniaElenaa/ECOCuliacan
    cd ECOCuliacan
    ```

2.  **Instala las dependencias de Node.js:**
    ```bash
    npm install
    ```

3.  **Configura tu base de datos MongoDB:**
    * Asegúrate de que tu servidor MongoDB esté corriendo.
    * En tu archivo de configuración de la base de datos (por ejemplo, `config/db.js`), especifica la URL de conexión a tu instancia de MongoDB. Por ejemplo: `mongodb://localhost:27017/eco_culiacan_db`.
    * **Importante:** Deberás definir un modelo de usuario (por ejemplo, en `models/User.js`) usando Mongoose, con campos para `username` y `password` que Passport.js usará para la autenticación.

### Ejecución del Proyecto

1.  **Inicia el servidor MongoDB.**
2.  **Ejecuta la aplicación Node.js:**
    ```bash
    npm start
    ```
    o si no tienes `npm start` configurado en `package.json`:
    ```bash
    node server.js
    ```
  

3.  **Accede a la aplicación:**
    Abre tu navegador web y navega a `http://localhost:3000` 

## Rutas de la Aplicación Web

* `/`: Página de inicio (puede redirigir a `/login` si no hay sesión).
* `/login`: Página de inicio de sesión.
* `/register`: Página de registro de nuevos usuarios.
* `/logout`: Cierra la sesión del usuario.




## Contacto

Para cualquier pregunta o comentario, puedes contactar al equipo de ECO Culiacán:

* **Twitter/X:** [x.com/ECOCuliacan](https://x.com/ECOCuliacan)
* **Facebook:** [ECO Culiacán en Facebook](https://www.facebook.com/people/ECO-Culiac%C3%A1n/61576558111783/)
* **Instagram:** [eco.culiacan en Instagram](https://www.instagram.com/eco.culiacan/profilecard/)

---
