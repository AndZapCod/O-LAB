# Rutas de la API

## Autenticación

- **Ruta login**: permite al usuario logearse en la aplicación. Solicitud *post* que recibe email (correo institucional) y contraseña. Genera un token de acceso.

```
http://IP:3000/auth/login

input:

{
    "correo":"correoejemplo@urosario.edu.co",
    "contrasenia": "123457"
}

Output:

{
    token:"XXXXXXXX"
}
```

- **Ruta cambio contraseña**: Ruta para que el usuario cambie contraseña. Solicitud *put* que recibe contraseña antigua y nueva. Regresa un mensaje informando que se cambio exitosamente si el proceso se llevo bien. De lo contrario retorna un mensaje de error. Necesita **AUTENTICACION** por lo que el usuario debe loguearse previamente. El token se ingresa en la cabecera de la peticion en un campo llamado "**token-acceso**".

```
http://IP:3000/auth/cambioContrasenia

Input:

{
    "antiguaContrasenia":"12345",
    "nuevaContrasenia": "98765"
}

Output:

{
    'Contraseña actualizada correctamente'
}

Output error:

{
    'No fue posible actualizar la contraseña'
}
```
- **Ruta registrar usuarios**: Ruta para registrar usuarios masivamente. Solicitud **post** que recibe un arreglo de JSON con informacion de los usuarios. Esta ruta requiere el rol de **administrador** para usarse (ademas de **AUTENTICACION**). Debe retornar un archivo (tentativamente .xlsx o .csv) con los correos y sus contraseñas generadas.

```
http://IP:3000/auth/signup

Input:

[
    {
        "correo": "germanobando@urosario.edu.co",
        "nombre":"German",
        "apellido1":"Obando",
        "rol":"administrador",
        "posicion":"profesor"
    },
    {
        "correo": "aliriogonzales@urosario.edu.co",
        "nombre":"Alirio",
        "apellido1":"Gonzales",
        "rol":"cliente",
        "posicion":"estudiante" 
    }
]

Output:

Archivo .csv o .xlsx con correo y contraseña

Output error:

{
    'Hay problemas para registrar los usuarios'
}
```
## Prestamos
-**Ruta crear reserva**: Ruta para ingresar una reserva. Solicitud *post* que recibe un JSON con un arreglo de arreglos con los elementos para reservar (serial y cantidad). La ruta requiere **AUTENTICACION** por lo que el usuario debe loguearse previamente. El token se ingresa en la cabecera de la peticion en un campo llamado "**token-acceso**".

```
http://IP:3000/prestamos/crearReserva

Input:

{
    "elementos":[["pop321","3"],["abc456","5"]]
}

Output:

{
    'Reserva No. P-a4sb5fs3 creada'
}

Output error:

{
    'Hay un problema para crear la reserva'
}
```

-**Ruta ver estado de reservas**: Ruta que permite obtener unicamente las reservas de todos los usuarios. Solicitud *get* que retorna un arreglo con objetos JSON con informacion sobre todas las reservas. Esta ruta requiere el rol de **auxiliar** o **administrador** y por tanto **AUTENTICACION**. El token se ingresa en la cabecera de la peticion en un campo llamado "**token-acceso**".
```
http://IP:3000/prestamos/estadoReservas

Input:

NA

Output:

[
    {
        "prestamo_id": "P-0Mg5dv",
        "nombre": "German Obando",
        "posicion": "profesor",
        "correo": "germanobando@urosario.edu.co",
        "entrega": "2021-11-19T05:00:00.000Z"
    },
    {
        "prestamo_id": "P-CVARKL",
        "nombre": "Andres Perez",
        "posicion": "estudiante",
        "correo": "andresperez@urosario.edu.co",
        "entrega": "2021-11-19T05:00:00.000Z"
    }
]
Output error:

{
    'Hay un problema para obtener las reservas de los usuarios'
}
```

