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
-**Ruta prestamos activos**: Ruta para obtener todos los prestamos (no reservas) que hay activos. Solicitud *get* que retorna la informacion de todos los prestamos (en_reserva=FALSE). Esta ruta requiere el rol de **auxiliar** o **administrador** y **AUTENTICACION**. El token se ingresa en la cabecera de la peticion en un campo llamado "**token-acceso**".
```
http://IP:3000/prestamos/estadoPrestamos

Input:

NA

Output:

[
    {
        "prestamo_id": "PRE-3",
        "nombre": "Luis Gomez",
        "posicion": "estudiante",
        "correo": "luisfgomez@urosario.edu.co",
        "entrega": "2021-11-13T05:00:00.000Z",
        "devolucion": "2021-11-28T05:00:00.000Z"
    },
    {
        "prestamo_id": "PRE-2",
        "nombre": "Luis Gomez",
        "posicion": "estudiante",
        "correo": "luisfgomez@urosario.edu.co",
        "entrega": "2021-10-23T05:00:00.000Z",
        "devolucion": "2021-11-04T05:00:00.000Z"
    }
]

Output error:

{
    'Error al obtener la información en postgres'
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
## Politicas

-**Ruta consultar politicas**: Ruta para obtener informacion sobre las categorias (politicas) de prestamos. Solicitud *get* que retorna informacion de cada categoria. Esta ruta requiere el rol de **administrador** y de **AUTENTICACION**. El token se ingresa en la cabecera de la peticion en un campo llamado "**token-acceso**".

```
http://IP:3000/politicas

Input:

NA

Output:

[
    {
        "categoria": "abierta",
        "horas_reserva": "72",
        "dias_prestamo": "15",
        "max_renovaciones": "5"
    },
    {
        "categoria": "restringida",
        "horas_reserva": "72",
        "dias_prestamo": "20",
        "max_renovaciones": "7"
    },
    {
        "categoria": "confidencial",
        "horas_reserva": "96",
        "dias_prestamo": "30",
        "max_renovaciones": "9"
    }
]

Output error:

{
    'Error al obtener la información'
}
```

-**Ruta crear categoria**: Ruta para agregar una nueva categoria en las politicas. Solicitud *post* que recibe informacion requerida para crear una categoria. Esta ruta requiere el rol de **administrador** y de **AUTENTICACION**. El token se ingresa en la cabecera de la peticion en un campo llamado "**token-acceso**".

```
http://IP:3000/politicas/crearCategoria

Input:

{
    "categoria": "nueva",
    "horas_reserva": "25",
    "dias_prestamo": "10",
    "max_renovaciones": "2"
}

Output:

{
    'Categoria creada exitosamente'
}

Output error:

{
    'Error en postgres al crear la categoria'
}
```

-**Ruta actualizar politicas**: Ruta para cambiar aspectos de las categorias de politicas de prestamos. Solicitud *put* que recibe un arreglo de objetos JSON con las categorias a cambiar. Esta ruta requiere el rol de **administrador** y de **AUTENTICACION**. El token se ingresa en la cabecera de la peticion en un campo llamado "**token-acceso**".

```
http://IP:3000/politicas/actualizarPoliticas

Input:

[
    {
        "categoria": "abierta",
        "horas_reserva": "3",
        "dias_prestamo": "10",
        "max_renovaciones": "2"
    },
    {
        "categoria": "restringida",
        "horas_reserva": "72",
        "dias_prestamo": "20",
        "max_renovaciones": "7"
    },
    {
        "categoria": "confidencial",
        "horas_reserva": "96",
        "dias_prestamo": "30",
        "max_renovaciones": "9"
    }
]

Output:

{
    'Categorias actualizadas exitosamente'
}

Output error:

{
    'Error durante actualización de información en postgres'
}
```

-**Ruta usuarios por categoria**: Ruta que permite obtener los usuarios de una categoria en particular. Solicitud *get* que recibe como parametro la categoria de la cual se quieren obtener los usuarios. Esta ruta requiere el rol de **administrador** y de **AUTENTICACION**. El token se ingresa en la cabecera de la peticion en un campo llamado "**token-acceso**".

```
http://IP:3000/politicas/usuarios/<nombre categoria>

Input:

NA

Output:

[
    {
        "nombre": "Diego Gonzales",
        "posicion": "profesor",
        "accesibilidad": "restringida"
    },
    {
        "nombre": "Alex Caicedo",
        "posicion": "profesor",
        "accesibilidad": "restringida"
    }
]

Output error:

{
    'Error al obtener información de postgres'
}
```

-**Ruta agregar usuarios**: Ruta para incluir un usuario en una categoria de politicas de prestamo. Solicitud *put* que recibe el correo del usuario a incluir y la categoria donde se va a incluir. Esta ruta requiere el rol de **administrador** y de **AUTENTICACION**. El token se ingresa en la cabecera de la peticion en un campo llamado "**token-acceso**".

```
http://IP:3000/politicas/agregarUsuario

Input:

{
    "correo":"andresgutierrez@urosario.edu.co",
    "categoria":"restringida"
}

Output:

{
    'Actualizacion de categoria exitosa'
}

Output error:

