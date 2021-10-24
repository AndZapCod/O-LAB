# Repositorio del Backend para la aplicación O-LAB

## Para empezar

Este proyecto necesita `nodejs`, `npm` y `postgresql`

## Paso 0) Crear las variables de ambiente

Primero se debe configurar las variables de ambiente para comunicarse con postgres, para esto, cree un archivo llamado `.env` en el proyecto y allí ponga lo siguiente

`PSQL_HOST=<PSQL HOST>`

`PSQL_USER=<PSQL USER>`

`PSQL_PASS=<PSQL PASSWORD>`

Reemplace `<PSQL HOST>` por la IP del host de postgres que esté usando, usualmente es `localhost`, `<PSQL USER>` por el usuario de postgres, usualmente es `postgres`, y `<PSQL PASSWORD>`por la contraseña del usuario de postgres.

## Paso 1) Instalar lad dependencias

Para instalar las dependencias del proyecto ejecute

`npm ci`

## Paso 2) Correr los test

Es importante para determinar que la base de datos local esté funcionando y las rutas estén funcionando, para esto corra

`npm run test`

## Paso 3) Pruebe el proyecto

Con todo configurado y probado inicie el proyecto corriendo

`npm run start`