-**Ruta ver una reserva**: Ruta que permite ver información detallada (elementos de una reserva) de la reserva. Solicitud *get* que retorna un objeto JSON con los elementos que asociada la reserva. La ruta recibe como parametro el id de la reserva y requiere el rol de **auxiliar** o **administrador** por tanto necesita **AUTENTICACION**. El token se ingresa en la cabecera de la peticion en un campo llamado "**token-acceso**".
```
http://IP:3000/prestamos/reservaxid/<id reserva> (P-gjtkjn42)

Input:

NA

Output:

[
    {
        "serial": "qwe675",
        "categoria": "BC",
        "ubicacion": "estante1",
        "cantidad": 3
    },
    {
        "serial": "cdf123",
        "categoria": "AB",
        "ubicacion": "estante3",
        "cantidad": 1
    }
]

Output error:

{
    'Hubo un error para obtener la información'
}
```

-**Ruta eliminar reserva**: Ruta que elimina una reserva de la base de datos. Solicitud *delete* que tiene como parametro el id de la reserva a eliminar y borra el registro actualizando en inventario la información.Esta ruta requiere el rol de **auxiliar** o **administrador** y por tanto necesita **AUTENTICACION**. El token se ingresa en la cabecera de la peticion en un campo llamado "**token-acceso**".

```
http://IP:3000/prestamos/eliminarReserva/<id reserva> (P-gjtkjn42)

Input:

NA

Output:

{
    `La reserva P-gjtkjn42 ha sido eliminada`
}

Output error:

{
    'No se pudo eliminar la reserva'
}
```
-**Ruta confirmar reserva**: Ruta que permite hacer que una reserva pase a prestamo (cuando se han recibido los materiales). Solicitud *put* que recibe como parametro el id de la reserva a confirmar y actualiza la información. Esta ruta requiere el rol de **auxiliar** o **administrador** y por tanto de **AUTENTICACION**. El token se ingresa en la cabecera de la peticion en un campo llamado "**token-acceso**".
```
http://IP:3000/prestamos/confirmarPrestamo/<id reserva> (P-gjtkjn42)

Input:

NA

Output:

{
    'La reserva P-gjtkjn42 se ha confirmado como prestamo'
}

Output error:

{
    'Hubo error al tratar de confirmar la reserva'
}
```

-**Ruta consultar prestamos del usuario**: Ruta para que el usuario (cliente) consulte sus prestamos o reservas. Solicitud *get* que retorna la información asociada a todos los prestamos. La ruta requiere **AUTENTICACION** por lo que el usuario debe loguearse previamente. El token se ingresa en la cabecera de la peticion en un campo llamado "**token-acceso**".
```
http://IP:3000/prestamos/usuarioPrestamos

Input:

NA

Output:

[
    {
        "prestamo_id": "P-0Mg5dv",
        "reserva": "2021-11-16T05:00:00.000Z",
        "entrega": "2021-11-19T05:00:00.000Z",
        "devolucion": "2021-12-01T05:00:00.000Z",
        "renovaciones": 5,
        "en_reserva": true
    }
]

Output error:

{
    'Hay un error para retornar la información.'
}
```

-**Ruta devolver prestamo**: Ruta para actualizar la base de datos cuando se regresan los elementos de un prestamo. Solicitud *post* que recibe como parametro el id del prestamo que se regresa. Esta ruta requiere el rol de **auxiliar** o **administrador** y por tanto de **AUTENTICACION**. El token se ingresa en la cabecera de la peticion en un campo llamado "**token-acceso**".
```
http://IP:3000/prestamos/devolverPrestamo/<id prestamo> (P-gjtkjn42)

Input:

NA

Output:

{
    'Se actualizo la base de datos eliminando el prestamo'
}

```
## Kits

