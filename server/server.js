

const io =require('socket.io')(3000,{
    cors:{
        origin: ['http://localhost:5173']
    }
})
io.on('connection',socket=>{
    console.log(socket.id)
    socket.on("button-click-Event", (string, roomID)=>{
        if(roomID === ''){

            socket.broadcast.emit("server-message", `${string}`)
            console.log(string)
        }
        else{
            socket.to(roomID).emit("server-message", `${string}`)
            console.log(`private room ${string}`)
        }
    })
    socket.on("join-room", roomID =>{
        socket.join(roomID)
    })
})