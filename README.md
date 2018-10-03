# Gulp Setup
Configuración ligera de gulp para automatizar procesos en el desarrollo web y mejorar la experiencia de desarrollo.

## Instalación
```
$ git clone https://github.com/mmirca/movinder.git
$ cd gulp-setup
$ npm install -g gulp
$ npm install gulp
```

## Tareas para el desarrollo
**watch** Abre entorno de desarrollo live en tu navegador predeterminado. Compila tu el código scss de app/scss en tiempo real a app/css y muestra los cambios en el navegador sin necesidad de refrescar.
```
$ gulp watch
```
**clean:dist** Borra todos los archivos que se encuentran en la carpeta dist.
```
$ gulp clean:dist
```
**sass** Compila los archivos scss de app/scss a la carpeta app/css.
```
$ gulp sass
```
**minifyImages** Comprime todas las imagenes que se encuentran en app/images y las almacena en dist/images.
```
$ gulp minifyImages
```

## Build básico
**build** Procesa los archivos de la carpeta app y los almacena en la carpeta dist. Incluye minificación de los archivos css y la transpilación a ES2015 y minificación de los archivos js.
```
$ gulp build
```
**build:imagemin** Ejecuta las mismas funciones que la tarea build y comprime las imagenes del proyecto que se encuentren en app/images.
```
$ gulp build:imagemin
```

## Build con bundle js
**build:bundle** Procesa los archivos de la carpeta app y los almacena en la carpeta dist. Incluye minificación de los archivos css y la transpilación a ES2015, minificación y creación de un bundle a partir de los archivos js referenciados en html.
```
$ gulp build:bundle
```
Para que los archivos js sean incluidos en el bundle y la referencia necesaria incluida en el html hay que encapsular las etiquetas script de la siguiendo este modelo:
```
<!-- build:js -->
    <script src="script_1.js">
    <script src="script_2.js">
<!-- endbuild -->
```

**build:bundle:imagemin** Ejecuta las mismas funciones que build:bundle pero también comprime las imágenes que se encuentran en app/images.
```
$ gulp build:bundle:imagemin
```

## Build estricto
**build:strict** Procesa las imagenes, los archivos html y las referencias encontradas en estos siguiendo el formato indicado por [useref](https://www.npmjs.com/package/gulp-useref)
```
$ gulp build:strict
```
**build:strict:imagemin** Ejecuta las mismas funciones que build:strict pero también comprime las imágenes que se encuentran en app/images.
```
$ gulp build:strict:imagemin
```