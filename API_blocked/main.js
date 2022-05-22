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
function Block(User)
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
app.get("/blocked",async (req, res) =>{
  const consumer = kafka.consumer({ groupId: 'test-group' })
  
  await consumer.connect()
  await consumer.subscribe({ topic: 'test-topic', fromBeginning: true })
  variable = null
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      variable=message.value.toString()
      console.log({
        value: message.value.toString(), variable
      })
    },
  })

})
app.get("/", function (req,res){
    res.send('wohooo')
});
app.listen(port, ()=>{
    console.log(`Express listening at http://localhost:${port}`)
})