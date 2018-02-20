// Globals variables
var tracksToPlaylist = [],
    itemsToPlaylist = [], 
    playlistName = "new playlist",
    playlistList = "",
    itemsList = "";
    
// DOM Elements
var playlistItems = document.getElementById("playlistItems"),
    createPlaylistButton = document.getElementById('playlistAdd'),
    addMoreWrap = document.getElementById('addMoreWrap');

/**
 * Construye la playlist y la muestra
 * @param {object} data - datos necesarios para añadir track a la playlist
 * @param {boolean} modalState - parametro opcional que lo utlizamos para
 * no sacar la modal cuando añadimos un tema, por ejemplo cuando añadimos al localstorage los tracks.
 * @function
 */

function addPlaylist(data, modalState){ 
    
    
    /** seteamos la variables playlist a 0, para volver a crear la playlist 
    completa con todos los datos del objeto que le pasamos */
    
    playlistList = "";
    
    /** Construimos el html del playlist */

    data.forEach(function ShowResults(value, index) {
        playlistList += '<li class="playlist__item play-preview" data-id="' + value.id + '" data-preview="' + value.previewURL + '">' +
                          '<div class="playlist__item__image"><img src="' + value.imageAlbum + '"></div>'+
                          '<div class="playlist__item__title"><p class="name">' + value.name + '</p><p class="album">' + value.album +'</p></div>' +
                          '<div class="playlist__item__buttons">'+
                            '<button><i class="fa fa-play" aria-hidden="true"></i></button></div>' +
                          '<div class="playlist__item__buttons">'+
                            '<button data-id="' + value.id + '" class="delete-button">'+
                            '<i class="fa fa-trash-o" aria-hidden="true"></i>' +
                          '</button></div>'+
                        '</div></li>';
        
    });
    
    /** Pintamos los elementos en el DOM */
    
    playlistItems.innerHTML = playlistList;
    
    
    /** Si no le pasamos el parametro modalState o se lo pasamos en true, 
    * añadimos el modal para indicar al usuario que el track a sido añadido */
    
    if (modalState != false) {
        
        smallModal.open();
        smallModal.setContent("The track is added");
        
    }
    

}



/**
 * Borra elemento de la playlist asi cmo su audio si esta reproduciendose
 * @function
 */
function deleteItemPlaylist(id){
    
    
    /** Inicializamos la lista de ids que obtndremos para luego exportar la lista al usuario */
    
    var idList = [];
    itemsToPlaylist.forEach(function ListaIds(value, index){
        idList.push(value.id);
    });


    /** si se esta reproduciendo el audio de la canción a eliminar pausamos también el audio */
    if ( audioObject &&  audioObject.getAttribute("data-id") === id) {
        audioObject.pause();
    }
    
    /** Comprobamos la posicion del elemento a borrar en el array para eliminarlo */
    var posElement = idList.indexOf(id);
    tracksToPlaylist.splice(posElement, 1);
    itemsToPlaylist.splice(posElement, 1);
    
    /** Una vez eliminado volvemos a pintar la lista sin elemento que hemos borrado
    así, como también volvemos a añadir los datos al localStorage*/
    
    addPlaylist(itemsToPlaylist, false);
    window.localStorage.setItem('playListStorage', JSON.stringify(itemsToPlaylist));
    
    /** Al haber eliminado un item, comprobamos si aún quedan elementos en la playlist
    para deshabilitar los elemenetos de la creación de la playtlist */
    
    if (itemsToPlaylist.length === 0){
        listName.setAttribute("disabled", false);
        createPlaylistButton.setAttribute("disabled", false);
        listName.value = "";
    }
}




/** Capturmaos los eventos en la playlist para poder borrar los elementos */

playlistItems.addEventListener("click", function(e){
    var target = e.target;
    
    /** borrarmos items de la playlist */
    if (target.classList.contains("delete-button")) {
        deleteItemPlaylist(target.getAttribute("data-id"));
    }
    
    
}); 

/**
 * Añado listeners para la llamada a la función
 * Compruebo si hay caracteres de texto en el input
 * Elimino el disabled del boton
 * lanzo la funcion de creación de playlist desde el boton o el enter del input reconocido
 */
 
