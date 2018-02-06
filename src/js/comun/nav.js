/**
 * Función para abrir y cerrar el menu principal para movil
 * @function
 */
 
 function toggleMenu(){
    pageWrap.classList.toggle('off');
    mask.classList.toggle('show');
}

document.getElementById('toggleNav').addEventListener('click', function(event){
    toggleMenu();
})

document.getElementById('closeNav').addEventListener('click', function(event){
    toggleMenu();
})

mask.addEventListener('click', function(event){
    toggleMenu(); 
})


/* Reseteamos todos los datos de la playlist cuando cambiemos de sección */
document.getElementById('primaryNav').addEventListener('click', function(){
    resetPlaylist();
})