let CF
let currentSong=new Audio();
let songs=[]
function secondsToMinuteSecond(seconds) {
    if (isNaN(seconds) || seconds < 0) {
      return "Invalid input";
    }
  
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60); // Round to the nearest whole second
  
    const minuteSecondFormat = `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    
    return minuteSecondFormat;
  }

async function getSongs(folder) {
    CF=folder;
    let a = await fetch(`http://127.0.0.1:3000/${CF}/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response
    let as = div.getElementsByTagName("a")
    songs=[]
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`${CF}/`)[1])
        }
    }


    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
    songUL.innerHTML="";
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li>
        <img class="invert" src="img/music.svg" alt="" srcset="">
        <div class="info">
            <div>${song.replaceAll("%20", " ")}</div>
        </div>
        <div class="playnow">
            <span>Play Now</span>
            <img class="invert" src="img/play.svg" alt="" srcset="">
        </div>
    </li>`
    }

    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click",element=>{
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
    });
    
}

const playMusic=(track,pause=false)=>{
    currentSong.src=`/${CF}/`+track
    console.log(currentSong.src)
    if(!pause){
        currentSong.play()
        play.src="img/pause.svg"
    }
    document.querySelector(".songinfo").innerHTML=decodeURI(track)
    document.querySelector(".songtime").innerHTML="00:00/00:00"
}

async function displayAlbums(){
    let a = await fetch(`http://127.0.0.1:3000/sng/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response
}

async function main() {

    // getting list all songs
    await getSongs("sng/cs")
    playMusic(songs[0],true)
    console.log(songs)

    // display all the albums on the page

    

    play.addEventListener("click",()=>{
        if(currentSong.paused){
            currentSong.play()
            play.src="img/pause.svg"
        }else{
            currentSong.pause()
            play.src="img/play.svg"
        }
    })

    currentSong.addEventListener("timeupdate",()=>{
        document.querySelector(".songtime").innerHTML=`${secondsToMinuteSecond(currentSong.currentTime)}/${secondsToMinuteSecond(currentSong.duration)}`
        document.querySelector(".circle").style.left=(currentSong.currentTime/currentSong.duration)*100+"%"
    })

    document.querySelector(".seekbar").addEventListener("click",e=>{
        document.querySelector(".circle").style.left=(e.offsetX/e.target.getBoundingClientRect().width)*100+"%"
        let p=(e.offsetX/e.target.getBoundingClientRect().width)*100
        currentSong.currentTime=(currentSong.duration)*p/100
    })

    // add event listener to hamburger
    document.querySelector(".hamburger").addEventListener("click",()=>{
        document.querySelector(".left").style.left="0"
    })

    // add event listener to close
    document.querySelector(".close").addEventListener("click",()=>{
        document.querySelector(".left").style.left="-120%"
    })

    prev.addEventListener("click",()=>{
        let ind=songs.indexOf(currentSong.src.split("/").slice(-1) [0])
        // console.log("yes")
        if(ind-1>=0){
            playMusic(songs[ind-1])
        }
    })

    next.addEventListener("click",()=>{
        let ind=songs.indexOf(currentSong.src.split("/").slice(-1) [0])
        // console.log("yes")
        if(ind+1<songs.length){
            playMusic(songs[ind+1])
        }
    })

    // add event to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
        currentSong.volume=parseInt(e.target.value)/100
    })

    // load playlist when card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(e=>{
        e.addEventListener("click",async item=>{
            songs = await getSongs(`sng/${item.currentTarget.dataset.folder}`)
        })
    })

    // ad event listener to mute
    document.querySelector(".volume>img").addEventListener("click",e=>{
        if(e.target.src.includes("volume.svg")){
            e.target.src=e.target.src.replace("volume.svg","mute.svg")
            currentSong.volume=0

        }else{
            e.target.src=e.target.src.replace("mute.svg","volume.svg")
            currentSong.volume=0.1
        }
    })

}



main()