listName.addEventListener("keyup", function(event){
    if (this.value != 0) {
        createPlaylistButton.removeAttribute("disabled");
        
        if (event.which == 13 || event.keyCode == 13) {
           createPlaylist(listName);
        }
    } else {
        createPlaylistButton.setAttribute("disabled", false)
    }
});
 
createPlaylistButton.addEventListener("click", function(event){
    createPlaylist(listName);
});
 


/**
 * Funcion para resetear la playlist para empezar una nueva busqueda/mix
 * inicializamos todas las variables, asi como el localstorage
 * @function
 */

function resetPlaylist(){
    
    playListStorage = [];
    itemsToPlaylist = [];
    tracksToPlaylist = [];
    // window.localStorage.setItem('playListStorage', JSON.stringify(itemsToPlaylist));
    window.localStorage.clear();
    // console.log(window.localStorage)
    
};


/**
 * Añade evento al boton de creación de la playlist
 * envia un objeto al back para la creación de dicha playlist en el usuario
 * @function
 */
 
function createPlaylist(listInput){
    
    playlistName = listInput.value;

    var xmlHttp = new XMLHttpRequest();
	xmlHttp.open("POST", "/playlist");
    xmlHttp.setRequestHeader("Content-Type", "application/json");
    xmlHttp.send(JSON.stringify({
        name : playlistName, 
        tracksToAdd: tracksToPlaylist
    }));
    
    modalPlaylist.setContent("<p>The list has been created in your profile</p>");
    modalPlaylist.open();
}  





/** Creamos el modal que se lanza al exportar una playlist */

var modalPlaylist = new tingle.modal({
    closeMethods: [],
    footer: true,
    stickyFooter: true
});

modalPlaylist.addFooterBtn('NEW PLAYLIST', 'c-button tingle-btn', function(){

    resetPlaylist();
    playlistItems.innerHTML = "";
    
    
    
    /** dependiendo en la secciomn que estemos borramos el contenido del DOM
    así como ocultamos el boton 'add morte items' */

    if (pageWrap.classList.contains('search-page')){
        
        itemsSearchResults.innerHTML = "";
        addMoreButton.style.display = "none";
        
    } else if (pageWrap.classList.contains('mix-page')){
        
        /** inicializamos las variables asi como el contenido en el DOM de las dos playlist,
        también llevamos los combos a su opcion predeterminada y lanzamos la función watchEmptyPlaylist()
        para ver si mantenemos o no el boton de mezclar la listas */
        
        arrayMixOne = [];
        areaMixOne.innerHTML = '';
        listaTemasArray = [];
        comboMixOne.selectedIndex = "0";
        
        arrayMixTwo = [];
        areaMixTwo.innerHTML = '';
        listaTemasArray = [];
        comboMixTwo.selectedIndex = "0";
        
        watchEmptyMixlists();
        
    };
    
    /** inicializamos los campos para exportar la playlist asi como deshabilitar el boron de 'create playlist'
    si hay audio reproduciendose también lo eliminamos */
        
    listName.value = "";
    listName.setAttribute("disabled", false);
    createPlaylistButton.setAttribute("disabled", false)
    
    if (audioObject) {
        audioObject.pause();
    }
    
    modalPlaylist.close(); 
    
});

modalPlaylist.addFooterBtn('CONTINUE', 'c-button tingle-btn', function(){
    modalPlaylist.close();
});  


/** Comprueba si localstorage esta vacio, si no es así, recupera tu playlist y la pinta */

var playListStorage = [];
if ( window.localStorage = true && window.localStorage.length != 0) {
    
    playListStorage = JSON.parse(window.localStorage.getItem('playListStorage'));
    itemsToPlaylist = playListStorage;
    addPlaylist(itemsToPlaylist, false);
    
    itemsToPlaylist.forEach(function dataPlaylist(value, index){
        tracksToPlaylist.push(value.URItrack);
    });
    
    /** seteamos si hay items en la playlist para deshabilitar el input /*/
    
    if (itemsToPlaylist.length === 0){
        listName.setAttribute("disabled", false);
    } else {
        listName.removeAttribute("disabled");  
    }
    
}; 
 