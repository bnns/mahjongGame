const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const getId = require("./majiang_main/src/utilities/userId");
let users = [];

//users = [{room:{roomName, roomId}, user:[{userId,
//userName, socketId, logInOrder, seatDir}]}]
let seat = 0; //counter for seat selected
let memberCounter = 0; //members counter for loggedIn in one game room
let group = 4; //totlal persons for one room
let idArray = [];
let roomNumb = 0;
let seatselected = ["", "", "", ""];
let socketMemo = [];
let dataCollect = [];

http.listen(process.env.PORT || 3000, () => {
  console.log("port at 3000 is ready");
});

io.on("connection", (socket) => {
  console.log(`Socket ${socket.id} connected.`);

  //clients[socket.id]=socket
  socketMemo.push(socket.id);
  console.log(socketMemo);

  if (socketMemo.length === 3) {
    //3 sockets (app, center, store) for every connection
    if (memberCounter === 0) {
      roomNumb = getId.getId(5);
    }
    users.push({
      counter: memberCounter,
      roomId: roomNumb,
      id: socketMemo,
      userId: getId.getId(8),
    });
    if (users.length === 5) {
      users.pop();
    }
    let i = users.length - 1;
    users[i].index = i;
    socketMemo = [];
    io.emit("loggedIn", users);
  }

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

  socket.on("reconnect", (data) => {
    console.log("reconnect", data);
    users.map((user) => {
      user.roomId === data.roomId
        ? user.id === data.lastId
          ? (user.id = data.id)
          : console.log("do Nothing1")
        : console.log("do Nothing2");
    });
  });

  //from center doDicing() shoiul from app  11111
  socket.on("diceChange", (data) => {
    //emit to app ///!!should directly from enter $emit
    io.emit("luckyNumber", data);
  });
  //form vuex
  socket.on("diceNumber", (data) => {
    //emit to app and mutate the data ///22222 should from app to store and app to all other apps
    io.emit("luckyNumber2", data);
  });

  socket.on("diced", (data) => {
    if (dataCollect.length === 4) {
      dataCollect.splice(data.a, 1, data);
    } else {
      dataCollect.push(data);
    }
    dataCollect.sort((a, b) => a.a - b.a);
    if (dataCollect.length > 3) {
      let dup = [];
      for (let k = 0; k < 4; k++) {
        dataCollect.forEach((e) => {
          if (e.a !== k) {
            if (e.t === dataCollect[k].t) {
              dup.push({
                index: e.a,
                elememt: e.t,
              });
            }
          }
        });
      }
      dup.length === 0
        ? io.emit("allDiced", dataCollect) //dicing finished!!!
        : io.emit("dup", dup);
    }
  });
  // four done msg from each players when dicing
  // let collect = []
  // socket.on('finished', data =>{
  //   collect.push(collect.forEach(e=>e!==data))
  //   if (collect.lengh ===4){
  //     io.emit('allDiced')
  //   }
  // })

  //seat selected and self# changed
  socket.on("changed", (data) => {
    seat++;
    seatselected[data.data1] = data.data;
    socket.broadcast.emit("selected", data.data1);
    if (seat === 4) {
      io.emit("ready");
    }
  }),
    socket.on("disconnect", (data) => {
      console.log(`Socket ${socket.id} disconnected.`);

      idArray.push(socket.id);
      if (idArray.length === 3) {
        console.log(users, "users2");

        let itemIdx, nameLeft;

        users.map((user, idx) => {
          idArray.forEach((e) =>
            e === user.id
              ? ((itemIdx = idx), (nameLeft = user.name), console.log(idx))
              : console.log(user.id, "/", idx, "/", user.name)
          );
          console.log(idArray);
        });
        idArray = [];
        let roomLeft = users[itemIdx].roomId;
        console.log(nameLeft + "left from room" + roomLeft);
        io.emit("loggedOut", nameLeft);
        users.splice(itemIdx, 1);
        memberCounter--;

        if (memberCounter === 0 && !users) {
          refreshServer();
        } else {
          let onesInRoom = users.map((user) => user.name);

          users.length < 1 || users == undefined || null
            ? ((onesInRoom = "Nobody"), refreshServer())
            : console.log(onesInRoom);
          console.log(`${onesInRoom}`, "still in the room");
        }
      }
    });
});
function checkRoom() {
  if (users.length === group) {
    //4 people in one game room
    console.log("full");
    io.emit("Full", users); //to app
    memberCounter = 0;
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