{
    'Error al actualizar la información en postgres'
}
```

-**Ruta eliminar usuarios**: Ruta para sacar a un usuario de una categoria en particular.Solicitud *put* que recibe el correo del usuario a eliminar, esta ruta cambia la categoria del usuario a **abierta** (categoria base). Esta ruta requiere el rol de **administrador** y de **AUTENTICACION**. El token se ingresa en la cabecera de la peticion en un campo llamado "**token-acceso**".

```
http://IP:3000/politicas/eliminarUsuario

Input:

{
    "correo":"andresgutierrez@urosario.edu.co"
}

Output:

{
    'Eliminación exitosa'
}

Output error:

{
    'Error en postgres al cambiar información'
}

```

## Usuarios

-**Ruta consultar auxiliares**: Ruta para obtener todos los usuarios que son auxiliares. Solicitud *get* que retorna informacion de los auxiliares. Esta ruta requiere el rol de **administrador** y de **AUTENTICACION**. El token se ingresa en la cabecera de la peticion en un campo llamado "**token-acceso**".
```
http://IP:3000/usuarios/auxiliares

Input:

NA

Output:

[
    {
        "nombre": "Diego Gonzales",
        "correo": "diegofgonzales@urosario.edu.co",
        "celular": null,
        "posicion": "profesor"
    }
]

Output error:

{
    'Error al obtener la información de postgres'
}
```

-**Ruta agregar auxiliares**: Ruta para incluir un usuario ya registrado en el rol de auxiliar. Solicitud *put* que recibe el correo del usuario que sera auxiliar. Esta ruta requiere el rol de **administrador** y de **AUTENTICACION**. El token se ingresa en la cabecera de la peticion en un campo llamado "**token-acceso**".

```
http://IP:3000/usuarios/agregarAuxiliar

Input:

{
    "correo":"andresgutierrez@urosario.edu.co"
}

Output:

{
    'Auxiliar agregado exitosamente'
}

Output error:

{
    'Error al cambiar informacion en postgres'
}
```

-**Ruta eliminar auxiliares**: Ruta para eliminar un usuario del rol de auxiliar. Solicitud *put* que recibe el correo de un usuario auxiliar y cambia su rol a **cliente** (rol base). Esta ruta requiere el rol de **administrador** y de **AUTENTICACION**. El token se ingresa en la cabecera de la peticion en un campo llamado "**token-acceso**".

```
http://IP:3000/usuarios/eliminarAuxiliar

Input:

{
    "correo":"andresgutierrez@urosario.edu.co"
}

Output:

{
    'Auxiliar eliminado exitosamente'
}

Output error:

{
    'Error al cambiar informacion en postgres'
}
```

## Inventario

-**Ruta consultar inventario**: Ruta para consultar todo el inventario (objetos en la tabla `inventario` que no tengan `tipo=kit`), requiere el rol de **auxiliar o administrador** por tanto requiere de **AUTENTICACION**. El token se ingresa en la cabecera de la peticion en un campo llamado "**token-acceso**".
```
http://IP:3000/inventario/consultar

Input:

NA

Output:

[
  {
    serial: 'aaaa',
    placa: null,
    nombre: 'arduino',
    ubicacion: null,
    valor: null,
    cantidad: 5,
    unidad: null,
    disponibles: 3,
    categoria: null,
    tipo: 'obj'
  },
  {
    serial: 'aaac',
    placa: '333',
    nombre: 'impresora3d',
    ubicacion: null,
    valor: null,
    cantidad: 2,
    unidad: null,
    disponibles: 2,
    categoria: null,
    tipo: 'obj'
  }
]

Output error:

{
    'Error: No se pudo conectar con la base de datos'
}
```

-**Ruta crear objeto**: Ruta para crear un objeto en el inventario, requiere el rol de **auxiliar o administrador** por tanto requiere de **AUTENTICACION**. El token se ingresa en la cabecera de la peticion en un campo llamado "**token-acceso**".
```
http://IP:3000/inventario/crear

Input:

{
    serial:'aaad',
    nombre:'protoboard',
    tipo:'obj',
    cantidad:5,
}

Output:

{
    'Se ha creado el objeto en el inventario'
}

Output error:

Si se intenta crear con un serial a uno ya existente:
{
    'Ya existe un objeto con ese serial'
}

Si se intenta crear con una placa a una ya existente
{
    'Ya existe un objeto con esa placa'
}

Si no se proporciona serial o nombre o tipo o cantidad en el body
{
    'Tiene que proporcionarse (un serial | una placa | una cantidad | un tipo)'
}

Si la cantidad nueva no es positiva:
{
    'La cantidad debe ser positiva'
}
```

-**Ruta modificar objeto**: Ruta para modificar un objeto en el inventario, requiere el rol de **auxiliar o administrador** por tanto requiere de **AUTENTICACION**. El token se ingresa en la cabecera de la peticion en un campo llamado "**token-acceso**".
```
http://IP:3000/inventario/modificar/<serial>

Input:

{
    cantidad:7,
    nombre:'protoboard',
    ubicacion:'centro',
}

Output:

{
    'Se ha modificado el objeto en el inventario'
}

Output error:

Si no se pasa ningun cambio:
{
    'No se proporciono ningun cambio'
}

Si se intenta cambiar a un serial ya existente
{
    'Ya existe un objeto con ese serial'
}

Si se intenta cambiar a una placa ya existente
{
    'Ya existe un objeto con esa placa'
}

Si se intenta cambiar a una cantidad no positiva:
{
    'La cantidad debe ser positiva'
}
```
