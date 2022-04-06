//3700a8dbca35d16c033083901e784914174ea576 commited on 4/1/22
const {MongoClient} = require('mongodb');
const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const getId = require("./majiang_main/src/utilities/userId");
const {getTiles, randomTiles, tilesMade} = require("./majiang_main/src/utilities/tileMaker")
let rooms = null;//should have user data with roomid (found in 43)
let roomNumb = 0;//?????
let users = [];
let tiles = [];
let dupCounter = 0;
let connected=false;
let dataCollect = [];//need differ room into consideration
let temp = new Array(4);
let seat = 0; //counter for seat selected
let memberCounter = 0; //members counter for loggedIn in one game room
   main('getRooms').catch(console.error)//shoould be ... getRooms when start the server
  //  setTimeout(()=>{console.log(rooms, ' / get rooms')}, 24000);//????????????????
   http.listen(process.env.PORT || 3000, () => {
    console.log("port at 3000 is ready");
    })
   io.on("connection",(socket)=>{
   console.log(`Socket ${socket.id} connected.`);
      socket.emit('whoIsIn')
      
      socket.on('sign_in', data=>{// [player.name, roomId]
        console.log(data, ' / 29 sign in payload')
        rooms.map(e=>e.roomId===data[1]
        ?(console.log(e, ' / the room logged in'), e.users.map(ele=>ele.name===data[0]
          ?(socket.join(data[1]), io.to(data[1]).emit('loggedIn', ele))//notifing thay logged in
          :io.to(data[1]).emit('loggedIn','nameMisMatch')))// msg sent for rename the player
        :socket.emit('loggedIn', 'noSuchRoom'))// msg re room name 
      })
 // socket.emit('wasconnected');
  //==================================================================== 
  // socket.on('current',data=>{
  //   console.log("wasconnected?","/", data.userId,' / ',socket.id);
  //    if(!data){ return}
  //    else{console.log(data,"/comms back",users.map((e=>
  //     e.userId)))
  //      let index
  //      users.map((ele,i)=>{
  //        //(ele.roomId===data[0])//?????????????????
  //        if(ele.userId===data[1])
  //         { (index=i, console.log(users[index].id+" / 33/ "+data[1]))}
  //          else{return}})
  //      users[index].id=socket.id
  //      console.log(users[index].name+"comes back at room)"+users[index].roomId)
  //   checkRoom()}
  //      });

  //=======================================================================
 
    socket.on('sign_up', data=>{
      let flag=true, room=[]
      rooms.find(e=>e.roomName===data[1]
        ?(flag=false, room=e, socket.join(data[1])):'')
      console.log('sign_up', data[0],' / ', data[1], ' / ', data[2])
      if(flag){roomNumb=getId.getId(5);//true : starts the room
      socket.join(data[1]);
      room = 
      {
       roomId:roomNumb, 
        roomName:data[1], 
           users:
              [{ id: socket.id,
                 name:data[0],
                 userId: getId.getId(8),
                 dealer: false
              }]}
      rooms.push(room)
    }
      else{
      room.users.push({id:socket.id, 
                       name:data[0],
                       userId:getId.getId(8),
                       dealer:false
                      })}
      console.log(room, ' line 106')
      io.to(data[1]).emit('new_user', room)
     // rooms.map(e=>e.roomId===room.roomId?e.users.push(room.users[room.users.length-1]):'')
      room.users.length===4?checkRoom(room):''
    })
    //^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^create an instance with this room 


    //user object from login component
    // socket.on("newuser",data=>{
    //   memberCounter++;
    //   if(memberCounter===5){
    //     (memberCounter=4)
    //   } 
    //   users[data.index].id=data.socketId;
    //   users[data.index].userId=data.userId
    //   users[data.index].name=data.name;
    //   users[data.index].roomId=data.roomId;
    //   users[data.index].loggedIn=data.loggedIn
    //   console.log(`${users[data.index].userId} comes in room ${data.roomId} now !`);

    //   io.emit("userOnline", users[data.index]);
    //   (users.length!==4)
    //   ?"doNothing"
    //   :checkRoom()//see status of the room
    //   });
    //find any who left the room...
  //  socket.on('ping1',(data)=>{//only socket and 'ping1'work?????
  //      users.map((user)=>{
  //        user.roomId===data.roomId
  //          ? user.userId===data.userId
  //            ?(user.id=data.id)
  //            :""//1/4 sockets match
  //            :""//always find 1/4>>>>>
  //      });
  //  });

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
      setTimeout(()=>{io.emit("sitDown")},4000);
      // io.emit("sitDown")
      }
  }),
 
    //seat selected
    socket.on('ready',data=>{//[0]=user, [1]=index
     temp[data[1]]=data[0];//rearange the users by seats
     seat++;
     if (seat===4){
       let data=[...temp]
       users=data//consis users with vuex state
       seat=0
       let tileWalls=tilesMade(data, tiles)//set up tiles
       io.emit('ready1', [{onHands:tileWalls[0], 
        onTable:tileWalls[1],
        allTiles:tiles},
        users]) 
       temp=new Array(4)
     }
    });

    socket.on('start', data=>
         socket.broadcast.emit('start1', data))
    
       socket.on('sort',a=>{
        socket.broadcast.emit('sort1',a)
      }),

      socket.on('deserted',data=>
      socket.broadcast.emit('deserted1',data))
                          
       socket.on('disTile',data =>{//data=self, tile.id
         socket.broadcast.emit('disTile1',data)
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
       // io.emit('getTile1',data)
       })
       socket.on('pengChowKong', payload=>{
         io.emit('pengChowKong1', payload)
       })
       socket.on('updateCasted', ()=>
       socket.broadcast.emit('updateCasted1'))

       socket.on('mahjiong', data=>{
        io.emit('mahjiong1', data)
        tiles=getTiles();
       
        let shuffled=[];
        while(tiles.length>0){
            let k=getRandomizer(0, tiles.length-1);
            shuffled.push(tiles[k])
            tiles.splice(k, 1)
        }
        tiles=randomTiles(shuffled);

        // io.emit('mahjiong1', data)
       })
       //====================================================
       socket.on('restart', data=>//[0]=players, [1]=?, [2]=?
      { users=data[0]
        let a=tilesMade(users, tiles)
        tileWalls=Object.values(a)
  
        io.emit('restart1', [{onHands:tileWalls[0], 
                 onTable:tileWalls[1], allTiles:tiles},
                 users, data[1], data[2]])
      })

       //payload[0]=tiles, [1]=users, [2]=goAhead, [3]=inturn          
       //====================================================
       //io.on deffer from socket.on!!!!
       socket.on("disconnect",()=>{
         let itemIdx,  roomleft, 
         userleft
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
        // users.splice(itemIdx,1);
        // memberCounter--;
        // if(users.length===0){refreshServer()}
      });
});

