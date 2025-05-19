# Nombre de tu Proyecto Full-Stack
Una descripción concisa y atractiva de tu proyecto. Explica qué problema resuelve, sus características principales y su objetivo.
# Estructura del Proyecto
Este repositorio contiene tanto el código del backend (Django) como el del frontend (React). La estructura de carpetas es la siguiente:

mi-proyecto-fullstack/
├── backend/          # Código del proyecto Django
│   ├── myproject/    # Configuración principal de Django
│   ├── myapp/        # Una de tus aplicaciones Django (puede haber más)
│   ├── manage.py     # Utilidad de línea de comandos de Django
│   ├── requirements.txt # Dependencias de Python
│   └── venv/         # Entorno virtual de Python (IGNORADO por Git)
├── frontend/         # Código de la aplicación frontend (React)
│   ├── public/       # Archivos públicos
│   ├── src/          # Archivos fuente de React
│   ├── package.json  # Dependencias de Node.js y scripts
│   └── node_modules/ # Dependencias de Node.js (IGNORADO por Git)
├── .gitignore        # Archivo para ignorar archivos y carpetas en Git
└── README.md         # Este archivo

# Requisitos Previos
Asegúrate de tener instalado lo siguiente en tu sistema:
- Python 3.8+ (Recomendado usar la última versión estable)
- Node.js 14+ (Recomendado usar la última versión LTS)
- npm (viene con Node.js) o Yarn
- Puedes verificar tus versiones con estos comandos:

    python --version
    node --version
    npm --version
    yarn --version

# Configuración e Instalación
Sigue estos pasos para configurar y ejecutar el proyecto en tu entorno local.

1. Clonar el RepositorioSi aún no has clonado el repositorio, hazlo:

git clone <URL_DE_TU_REPOSITORIO>
cd nombre-de-la-carpeta-clonada

2. Configuración del Backend (Django)Navega a la carpeta del backend, crea un entorno virtual e instala las dependencias de Python.# Navega a la carpeta del backend
cd backend

# Crea un entorno virtual (si no existe)
python3 -m venv venv

# Activa el entorno virtual
# En Linux/macOS:
source venv/bin/activate
# En Windows (Command Prompt):
.\venv\Scripts\activate
# En Windows (PowerShell):
.\venv\Scripts\Activate.ps1

# Instala las dependencias de Python
# Si encuentras el error "externally-managed-environment", usa:
./venv/bin/pip install -r requirements.txt
# De lo contrario, puedes usar:
# pip install -r requirements.txt

# Aplica las migraciones de la base de datos
python manage.py migrate

# (Opcional) Crea un superusuario para acceder al panel de administración de Django
python manage.py createsuperuser

# Vuelve a la carpeta raíz del proyecto
deactivate # Desactiva el entorno virtual del backend
cd ..

3. Configuración del Frontend (React)
Navega a la carpeta del frontend e instala las dependencias de Node.js.# Navega a la carpeta del frontend
cd frontend

# Instala las dependencias de Node.js
npm install
# o si usas Yarn:
# yarn install

# Vuelve a la carpeta raíz del proyecto
cd ..

# Cómo Ejecutar el Proyecto
Necesitarás ejecutar el servidor de Django (backend) y el servidor de desarrollo de React (frontend) por separado. Es recomendable usar dos terminales.
1. Iniciar el Backend
Abre una terminal, navega a la carpeta backend/, activa el entorno virtual e inicia el servidor de Django.
- Abre una nueva terminal
cd backend
- Crea un entorno virtual (si no existe)
python3 -m venv venv
- Activa el entorno virtual
source venv/bin/activate 
- Inicia el servidor de Django
python manage.py runserver

El servidor de Django se ejecutará por defecto en http://127.0.0.1:8000/.2. 
# Iniciar el Frontend
Abre una segunda terminal, navega a la carpeta frontend/ e inicia la aplicación de React.
- Abre una segunda terminal
cd frontend
- Inicia la aplicación de React
npm run start    
- si usas Yarn
yarn start


La aplicación de React se abrirá por defecto en tu navegador en http://localhost:3000/ (o el puerto configurado por Create React App/Vite).
# Scripts Útiles
## Backend (desde la carpeta backend/ con el entorno virtual activado)
- python manage.py runserver: Inicia el servidor de desarrollo de Django.
- python manage.py migrate: Aplica las migraciones de la base de datos.
- python manage.py makemigrations <nombre_app>: Crea nuevas migraciones para una aplicación específica.
- python manage.py createsuperuser: Crea un superusuario.
- pip freeze > requirements.txt: Actualiza el archivo de dependencias de Python.
## Frontend (desde la carpeta frontend/)
- npm start o yarn start: Inicia el servidor de desarrollo de React.
- npm build o yarn build: Compila la aplicación de React para producción.
- npm test o yarn test: Ejecuta los tests del frontend.

# Contribución
Si deseas contribuir a este proyecto, por favor, sigue estos pasos:
1. Haz un fork del repositorio.
2. Crea una nueva rama (git checkout -b feature/nueva-funcionalidad).
3. Realiza tus cambios y commitea (git commit -m 'feat: añade nueva funcionalidad').
4. Push a tu fork (git push origin feature/nueva-funcionalidad).
5. Abre un Pull Request describiendo tus cambios.

# Licencia
Este proyecto está bajo la Licencia [Nombre de la Licencia, ej: MIT]. 
Consulta el archivo LICENSE para más detalles.
¡Esperamos que disfrutes trabajando en este proyecto! Si tienes alguna pregunta, no dudes en abrir un issue.