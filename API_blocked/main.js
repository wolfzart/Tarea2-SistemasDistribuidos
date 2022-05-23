const express =require('express');
const app = express();
const cors = require('cors');

app.use(cors())
app.use(express.json());
port= 5000

const { Kafka } = require('kafkajs')

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['kafka:9092'],
})
let listaLogUsuarios = []

let listaBloqueados = []

app.get("/blocked",async (req, res) =>{
  blacklist = {
    "users-blocked": listaBloqueados
  }
  res.send(blacklist, " algo ", listaLogUsuarios)  


})

const consume = async () =>{
  console.log("Soy kafka y escribo sobre cucacachas")
  const consumer = kafka.consumer({
     groupId: 'test-group',
     heartbeatInterval: 10000
    })
  await consumer.connect()
  await consumer.subscribe({ topic: 'test-topic', fromBeginning: true })
  variable = null
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log("Soy un flag ")
      let time = message.timestamp/1000;
      variable = message.value.toString()
      const credentials = JSON.parse(variable);

      let logUsr = {
        "user" : credentials.user,
        "time" : time,
        "conta": 1
      }
      
      console.log(logUsr.user)
      console.log(listaBloqueados.length)
      
      var ubicacion = false
      //reviso si estoy en la lista de bloqueos
      if (listaBloqueados.length != 0){  
        console.log("1- La lista de Bloqueados no esta vacia")

        for(let i=0;i<listaBloqueados.length;i++){
          if(listaBloqueados[i]==logUsr.user){
            console.log("2- el usuario ya esta bloqueado")
            ubicacion = true
            break
          }
        }
      }
      //no esta en la listaBloqueados entra al if
      //revisa si esta en la listalog que es la cola para entrar 
      if (ubicacion == false){
        console.log("3- el usuario no se encuentra bloqueado")
        console.log("4- por esto sera ingresado a la cola para ser bloqueado")
        if (listaLogUsuarios.length==0){
          console.log("5- no hay nadie en la cola, entonces ingreso")
          listaLogUsuarios.push(logUsr)
        }else{
          console.log("6- hay usuario en cola, estare yo ?")
          var agregar = true
          for(let i=0;i<listaLogUsuarios.length;i++){
            
            //if= se encontro en la cola para entrar a la listaBloqueado
            if(listaLogUsuarios[i].user==logUsr.user){
              console.log("7- si estoy en la lista,  tiempo: ", logUsr.time-listaLogUsuarios[i].time)
              agregar=false
              //if= aun no pasan los 60 segundos
              if(logUsr.time-listaLogUsuarios[i].time<60){
                listaLogUsuarios[i].conta++
                console.log("8- aun no pasan los 60 segundos")
                //if=ingresaste 5 veces bloqueado
                if(listaLogUsuarios[i].conta==5){
                  console.log("9- mi 5 ingreso de login incorrecto, usuario se bloquea")
                  listaBloqueados.push(logUsr.user)
                } 
              }else{
                console.log("10- pasaron mas de 60 segundos, se reinicia la cuenta")
                listaLogUsuarios[i].conta=1
                listaLogUsuarios[i].time=logUsr.time
              }
              break
            }
          }
          console.log("11- estoy cerca de finalizar ")
          
          if (agregar == true){
            console.log("12- usuario no encontrado en lista de bloqueo ni en la cola para la lista de bloqueo, se ingresa a la cola")
            listaLogUsuarios.push(logUsr)
          }
        }
    
      }
      console.log("finalice")

    },
  })
}

app.get("/", function (req,res){
    res.send('wohooo')
});
app.listen(port, ()=>{
    console.log(`Express listening at http://localhost:${port}`)
    consume().catch((err) => {
      console.error("error in consumer: ", err)
    })
})