const contImagenCancion = document.getElementById('imagen-cancion');
const portada = document.getElementById('portada');
const infoCancion = document.getElementById('info_cancion');
const tituloCancion = document.getElementById('titulo');
const artistaCancion = document.getElementById('artista');
const barraPrograso = document.getElementById('barra_prograso');
const beginningSong = document.getElementById('inicio');
const songProgress = document.getElementById('progreso');
const endSong = document.getElementById('final');
const controles = document.getElementById('controles');
const btnRepetir = document.getElementById('btn_repetir2');
const btnAtras = document.getElementById('btn_atras');
const btnPlay = document.getElementById('btn_play');
const btnAdelante = document.getElementById('btn_adelante');
const contenedorPlayer = document.getElementById('player_contenedor')
let indiceActual = 0
let audio = new Audio()
let canciones = []
let isPlaying = false;

document.addEventListener('DOMContentLoaded', () => {
    fetch('canciones.json')
        .then(response => response.json())
        .then(data => {
            canciones = data
            // aqui van el llamado a las funciones de cada funcioanlidad que se van a crear proximamente
            mostrarCancion(indiceActual)
            eventsToAudio();
        }).catch(error => {
            console.log('Error al cargar las canciones: ', error)
        })
})
function mostrarCancion(indice) {
    const cancion = canciones[indice];
    portada.setAttribute('src', `${cancion.caratula}`)
    tituloCancion.textContent = `${cancion.nombre}`;
    artistaCancion.textContent = `${cancion.artista}`
    endSong.textContent = `${cancion.duracion}`

    // cargar la nueva cancion
    audio.src = cancion.cancion;
    audio.load()

    // reiniciar prograso cada que se inicie el audio
    songProgress.value = 0;
    beginningSong.textContent = '00:00'

    // condicional para que si se estaba reproduciendo se ponga la nueva cancion
    if (isPlaying) {
        playAudio();
    }

}
function playAudio() {
    audio.play();
    isPlaying = true;
    btnPlay.textContent = ' || ' // cambiar a pausa
}
function pauseAudio() {
    audio.pause();
    isPlaying = false;
    btnPlay.textContent = '▶️'; // cambiar a play

}
// funcion para que asi como se pausa tambien se vuelva a reproducir, se hace un condicional para que cada que se cumpla la condicion principal se ejecute una funcion especifica, ya sea pausarla o reproducirla
function togglePlayPause() {
    if (isPlaying) {
        pauseAudio();
    } else {
        playAudio();
    }
}
function eventsToAudio() {
    // funcion para actualizar la barra de progreso mientras se reproduce
    audio.addEventListener('timeupdate', () => {
        if (audio.duration) {
            const percent = (audio.currentTime / audio.duration) * 100;
            songProgress.value = percent;
            beginningSong.textContent = formatearTiempo(audio.currentTime)
        }
    })
    // cuando se carga la duracion de cada cancion
    audio.addEventListener('loadedmetadata', () => {
        songProgress.max = 100;
        endSong.textContent = formatearTiempo(audio.duration);
    })
    // cuando termina la cancion
    audio.addEventListener('ended', () => {
        nextSong();
    })
}
function formatearTiempo(segundos) {
    if (isNaN(segundos)) return '00:00'; {
        const minutes = Math.floor(segundos / 60);
        const seconds = Math.floor(segundos % 60);
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
}
function nextSong() {
    if (indiceActual === canciones.length - 1) {
        indiceActual = 0;
    } else {
        indiceActual++
    }
    mostrarCancion(indiceActual)
}
function previousSong(params) {
    if (indiceActual === 0) {
        indiceActual = canciones.lengt - 1
    } else {
        indiceActual--
    } mostrarCancion(indiceActual)
}

// Eventos para que se ejecute apenas se le da click a los botones
btnPlay.addEventListener('click', togglePlayPause);
btnAdelante.addEventListener('click', nextSong);
btnAtras.addEventListener('click', previousSong);

// funcion para permitir que se adelante o atrase la cancion con la barra de navegacion
songProgress.addEventListener('input', () => {
    const time = (songProgress.value / 100) * audio.duration;
    audio.currentTime = time
})