function getRandomizer(bottom, top){
  return Math.floor(Math.random() 
  *(1+top-bottom))+bottom;
};

// function sendHeartbeat(){
//   setTimeout(sendHeartbeat,99000);//every 8 seconds
//      io.sockets.emit('ping',{beat:1});
//   }//what if disconnected?

// app.route('/', (req, res)=> res.send(index)) )

function checkRoom(room){
  console.log("just check")
  if(room.users.length===4){
    rooms.length===1
    ?(console.log(room.roomName), arg=['createRoom', room],main(arg))
    :(arg=['updateRoom', room],main(arg))
    io.to(room.roomName).emit("Full",room),
    memberCounter=0
    // setTimeout(sendHeartbeat, 80000)
    }
}

async function main(arg) {
  if(arg===[]||!arg){return}
 
  const uri = "mongodb+srv://jimly56:Hangzhou@cluster0.gtlmr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
 // const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
  const client = new MongoClient(uri)
  try{
    await client.connect()
    console.log(arg)
    if(client){connected=true, console.log('db.connected!...', connected, ' / ', rooms)}
   // if(rooms.length===1){await createRooms(client, room)}
    if(arg==='listing'){await listDatabases(client)} //this for check up document in database,
    //=================================
    if(arg.length===2&&arg[0]==='createRoom'){await createRooms(client, arg[1])}
    if(arg.length===2&&arg[0]==='updateRoom'){await updateRooms(client, arg[1].roomName, arg[1])}
    if(arg==='getRooms'){console.log('getRooms!!'); rooms = await getRooms(client)}
    
    //   // Update the Infinite Views listing to have 6 bedrooms and 8 beds 
    // await updateRooms(client, "Infinite Views", 
    // {roomId: roomNumb, roomName: roomName, users:[{}] });
   
    } catch(e){
        console.error(e)
    } finally {
        await client.close()
    }
}
//create the data document
async function createRooms(client, room){
  // See https://mongodb.github.io/node-mongodb-native/3.6/api/Collection.html#insertOne for the insertOne() docs
  const result = await client.db("mahjong_db").collection("rooms").insertOne(room);
  console.log(`New listing created with the following id: ${result.insertedId}`);
};
//read data document
async function getRooms(client) {
  // See https://mongodb.github.io/node-mongodb-native/3.6/api/Collection.html#findOne for the findOne() docs
  const result = await client.db("mahjong_db").collection("rooms").findOne();

  if (result) {
      rooms=JSON.parse(JSON.stringify(result))
      console.log(`Found a listing in the collection with the name '${rooms.roomName}':`);
      console.log(rooms);
  } else {
      console.log(`No listings found with the name '${nameOfRoom}'`);
  }
};

async function updateRooms(client, nameOfRoom, updatedRooms) {
  // See https://mongodb.github.io/node-mongodb-native/3.6/api/Collection.html#updateOne for the updateOne() docs
  const result = await client.db("mahjong_rooms").collection("rooms").updateOne({ name: nameOfRoom }, { $set: updatedRooms });

  console.log(`${result.matchedCount} document(s) matched the query criteria.`);
  console.log(`${result.modifiedCount} document(s) was/were updated.`);
}
async function listDatabases(client) {
  databasesList = await client.db().admin().listDatabases();

  console.log("Databases:");
  databasesList.databases.forEach(db => console.log(` - ${db.name}`));
  return
};

function refreshServer(){
  return
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
