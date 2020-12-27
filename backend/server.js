
const app = require('express')();
const cors = require('cors')();
const http = require('http').createServer(app);
// const io = require('socket.io')(http);


// const corsOptions = {
//     origin: ['http://127.0.0.1:3000', 'http://localhost:3000'],
//     credentials: true
// };
// app.use(cors(corsOptions));


const io = require("socket.io")(http, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
})
http.listen(5000)



// http.listen(5000, () => {
//   console.log('listening on *:5000');
// });


  if(process.env.NODE_ENV === 'production'){
    app.use(express.static('public'))
  }

io.on('connection',socket=> {
    const id = socket.handshake.query.id
    socket.join(id)

    socket.on('send-message',({recipients,text})=>{
        recipients.forEach(recipient=>{
            const newRecipients = recipients.filter(r=>r!==recipient)
            newRecipients.push(id)
            socket.broadcast.to(recipient).emit('recieve-message',{
                recipients: newRecipients, sender: id, text
            })
        })
    })
})