# Command Executor (Aplicación de Escritorio)

## Descripción

Command Executor es una potente aplicación de escritorio diseñada para ejecutar comandos de terminal personalizados en diferentes sistemas operativos, de forma remota. Funciona como el ejecutor local de los comandos gestionados a través de la aplicación web complementaria.

## Características Principales

- **Ejecución de Comandos Multiplataforma:** Ejecuta comandos de terminal personalizados en macOS, Windows y Linux.
- **Integración con Aplicación Web:** Recibe y ejecuta comandos creados y gestionados en la interfaz web.
- **Comunicación Segura:** Utiliza Supabase para una sincronización de datos segura entre las aplicaciones de escritorio y web.
- **Ligera y Eficiente:** Construida con Electron y React para un rendimiento óptimo.

## Tecnologías Utilizadas

- **Framework:** Electron
- **Frontend:** React con TypeScript
- **Herramienta de Construcción:** Vite
- **Estilos:** Tailwind CSS
- **Integración de Base de Datos:** Supabase

## Demos

https://github.com/user-attachments/assets/39b23d3f-3bc1-4cf9-9a66-ccfc90f56467

https://github.com/user-attachments/assets/e8beae5e-68c1-4870-b643-469ee4bfbad9

https://github.com/user-attachments/assets/2591e6f3-1a44-4e4f-a814-cf8fb599b4e1

https://github.com/user-attachments/assets/3e369c55-e760-4a62-a7b1-89ca0ee56811

## Instalación

1. Clona el repositorio:

   ```
    https://github.com/iamyare/electron-command-executor.git
    cd electron-command-executor
   ```

2. Instala las dependencias:

   ```
   npm install
   ```

3. Crea un archivo `.env` en el directorio raíz y añade tus credenciales de Supabase:

   ```
    VITE_SUPABASE_URL=url_de_tu_proyecto_supabase
    VITE_SUPABASE_KEY=tu_clave_anonima_de_supabase
    VITE_SECRET_KEY=la_clave_secreta
   ```

4. Inicia la aplicación:
   ```
   npm run dev
   ```

## Uso

1. Lanza la aplicación.
2. Inicia sesión utilizando tus credenciales (sincronizadas con la aplicación web).
3. La aplicación recibirá y ejecutará automáticamente los comandos enviados desde la interfaz web.

## Estado Actual y Limitaciones

- **Funcionalidad Principal:** La aplicación se centra actualmente en la ejecución de comandos. Las características de la interfaz gráfica están planeadas para futuras actualizaciones.
- **Soporte de Plataformas:** Totalmente funcional en macOS, Windows y Linux.
- **Próximas Funcionalidades:** Interfaz visual para la gestión local de comandos y registros de ejecución.

## Contribuciones

¡Las contribuciones son bienvenidas! No dudes en enviar un Pull Request.

## Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo [LICENSE](LICENSE) para más detalles.

## Contacto

- **GitHub:** [iamyare](https://github.com/iamyare)
- **Instagram:** [i.am.yare](https://www.instagram.com/i.am.yare)
- **GitHub:** [carlosaid](https://github.com/carlosaid)
