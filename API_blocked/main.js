const express =require('express');
const app = express();
const cors = require('cors');
const fs = require('fs')

app.use(cors())
app.use(express.json());
port= 5000

const { Kafka } = require('kafkajs')

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['kafka:9092'],
})
//----------------------------------
function Blocko(User)
{
    console.log("Bloqueando Usuario")
    fs.readFile('db.json', (err, data) => {
      if (err) throw err;
      let db = JSON.parse(data);
      console.log(db.bloqueados);
      db["bloqueados"].push(User);
      fs.writeFile('db.json',db);


      //Usuarios['users-blocked'].push(User)
      //fs.writeFileSync('data.json',JSON.stringify(Usuarios))
    });
    fs.readFile('db.json', (err, data) => {
      if (err) throw err;
      console.log(data)
      let db = JSON.parse(data);
      console.log("estoy ene este punto:",db.bloqueados);    
    });
}
app.get("/prueba", async (req,res) =>{
    //Block("hola")
    var hoy = new Date()
    console.log(hoy.getDate())
    console.log(hoy.getTime())
})

//-------------------------------------

let listaLogUsuarios = []

let listaBloqueados = []

app.get("/blocked",async (req, res) =>{
  blacklist = {
    "users-blocked": listaBloqueados
  }
  res.send(blacklist)  


})

const consume = async () =>{
  console.log("Soy kafka y escribo sobre cucacachas")
  const consumer = kafka.consumer({ groupId: 'test-group' })
  await consumer.connect()
  await consumer.subscribe({ topic: 'test-topic', fromBeginning: false })
  variable = null
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log("Soy un flag ")
      let time = message.timestamp/1000;
      variable = message.value.toString()
      const credentials = JSON.parse(variable);
      //console.log(credentials.usuario)
      //console.log({value: message.value.toString()})
      /********/
      //console.log(message.value.toString())
      logUsr = {
        "user" : credentials.user,
        "time" : time
      }
      console.log(logUsr)


      //listaLogUsuarios[credentials.usuario] = time, count++ 

/*

si usuario no está en listaBloqueados
si el tiempo entre el primer inicio de sesión y el último es menor a 60 segundos
si sus ingresos son más de 5 


*/
      

      listaBloqueados.push(logUsr.user)

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