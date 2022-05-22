const express =require('express');
const app = express();
const cors = require('cors');
app.use(cors())
app.use(express.json());
port= 3000

const { Kafka } = require('kafkajs')

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['kafka:9092'],
})
app.post("/login",async (req, res) =>{
    const producer = kafka.producer()
    const admin = kafka.admin()
    await admin.connect()
    await producer.connect()
    await admin.createTopics({
        waitForLeaders: true,
        topics: [
          { topic: 'test-topic' },
        ],
    })
    
    await producer.send({
      topic: 'test-topic',
      messages: [
        { value: JSON.stringify(req.body) },
      ],
    })
    await producer.disconnect()

})


app.get("/", function (req,res){
    res.send('wohooo')
});
app.listen(port, ()=>{
    console.log(`Express listening at http://localhost:${port}`)
})