-**Ruta consultar kits**: Ruta para obtener informacion de los kits disponibles en inventario. Solicitud *get* que retorna un arreglo de objetos JSON con informacion de los kits. La ruta requiere **AUTENTICACION** por lo que el usuario debe loguearse previamente. El token se ingresa en la cabecera de la peticion en un campo llamado "**token-acceso**".
```
http://IP:3000/kits/kits

Input:

NA

Output:

[
    {
        "serial": "k-432",
        "placa": "CCD23",
        "nombre": "kit1",
        "ubicacion": "estante2",
        "valor": "400000",
        "cantidad": 4,
        "unidad": "unidad",
        "disponibles": 3,
        "categoria": "CL",
        "tipo": "kit"
    },
    {
        "serial": "k-412",
        "placa": "AAA43",
        "nombre": "kit2",
        "ubicacion": "estante4",
        "valor": "230000",
        "cantidad": 5,
        "unidad": "unidad",
        "disponibles": 5,
        "categoria": "CD",
        "tipo": "kit"
    }
]

Output error:

{
    'Error: No se pudo conectar con la base de datos'
}
```
-**Ruta consultar un kit**: Ruta para consultar informacion solo de un kit usando su id. Solicitud *get* que retorna solo informacion de un kit. La ruta requiere **AUTENTICACION** por lo que el usuario debe loguearse previamente. El token se ingresa en la cabecera de la peticion en un campo llamado "**token-acceso**".
```
http://IP:3000/kits/kits/<id kit> (k-432)

Input:

NA

Output:

[
    {
        "serial": "k-432",
        "placa": "CCD23",
        "nombre": "kit1",
        "ubicacion": "estante2",
        "valor": "400000",
        "cantidad": 4,
        "unidad": "unidad",
        "disponibles": 3,
        "categoria": "CL",
        "tipo": "kit"
    }
]

Output error:

{
    'Error: No se pudo conectar con la base de datos'
}
```
-**Ruta crear kit**: Ruta para crear un kit en la base de datos. Solicitud *post* que recibe un objeto JSON con informacion necesaria para el registro. Esta ruta requiere el rol de **administrador** y **AUTENTICACION**. El token se ingresa en la cabecera de la peticion en un campo llamado "**token-acceso**".
```
http://IP:3000/kits/crearKit

Input:

{
     "kit_id": "id", 
     "nombre": "nombre",
     "categoria": "categoria",
     "items": [
         {
             "serial": "serial",
             "cantidad": 0,
             "estado": "estado"
         }
     ]
 }

Output:

{
    'Kit creado con exito'
}

Output error:

{
    'Error: Fallo en la creacion del kit'
}
```
-**Ruta eliminar kit**: Ruta para elimina un kit de la base de datos. Solicitud *delete* que recibe como parametro el id del kit a eliminar. Esta ruta requiere el rol de **administrador** y **AUTENTICACION**. El token se ingresa en la cabecera de la peticion en un campo llamado "**token-acceso**".
```
http://IP:3000/kits/borrarKit/<id kit> (k-432)

Input:

NA

Output:

{
    'Kit borrado con exito'
}

Output error:

{
    'Error: Fallo en la eliminación del kit'
}
```
-**Ruta actualizar kit**: Ruta para actualizar informacion de un kit ya creado. Solicitud *patch* que recibe la informacion para actualizar. Esta ruta requiere el rol de **administrador** y **AUTENTICACION**. El token se ingresa en la cabecera de la peticion en un campo llamado "**token-acceso**".
```
http://IP:3000/kits/actualizarKit/<id kit>

Input:

[
    {
         "serial": "000CSOL",
         "cambio_cantidad": -1,
         "estado": "bueno"
    },
    
    {
         "serial": "0000CAU",
         "cambio_cantidad": -1,
         "estado": "malo"
    }
]

Output:

{
    'Actualizacion realizada con exito'
}

Output error:

{
    'Error: Fallo en la actualizacion del kit'
}
```

## Inventario (proximamente...)