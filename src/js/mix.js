"use strict";

var areaMixOne = document.getElementById('areaMixOne'),
    areaMixTwo = document.getElementById('areaMixTwo'),
    areaMixFinal = document.getElementById('areaMixFinal'),
    comboMixOne = document.getElementById('comboMixOne'),
    comboMixTwo = document.getElementById('comboMixTwo'),
    mixPlaylistsButton = document.getElementById('mixPlaylistsButton'),
    playlistItemsMix = document.getElementById('playlistItemsMix'),
    arrayMixOne = [],  
    arrayMixTwo = [],
    listaTemasArray = [];

/**
 * Construye la playlist y la muestra
 * @param {object} data - datos necesarios para añadir track a la playlist
 * @param {boolean} modalState - parametro opcional que lo utlizamos para
 * no sacar la modal cuando añadimos un tema, por ejemplo cuando añadimos al localstorage los tracks.
 * @function
 */
 
function printUserPlaylists(mixZone, userSearch){ 
        
        /** Si no le indicamos usuario usamos el perfil con el que nos hemos logado */
        var userName;
        
        if ( userSearch === undefined) {
            userSearch = "myUser";    
        } else {
            userName = userSearch;
        }
        
        var url = '/apiPlaylists/dataPlaylists?user=' + userSearch;
        peticionAJAX(url, function(data){
            data = JSON.parse(data);
            
            var dataItems = data.items;
            
            if ( userSearch === "myUser") {
                userName = data.userName;    
            }
            
            if ( dataItems.length === 0){
                
                var modalTinyNoFooter = new tingle.modal({});
                modalTinyNoFooter.open();
                modalTinyNoFooter.setContent("This user dont have playlists or not exist");

                
            } else {
                
                /** Pintamos todas las opciones del combo, empezando por un 'select playlist' inicial */
                itemsList = "<option data-selector='index-option'>Select your playlist</option>";
                
                dataItems.forEach(function ShowResults(value, index){
                    itemsList += "<option id="+ value.id + " data-user="+ value.ownerId +">" + value.name + "</option>";
                });
                
                /** Rellenamos los dos combos con las posibles listas del usuario a mezclar */
                
                var element = '#' + mixZone + ' .c-combo-box';
                var userElemenet = '#' + mixZone + ' .user-name';
                
                document.querySelector(element).innerHTML = itemsList;
                document.querySelector(userElemenet).innerHTML = userName;
                
                if (mixZone === 'AreaContentMixOne') {
                    
                    arrayMixOne = [];
                    areaMixOne.innerHTML = '';
                    listaTemasArray = [];
                    watchEmptyMixlists();
                    
                } else if (mixZone === 'AreaContentMixTwo') {
                    
                    arrayMixTwo = [];
                    areaMixTwo.innerHTML = '';
                    listaTemasArray = [];
                    watchEmptyMixlists();
                
                    
                }
                
            }
        });
        
    
};

/** Pintamos  las paylists al iniciar la pagina  */
printUserPlaylists('AreaContentMixOne');    
printUserPlaylists('AreaContentMixTwo');    


 /**
 * Consulta la api de spotify y devuelve un objeto con dicha busqueda
 * Si la busqueda la devuleve vacia muestra un error
 * Si ya hay items añade n más
 * @param {object} mixZone - zona donde pintara el playlist 
 * @param {string} id - identificador de dicha lista
 * @param {string} ownerId - usuario propietario de lalista
 * @function
 */


function PrintPlaylist(mixZone, id, ownerId){ 
    
    var url = '/apiListsTracks/:datatracks?id=' + id + "&user=" + ownerId;
    var arrayTest;
    
    /** inicializamos la variable que contiene los tracks  */
    
    listaTemasArray = []; 
    
    peticionAJAX(url, function(data){

            data = JSON.parse(data);
            var dataItems = data.items;
            
            var listItemsMix = '';
            dataItems.forEach(function ShowResults(value, index) {
                listItemsMix += '<li class="mix-list__item play-preview" title="play" data-id="' + value.id + '" data-preview="' + value.previewURL + '">' +
                                '<div class="mix-list__title"><p><span class="txt-bold">' + value.artist + '</span> / ' + value.name +'</p></div>' +
                                '<div class="mix-list__buttons">'+
                                   '<button><i class="fa fa-play" aria-hidden="true"></i></button></div>' +
                                '</li>';
                listaTemasArray.push(value)
            });
            
            mixZone.innerHTML = listItemsMix;
            listItemsMix = '';
            
            /** Comporbamos que zona de mix estamos pintando para igualar el
            array al array de temas antes construido  */
            
            if (mixZone === areaMixOne) {
                arrayMixOne = listaTemasArray;
            } else if (mixZone === areaMixTwo) {
                arrayMixTwo = listaTemasArray;
            }
            
            /** Comporbamos si estan las dos zonas de mix con contenido para 
            mostrar el boton de mezclar  */
            
            watchEmptyMixlists()
            return listaTemasArray;
            
    });        
};


 /**
 * Recarga el area preparado para mostrar un lista de reproduccion para posteriormente mezclarla
 * @param {object} miCombo - combo que usaremos para recargar su zona de lista 
 * @param {string} mixArea - zona de mix
 * @function
 */
 
