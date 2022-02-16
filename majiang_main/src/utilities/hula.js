export function findPong(data){
    let groupBy=function(data, key){
        return data.reduce(function(rv, x){
        (rv[x[key]]=rv[x[key]]||[]).push(x);
        return rv;
        },{});
    };
    let c=groupBy(data,"typeSort")
    return c
}

export function findChowHand(data){
    let chowGroup=[]
    let counter=15
    function findChow(data){
        let chow=[]
        let rest=[]
        data.forEach((ele) => {
        //console.log(ele.typeSort);
        (chow.length===0)?chow.push(ele)
        :(chow[chow.length-1].typeSort===(ele.typeSort-1)
        &&chow.length!==3)
                   ?chow.push(ele)
                   :rest.push(ele);
                //    window.console.log(rest,"/",idx)
        }); 
    chowGroup.push(chow) 
    counter--
    (counter||!chow)?findChow(rest)
    // (counter)?findChow(rest)
    :(rest.length)?rest.push(rest):'end!'
    rest=[]
    chow=[]
    }
    if(chowGroup.length===0){findChow(data)}
    let temp=[]
    return peelZeros(chowGroup)
    function peelZeros(data){
        data.forEach((e)=>e.length!==0
        ?(temp.push(e))//??????
        :"doNothing")
        return temp
    }
}

    export function grouping(array){
    let groupOne=[], groupTwo=[]
       array.forEach((e)=>{
      if(e.length===0){return}
      if(e.length>1){groupOne.push(e)}
      else{Array.prototype.push.apply(groupTwo,e)
       }})
      let a=Object.values(findPong(groupTwo))
    //   window.console.log(groupOne.concat(a))
      let result = groupOne.concat(a)
     // window.console.log(result)
      return result
    }