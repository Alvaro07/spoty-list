/**
 * Construye la playlist y la muestra
 * @function
 */
function addPlaylist(data){
    // playlistInfo.innerHTML = ""
    playlistList = "";
    
    data.forEach(function ShowResults(value, index) {
        playlistList += '<li class="playlist__item">' +
                            '<div class="playlist__item__image"><img src="' + value.image + '"></div>'+
                            '<div class="playlist__item__title"><p class="name">' + value.name + '</p><p class="album">' + value.album +'</p></div>' +
                            '<div class="playlist__item__buttons">'+
                               '<button class="play-preview" data-id="' + value.id + '" data-preview="' + value.previewURL + '"><i class="fa fa-play" aria-hidden="true"></i></button></div>' +
                            '<div class="playlist__item__buttons">'+
                               '<button data-id="' + value.id + '" class="delete-button"><i class="fa fa-trash-o" aria-hidden="true"></i></button></div>'+
                       '</div></li>';
        
    });
    playlistItems.innerHTML = playlistList;

}

/**
 * Borra elemento de la playlist asi cmo su audio si esta reproduciendose
 * @function
 */
function deleteItemPlaylist(id){
    
    var idList = [];
    itemsToPlaylist.forEach(function ListaIds(value, index){
        idList.push(value.id);
    });
    
    // si se esta reproduciendo el audio de la canción a eliminar pausamos también el audio
    if ( audioObject &&  audioObject.getAttribute("data-id") === id) {
        audioObject.pause();
    }
    
    var posElement = idList.indexOf(id);
    tracksToPlaylist.splice(posElement, 1);
    itemsToPlaylist.splice(posElement, 1);
    
    addPlaylist(itemsToPlaylist);
    window.localStorage.setItem('playListStorage', JSON.stringify(itemsToPlaylist));
    
    // seteamos si hay items en la playlist para deshabilitar el input
    if (itemsToPlaylist.length === 0){
        listName.setAttribute("disabled", false);
        createPlaylistButton.setAttribute("disabled", false)
    }
    
}


/**
 * Escucha el evento click para construir el audio
 * Crea un objeto audio y lo reproduce con un click
 * @function
 */
 playlistItems.addEventListener("click", function(e){
        var target = e.target;
        
        
        // añadimos playlist
        if ( target.classList.contains("anade-playlist")){
            
            var fatherPath = target.parentNode.parentNode.parentNode.parentNode;
              
            itemsToPlaylist.push({
                name : fatherPath.querySelector(".title").innerHTML,
                album: fatherPath.querySelector(".subtitle").innerHTML,
                image: fatherPath.querySelector("img").getAttribute("src"),
                previewURL : fatherPath.querySelector(".play-preview").getAttribute("data-preview"),
                URItrack : target.getAttribute("data-uri"),
                id : target.getAttribute("data-id")
            });
            
            
            addPlaylist(itemsToPlaylist);
            
            tracksToPlaylist.push(target.getAttribute("data-uri"));
            console.log(tracksToPlaylist);
    
            // // window.localStorage.setItem('playListStorage', JSON.stringify(itemsToPlaylist));
            
            // Hablitimaos el input para el nombre del playlist, asi como el boton si el campo tiene caractéres
            listName.removeAttribute("disabled");
            
            if (listName.value != 0) {
                createPlaylistButton.removeAttribute("disabled");
            }
            
            
            
        };
        
        // borrarmos items de la playlist
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
 
/**
 * Funciona para abrir un modal al crear playlist
 * @function
 */
 
var modalPlaylist = new tingle.modal({
    closeMethods: [],
    footer: true,
    stickyFooter: true
});


modalPlaylist.addFooterBtn('NEW PLAYLIST', 'c-button tingle-btn', function(){
    
    // reseteo todo a 0
    playListStorage = [];
    itemsToPlaylist = [];
    tracksToPlaylist = [];
    
    playlistItems.innerHTML = ""
    
    itemsSearchResults.innerHTML = "";
    addMoreButton.style.display = "none";
    
    listName.value = "";
    listName.setAttribute("disabled", false)
    createPlaylistButton.setAttribute("disabled", false)
    
    if (audioObject) {
        audioObject.pause();
    }
    
    modalPlaylist.close();
    
});

modalPlaylist.addFooterBtn('CONTINUE', 'c-button tingle-btn', function(){
    modalPlaylist.close();
});  


 /**
 * Comprueba si localstorage esta vacio, si no es así, recupera tu playlist y la pinta
 * @function
 */
var playListStorage;
if (window.localStorage && window.localStorage.length != 0) {
    
    playListStorage = JSON.parse(window.localStorage.getItem('playListStorage'));
    
    itemsToPlaylist = playListStorage;
    addPlaylist(itemsToPlaylist);
    
    itemsToPlaylist.forEach(function dataPlaylist(value, index){
        tracksToPlaylist.push(value.URItrack);
    });
    
    // seteamos si hay items en la playlist para deshabilitar el input
    if (itemsToPlaylist.length === 0){
        listName.setAttribute("disabled", false);
    } else {
        listName.removeAttribute("disabled");
    }
    
}; 
 