function reloadMixArea(miCombo, mixArea){
    
    /** Comprobamos si el combo tiene un identificador paa mostrar la lista,
    si no existe es que estamos sobre el index del combo, el 'select index',
    si disponemos de identificador, pintamos dicha lista en su area */
            
    if (miCombo.options[miCombo.selectedIndex].getAttribute('id') != null){
        PrintPlaylist(
            mixArea,
            miCombo.options[miCombo.selectedIndex].getAttribute('id'),
            miCombo.options[miCombo.selectedIndex].getAttribute('data-user')
        );
        
    } else {
        
        /** Si no hay identificador significa que estamos sobre el index del combo, 
        entocnes reseteamos todas las variables dependiendo del combo en el que nos
        encontremos */
    
        if (miCombo === comboMixOne) {
            
            arrayMixOne = [];
            areaMixOne.innerHTML = '';
            listaTemasArray = [];
            watchEmptyMixlists();
            
        } else if (miCombo === comboMixTwo) {
            
            arrayMixTwo = [];
            areaMixTwo.innerHTML = '';
            listaTemasArray = [];
            watchEmptyMixlists();
            
        }
        
    };
};


 /**
 * Comprueba si estan las dos areas de mix pintadas para activar el boton de mezlar
 * @function
 */
 
function watchEmptyMixlists(){
    if ( arrayMixOne.length != 0 && arrayMixTwo.length != 0){
        addMoreWrap.classList.remove("hide");
        mixPlaylistsButton.classList.remove('disabled');
    } else {
        addMoreWrap.classList.add("hide");
        mixPlaylistsButton.classList.add('disabled');
    }
};


comboMixOne.addEventListener('change', function(){
    reloadMixArea(this, areaMixOne);
    arrayMixOne = listaTemasArray;
});


comboMixTwo.addEventListener('change', function(){
    reloadMixArea(this, areaMixTwo);
    arrayMixTwo = listaTemasArray;
});


/**
 * Modifica el orden de cualquier objeto que le pasemos
 * @function
 */
 
function arrayRandom(o) {
    for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
	return o;
};

/** Modifica el orden de cualquier objeto que le pasemos */

mixPlaylistsButton.addEventListener('click', function(){
    
    /** notificamos al usuario que hemos mezclado las playlist */
    smallModal.open();
    smallModal.setContent("The Playlist is mixed");
    
    /** inizializamos la playlist que usaremos para exportarla a nuestro perfil */    
    tracksToPlaylist = [];
    
    /** mezclamos las dos listas y le aplicamos el random */
    
    itemsToPlaylist = arrayRandom(arrayMixOne.concat(arrayMixTwo));
    
    /** Generamos la lista de trakc que luego exportaremos a nuestro perfil */
    
    itemsToPlaylist.forEach(function dataPlaylist(value, index){
        tracksToPlaylist.push(value.uri);
    });
    
    /** Añadimos la lista final al contendor de la playlist a exportar, y la guardamos en localstorage */  
    
    addPlaylist(itemsToPlaylist, false);
    window.localStorage.setItem('playListStorage', JSON.stringify(itemsToPlaylist));
    listName.removeAttribute("disabled");
    
});


/** Creamos el modal para cambiar el usuario */

var modalUser = new tingle.modal({
    closeMethods: [],
    footer: true,
    stickyFooter: true
}); 

modalUser.addFooterBtn('Change user', 'c-button tingle-btn btn-change-user disabled', function(){
    printUserPlaylists(areaMixChange, userNameValue);
    changeUserButton.classList.add("disabled");
    modalUser.close();
}); 

modalUser.addFooterBtn('Select my user', 'c-button tingle-btn', function(){
    printUserPlaylists(areaMixChange);  
    changeUserButton.classList.add("disabled");
    modalUser.close();
}); 

modalUser.addFooterBtn('Close', 'c-button tingle-btn', function(){
    changeUserButton.classList.add("disabled");
    modalUser.close();
});

    
  
/** Creamos el Evento para levantar el modal de cambio de usuario */

var changeUserButtonOne = document.getElementById('changeUserButtonOne'),
    changeUserButtonTwo = document.getElementById('changeUserButtonTwo'),
    modalUserContent = document.querySelector('.tingle-user-content').innerHTML,
    changeUserButton = document.querySelector('.btn-change-user'),
    userNameValue;
    
changeUserButtonOne.addEventListener('click', function(){
    changeUser(this.getAttribute('data-area'));
});

changeUserButtonTwo.addEventListener('click', function(){
    changeUser(this.getAttribute('data-area'));
});


var areaMixChange;
function changeUser(areaMix){
    
    areaMixChange = areaMix;
    
    modalUser.setContent(modalUserContent);
    modalUser.open();
    
    document.querySelector('.tingle-modal .change-user-input').addEventListener("keyup", function(event){
        userNameValue = this.value;
        
        if (this.value != 0) {
            changeUserButton.classList.remove("disabled");
            if (event.which == 13 || event.keyCode == 13) {
               printUserPlaylists(areaMixChange, userNameValue); 
               changeUserButton.classList.add("disabled");
               modalUser.close();
            }
        } else {
            changeUserButton.classList.add("disabled");
        }
    });
}








