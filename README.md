# Tarea2-SistemasDistribuidos _°Sebastianes Gonzalez y Concha°_
El objetivo de la tarea consiste en que los estudiantes entiendan las principales características de Kafka, como configurar un broker de Kafka e implementar un servicio de autenticación y un servicio de seguridad ante actividad maliciosa comunicados mediante un broker de Kafka.

Melon Musk es su mejor amigo y también es un empresario multimillonario que compró una de las plataformas de redes sociales más grande del mundo: Fruitter. Esta plataforma funcionaba correctamente, sin embargo, a Melon Musk no le gustaba el sistema de login que este poseía (a pesar de ser un sistema completo y funcional), debido a que  ́el buscaba
cosas muy específicas y para eliminar a los bots.
Es así como un día Melon Musk le ofreció a usted el trato de su vida, realizar el sistema que verifique los inicios de sesión de los usuarios a cambio de... ¡un viaje a marte junto a X Æ A-12!.
Los requerimientos que Melon Musk pide para el sistema de login son los siguientes:

- Login en una API REST
- Utilización de Kafka para comunicar los inicios de sesión con un topic para lo mismo.
- Si existen 5 inicios de sesión por parte de un usuario en menos de 1 minuto, se deberá bloquear la cuenta.
- El uso de una base de datos para guardar las distintas cuentas no es necesario, pero debe existir un registro que guarde si la cuenta se encuentra bloqueada o no. Se recomienda el uso de un JSON. (Melon musk tiene su propia base de datos distribuida para guardar a los usuarios de Fruitter).

## Repositorio
Este repositorio contiene:
1. API REST login: contiene un método login de tipo post, el cual generará un productor y éste creará un topic donde se enviará un mensaje con el usuario (user) y su contraseña (pass), logrando comunicarse con kafka 
2. Kafka: recibirá de un productor(login) la creación de un topic, el cual será retenido en un browser donde estará a la espera a que un consumidor(blocked) pida el mensaje que está en el topic
3. API blocked : creará un consumidor que irá en la búsqueda del tópico asignado, recibiendo el mensaje.En este mensaje contendrá el usuario y la contraseña, donde pasará por ciertas condiciones para ser bloqueadas y mostradas.

## Instalación 
El repositorio debe de ser clonado en alguna carpeta mediante el comando
```
git clone https://github.com/wolfzart/Tarea2-SistemasDistribuidos.git
```
## Uso
1. En primer lugar hay que crear las imágenes y encender los contenedores, para esto se utiliza el siguiente comando:
```
$ docker-compose up 
```
2. Una vez ya encendido, se utiliza alguna herramienta de peticiones para API, por ejemplo Postman, donde se enviarán un mensaje en formato json con la siguiente estructura  : 


```
{
	“user”: “NOMBRE_USUARIO”,
	“pass”: ”CONTRASEÑA_USUARIO”
}
```
Siendo enviadas con el tipo de petición POST desde la siguiente url:  

```
http:/localhost:3000/login
```
3. Luego se realizá una petición tipo GET a la siguiente ruta:

```
http:/localhost:5000/blocked
``` 
La cual mostrará los usuarios bloqueados. Para que suceda esto se tienen que cumplir las siguientes condiciones:
- La cuenta del usuario será bloqueada si se equivoca 5 veces 
- La cuenta del usuario será bloqueada si lo anterior sucedió durante un periodo de 60 segundos, en caso de superar estos 60 segundos se reinicia la cuenta.
## Preguntas
1. ¿Por qué Kafka funciona bien en este escenario?

Apache Kafka es una plataforma distribuida de transmición de datos, en este caso son las credenciales dichos datos. Kafka al funcionar en tiempo real, es capaz de entregar de manera continua estas credenciales al servicio de bloqueo y de esta forma tener información contantemente actualizada.

2.  Basado en las tecnologías que usted tiene a su disposición (Kafka, backend) ¿Qué haría usted para manejar una gran cantidad de usuarios al mismo tiempo?

Suponiedo que exista un gran flujo de datos, van a ser necesarios un mayor número de brokers en Kafka para lograr así un mayor nivel de partición de los datos y balancear la carga almacenada en estos. Por otro lado, tambien van a ser necesarios más consumidores, puesto que con uno solo que procese este flujo de datos no va a ser suficiente; todos estos consumidores van a obtener la información de algún respectivo broker y van a mantener los usuarios bloqueados constantemente actualizados.

![metamorfosis-1915-franz-kafka-transformacion--T-i2wPgi](https://user-images.githubusercontent.com/69988825/169922847-895c3f44-5b1e-4b32-b686-c04afe13fa99.jpg)
