console.log("hello");
let currsong=new Audio();
currsong.pause()
let songs
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

async function getSongs() {
    try {
        const res = await fetch("songs.json");
        if (!res.ok) throw new Error("Songs list not found");
        const songs = await res.json();
        return songs;
    } catch (err) {
        console.error("Error loading songs:", err);
        return [];
    }
}

const pauseIcon = `
<svg width="35" height="35" viewBox="0 0 60 60">
  <circle cx="30" cy="30" r="30" fill="#F44336"/>
  <rect x="20" y="18" width="8" height="24" fill="#FFF"/>
  <rect x="32" y="18" width="8" height="24" fill="#FFF"/>
</svg>
`;
// const simplifyName = decodeURIComponent(song)
//             .replace(/(pagalworld|\.mp3)/gi, "")
//             .trim();

const playIcon = `
<svg width="35" height="35" viewBox="0 0 60 60">
  <circle cx="30" cy="30" r="30" fill="#4CAF50"/>
  <polygon points="24,18 24,42 42,30" fill="#FFF"/>
</svg>
`;

const playMusic=(track,pause=true)=>{
    
    currsong.src=`songs/${track}`
    if(!pause){
       currsong.play();
         const play = document.querySelector("#play"); 
        play.innerHTML = playIcon
         
    }
    console.log(currsong)
     currsong.play();
      play.innerHTML = pauseIcon
    
    document.querySelector(".song-name").innerHTML=decodeURIComponent(track)
            .replace(/(pagalworld|\.mp3)/gi, "")
            .trim();
    document.querySelector(".song-time").innerHTML="00:00 / 00:00"
}


async function main() {
   songs = await getSongs();
   
    const songList = document.querySelector(".songlist ul");
    
    // Clear existing list
    songList.innerHTML = '';
    
    songs.forEach(song => {
        const li = document.createElement('li');
        const displayName = decodeURIComponent(song)
            .replace(/(pagalworld|\.mp3)/gi, "")
            .trim();
        
        li.innerHTML = `
            <div class="musiclogo">
                <svg width="35" height="35" viewBox="0 0 64 64">
                    <circle cx="32" cy="32" r="30" fill="#282828"/>
                    <path d="M40 10V38.5C40 41.5376 37.5376 44 34.5 44C31.4624 44 29 41.5376 29 38.5C29 35.4624 31.4624 33 34.5 33C35.8807 33 37.1566 33.5596 38.0711 34.4645C38.9856 35.3694 39.5 36.611 39.5 37.9V18H25V45.5C25 48.5376 22.5376 51 19.5 51C16.4624 51 14 48.5376 14 45.5C14 42.4624 16.4624 40 19.5 40C20.8807 40 22.1566 40.5596 23.0711 41.4645C23.9856 42.3694 24.5 43.611 24.5 44.9V16C24.5 14.6193 25.6193 13.5 27 13.5H38C39.3807 13.5 40.5 14.6193 40.5 16V10H40Z" 
                        fill="#FFB800"/>
                </svg>
            </div>
            <div class="song-info">
                <div>${displayName}</div>
                <div></div>
            </div>
            <div class="playnow">
                <span>Play</span>
                <svg width="35" height="35" viewBox="0 0 60 60">
                    <circle cx="30" cy="30" r="30" fill="#4CAF50"/>
                    <polygon points="24,18 24,42 42,30" fill="#FFF"/>
                </svg>
            </div>
        `;
        
        li.addEventListener('click', () => playMusic(song));
        songList.appendChild(li);
    });
    const play = document.querySelector("#play"); 
    play.addEventListener("click",()=>{
        if(currsong.paused){
            currsong.play()
            play.innerHTML = pauseIcon
        }
        else{
            currsong.pause()
             play.innerHTML = playIcon;
        }
    })
    currsong.addEventListener("timeupdate",()=>{
        console.log(currsong.currentTime,currsong.duration);
        document.querySelector(".song-time").innerHTML =
            `${formatTime(currsong.currentTime)}/${formatTime(currsong.duration)}`;
        document.querySelector(".circle").style.left=(currsong.currentTime/currsong.duration) * 100 + "%";
    })


    document.querySelector(".seekbar").addEventListener("click", e => {
    const seekbar = e.currentTarget;
    let percent = (e.offsetX / seekbar.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currsong.currentTime=((currsong.duration)*percent)/100
});

const hamburger = document.querySelector(".humberger");
const closeBtn = document.querySelector(".div-cross");
const leftDiv = document.querySelector(".left-div-box");

hamburger.addEventListener("click", () => {
  leftDiv.classList.add("active");
  closeBtn.classList.add("active");
});

closeBtn.addEventListener("click", () => {

  leftDiv.classList.remove("active");
  closeBtn.classList.remove("active");
});
const next = document.querySelector("#next");
function getCurrentSongName() {
    // Extract just the filename from the audio src
    let fullPath = currsong.src; // e.g. http://127.0.0.1:5500/spotify/songs/Maand%20-%20PagalWorld.mp3
    let fileName = fullPath.substring(fullPath.lastIndexOf("/") + 1);
    return decodeURIComponent(fileName); // returns "Maand - PagalWorld.mp3"
}

next.addEventListener("click", () => {
    let currentName = getCurrentSongName();
    console.log("Current song name:", currentName); // Debug log

    function normalizeName(name) {
        return decodeURIComponent(name).trim().toLowerCase();
    }

    let index = songs.findIndex(song => normalizeName(song) === normalizeName(currentName));

    console.log("Index found:", index); // Debug log

    if (index !== -1) {
        let nextIndex = (index + 1) % songs.length;
        playMusic(songs[nextIndex]);
    } else {
        console.warn("Song not found in list!");
    }
});
const prev = document.querySelector("#prev");
prev.addEventListener("click", () => {
    let currentName = getCurrentSongName();
    function normalizeName(name) {
        return decodeURIComponent(name).trim().toLowerCase();
    }
    let index = songs.findIndex(song => normalizeName(song) === normalizeName(currentName));
     console.log("Index found:", index); // Debug log
    if (index !== -1) {
        let prevIndex = (index - 1 + songs.length) % songs.length;
        playMusic(songs[prevIndex]);
    }
});


document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
    currsong.volume=parseInt(e.target.value)/100

})


}
    



main()
