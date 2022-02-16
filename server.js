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
// let group = 4; //totlal persons for one room
// let idArray = [];//????
let roomNumb = 0;//?????
let room = [];//should have user data with roomid (found in 43)
// let seatselected = ["", "", "", ""];
let socketMemo = [];
let dataCollect = [];//need differ room into consideration
let temp = new Array(4);

   http.listen(process.env.PORT || 3000, () => {
   console.log("port at 3000 is ready");
   });

   io.on("connection",(socket)=>{
   console.log(`Socket ${socket.id} connected.`);
  //  if(users){console.log(users)}
  // socket.emit('wasconnected')
  // socket.on('current',data=>{
    //  if(data!=='new'){
    //    let index
    //    users.map((ele,i)=>{
    //      console.log(ele.userId+"/"+"33")
    //      (ele.roomId===data[1]&&ele.userId===data[2])//?????????????????
    //      ?index=i
    //      :"" })
    //    if(users){users[index].id=socket.id}
    //    console.log(users[index].name+"comes back at room)"+users[index].roomId)
    // checkRoom()}
   
   
   //clients[socket.id]=socket
   socketMemo.push(socket.id);

   //if (socketMemo.length === 1) {
    //3 sockets (app, store) for every connection
    if(memberCounter===0) {//??how to dif more group of users
      roomNumb=getId.getId(5);
    }
    users.push({
      roomId: roomNumb,//might not be done here???
      id: socket.id,
      userId: getId.getId(8),
      dealer: false,
      seat:'',
    });
 // room[roomNumb].push(users);//????
    if (users.length===5){
      users.pop();
    }
    let i=users.length-1;
    users[i].index=i;
    socketMemo=[];
    io.emit("loggedIn",users);
 // })
    //user object from login component
   socket.on("newuser",data=>{
      memberCounter++;
      if(memberCounter===5){
        (memberCounter=4)
      } 
      users[data.index].id=data.socketId;
      users[data.index].name=data.name;
      users[data.index].roomId=data.roomId;
      users[data.index].loggedIn=data.loggedIn
      console.log(`${data.name} comes in room ${data.roomId} now !`);

      io.emit("userOnline", users[data.index]);
      (users.length!==4)
      ?"doNothing"
      :checkRoom()//see status of the room
      });
    //find any who left the room...
   socket.on('ping1',(data)=>{//only socket and 'ping1'work?????
       users.map((user)=>{
         user.roomId===data.roomId
           ? user.userId===data.userId
             ?(user.id=data.id)
             :""//1/4 sockets match
             :""//always find 1/4>>>>>
       });
   });

   //from after doDicing() 
   socket.on("diceChange",data=>{
    //emit to all 4 players
    io.emit("diceChange1",data);
   });
 
   // data = dicedTotal with its own index
   socket.on("diced",data=>{
    if(dataCollect.length===4){
      console.log(dupCounter,'dupCounter');
      dupCounter--;//each time dup treated
      dataCollect.splice(data.a, 1, data);
    }else{
      dataCollect.push(data);//wait for 4 players
    }
    //receved data has 2 properties: a -index, t -diced number
    if(dataCollect.length>3){
      dataCollect.sort((a, b)=>a.a-b.a);//sort on 4 numbers
      let dup=[];
      for(let k=0; k<4; k++) {
        dataCollect.forEach(e=>{
          if(e.a!==k){//as long as not itself
            if(e.t===dataCollect[k].t){//when diced number same
              dup.push({//dup found 
                index: e.a,
                elememt: e.t,
              });//dupCounter is a global varialbe
              dupCounter=dup.length//no more than 3...
            }
          }
        });
      }
      dupCounter===0
        ? (io.emit("allDiced", (dataCollect)))//dicing finished
        : io.emit("dup", dup);//dup reported and remembed
    }        //bug might be for differ that next diced less than 4 players
   });

   //[0]=user, [1]=indx
   socket.on('ranked', data=>{//from App.vue data="first"
          temp[data[1]]=data[0]//rearange users by rank
          seat++
          if(seat===4)
          {
            let payload = temp;
            temp = new Array(4);
            seat=0;
          io.emit('rankedUsers', payload)//good here
          }
       });

   //seat selected and self# changed
   socket.on('seatSelected',data=>{
    seat++; 
    let payload=[data,(seat===4?0:seat)]//inturn by seat??????
    io.emit('selected', payload);
    if(seat===4){
      seat=0
      tiles=getTiles();
      let shuffled=[];
      while(tiles.length>0){
          let k=getRandomizer(0, tiles.length-1);
          shuffled.push(tiles[k])
          tiles.splice(k, 1)
      }
      tiles=randomTiles(shuffled);
     // setTimeout(()=>{},5000);
      io.emit("sitDown")
      }
  }),
 
    //seat selected
    socket.on('ready',data=>{
     temp[data[1]]=data[0];//rearange the users by seats
     seat++;
     if (seat===4){
       let data=[...temp]
       seat=0
       let tileWalls=tilesMade(data, tiles);
       io.emit('ready1', [{onHands:tileWalls[0], 
        onTable:tileWalls[1],
        allTiles:tiles},
        data]) 
       temp=new Array(4)
     }
    });

    socket.on('start', data=>
         socket.broadcast.emit('start1', data))
    
    // socket.on('makeWalls', data=>{//data[0]=players, data[1]=goAhead
    //   dupCounter++
    //   if(data.length!==2){ return}
    //   if(dupCounter===4){//wait for 4 players
    //     let tileWalls=tilesMade(data[0], tiles);
    //     //setTimeout(()=>{}, 5000);
    //     io.emit('setTiles',[{onHands:tileWalls[0], 
    //       onTable:tileWalls[1],
    //       allTiles:tiles},
    //       data[1]]
    //       )//{data}emited on 164
    //   }
    // })

       socket.on('sort',a=>{
        socket.broadcast.emit('sort1',a)
      }),

      socket.on('deserted',data=>
      socket.broadcast.emit('deserted1',data))
                          
       socket.on('disTile',data =>{//data=self, tile.id
         io.emit('disTile1',data)
       }), 
       
       socket.on('inTurn',data =>{
         io.emit('inTurn1',data)
       })
       
       socket.on('goahead',data=>{
        io.emit('goahead1',data)
       })

      //  socket.on('myTile',data=>{//send to app of other threes
      //    io.emit('myTile',data)//????no receivers!!!!
      //  })
       socket.on('getTile',data =>{//viewDiscarded, self 
         socket.broadcast.emit('getTile1',data)
       })
       //io.on deffer from socket.on!!!!
       socket.on("disconnect",()=>{
         let itemIdx 
         let roomleft 
         let userleft
         users.map((user,idx)=>{
           if(user.id===socket.id)
           {itemIdx=idx,roomleft=user.roomId,userleft=user.userId}
         }),
       console.log(`Socket ${socket.id} disconnected.`);
       
      //  idArray.push(socket.id);

        // users.map((user,idx)=>{
        //   //idArray.forEach((e) =>
        //   idArray[0]===user.id
        //       ? ((itemIdx=idx),(nameLeft=user.name))
        //       : nameLeft="somebody"
        // });

        // let roomLeft=users[itemIdx].roomId;//??????????????????????
        console.log(userleft+" left from room "+ roomleft);
        io.emit("loggedOut",userleft);
        users.splice(itemIdx,1);
        memberCounter--;
        if(users.length===0){refreshServer()}
      });
});

function getRandomizer(bottom, top){
  return Math.floor(Math.random() 
  *(1+top-bottom))+bottom;
};

function sendHeartbeat(){
  setTimeout(sendHeartbeat,99000);//every 8 seconds
     io.sockets.emit('ping',{beat:1});
  }//what if disconnected?

function checkRoom(){
  console.log("just check")
  if(users.length===4){
    io.emit("Full",users),
    memberCounter=0,
    socketMemo=[],
    setTimeout(sendHeartbeat, 80000)
    }
}

function refreshServer(){
  memberCounter=0;
  console.log("refresh server");
  users=[];
  roomNumb=[];
  http.close(()=>{
    io.close();
    http.listen(process.env.PORT||3000,()=>{
      console.log("port at 3000 is ready");
    });
  });
}
