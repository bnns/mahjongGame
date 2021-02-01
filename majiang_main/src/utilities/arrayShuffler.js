const shuffler = (array, units)=>{
    let shuffled = [];
    while(array.length>0){
        let k = getRandomizer(0, array.length-1);
        shuffled.push(array[k])
        array.splice(k, 1)
    }
    console.log("shuffled", shuffled);
    return shuffled;
  }

  const getRandomizer = (bottom, top)=>{
    return Math.floor(Math.random() 
    * (1 + top - bottom)) + bottom;
  };

  export const arrayShuffler = this.arrayShuffler();
  export const getRandomizer = this.getRandomizer();