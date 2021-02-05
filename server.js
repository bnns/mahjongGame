const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const getId = require("./majiang_main/src/utilities/userId");
const {getTiles, randomTiles, tilesMade} = require("./majiang_main/src/utilities/tileMaker")
let users = [];
let tiles = [];
let dupCounter = 0;

let seat = 0; //counter for seat selected
let memberCounter = 0; //members counter for loggedIn in one game room
let group = 4; //totlal persons for one room
let idArray = [];
let roomNumb = 0;
let seatselected = ["", "", "", ""];
let socketMemo = [];
let dataCollect = [];
let temp = new Array(4);

   http.listen(process.env.PORT || 3000, () => {
   console.log("port at 3000 is ready");
   });

   io.on("connection", (socket) => {
   console.log(`Socket ${socket.id} connected.`);

   //clients[socket.id]=socket
   socketMemo.push(socket.id);

   //if (socketMemo.length === 1) {
    //3 sockets (app, store) for every connection
    if (memberCounter === 0) {
      roomNumb = getId.getId(5);
    }
    users.push({
      roomId: roomNumb,
      id: socket.id,
      userId: getId.getId(8),
      dealer: false,
      seat:'',
    });
    if (users.length === 5) {
      users.pop();
    }
    let i = users.length - 1;
    users[i].index = i;
    socketMemo = [];
    console.log(users[i].roomId)
    io.emit("loggedIn", users);
   //}

   socket.on(
    "newuser",
    (
      data //user object from login component
    ) => {
      memberCounter++;
      if (memberCounter === 5) {
        console.log(memberCounter), (memberCounter = 4);
      }
      users[data.index].id = data.socketId;
      users[data.index].name = data.name;
      console.log(`${data.name} comes in room ${socket.id} now !`);
      io.emit("userOnline", users[data.index]);
      checkRoom();
    }
   );
    
   socket.on('pong', function(data){
     console.log(data.id, 'pong', data.userId, '//', data.roomId)
       users.map((user) => {
         user.roomId === data.roomId
           ? user.userId === data.userId
             ? (user.id = data.id, console.log(data.id, 'pong'))
             : console.log("do Nothing1")
           : console.log("do Nothing2");
       });
   });

   //from after doDicing() 
   socket.on("diceChange", data => {
    //emit to all 4 players
    io.emit("luckyNumber", data);
   });
 
   // data = dicedTotal with its self index
   socket.on("diced", data => {
    if (dataCollect.length === 4) {
      console.log(dupCounter,'dupCounter');//after dup treated
      dupCounter--;
      dataCollect.splice(data.a, 1, data);
    } else {
      dataCollect.push(data);//wait for 4 players
    }
    //[{a, t}, {a, t}, {a, t}, {a, t}]
    if (dataCollect.length > 3) {
      dataCollect.sort((a, b) => a.a - b.a);
      let dup = [];
      for (let k = 0; k < 4; k++) {
        dataCollect.forEach((e) => {//find all dups
          if (e.a !== k) {
            if (e.t === dataCollect[k].t) {
              dup.push({
                index: e.a,
                elememt: e.t,
              });//dupCounter += dup.length??
              dupCounter = dup.length
            }
          }
        });
      }
      dupCounter===0
        ? (io.emit("allDiced", (dataCollect)))//dicing finished
        : io.emit("dup", dup);//dicing continuing
    }
   });

   //seat selected and self# changed
   socket.on("seatSelected", (data) => {
    seat++;
    let payload = [data, seat]
    io.emit("selected", payload);//io.emit vs broadcast!
    if (seat === 4) {
      tiles = getTiles();
      let shuffled = [];
      while(tiles.length>0){
          let k = getRandomizer(0, tiles.length-1);
          shuffled.push(tiles[k])
          tiles.splice(k, 1)
      }
      tiles = randomTiles(shuffled);
      io.emit("sitDown");
    };
    
    socket.on('ready', data => {
     temp[data[1]]=data[0];//rearange the users array
     if (temp.length === 4){
       io.emit('userSet', temp)
     }
    });
    socket.on('makeWalls', players=>{
      dupCounter++
      if(dupCounter===4){
        let tileWalls = tilesMade(players, tiles);
        io.emit('setTiles', {onHands: tileWalls[0], 
          onTable: tileWalls[1], allTiles:tiles});
      }
      })
   }),
                                                 
       //io.on deffer from socket.on!!!!
       socket.on("disconnect", (data) => {
       console.log(`Socket ${socket.id} disconnected.`);
       
       idArray.push(socket.id);

        let itemIdx, nameLeft;

        users.map((user, idx) => {
          //idArray.forEach((e) =>
          idArray[0] === user.id
              ? ((itemIdx = idx), (nameLeft = user.name))
              : nameLeft = "somebody"
        });

        let roomLeft = users[itemIdx].roomId;
        console.log(nameLeft + "left from room" + roomLeft);
        io.emit("loggedOut", nameLeft);
        users.splice(itemIdx, 1);
        memberCounter--;
        idArray = []
      });
});

function getRandomizer(bottom, top) {
  return Math.floor(Math.random() 
  * (1 + top - bottom)) + bottom;
};

function sendHeartbeat(){
  setTimeout(sendHeartbeat, 8000);
  io.sockets.emit('ping', { beat : 1 });
  }

function checkRoom() {
  if (users.length === group) {
    //4 people in one game room
    io.emit("Full", users); //to app
    memberCounter = 0;
    socketMemo = [];
    setTimeout(sendHeartbeat, 8000);
  }
}

function refreshServer() {
  memberCounter = 0;
  console.log("refresh server");
  users = [];
  http.close(() => {
    console.log("Refress the server !!!");
    io.close();
    http.listen(process.env.PORT || 3000, () => {
      console.log("port at 3000 is ready");
    });
  });
}
