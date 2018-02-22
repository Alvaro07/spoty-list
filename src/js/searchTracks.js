// Globals variables
var itemsList,
    searchWord,
    numOffset = 0;
    
var searchButton = document.getElementById("searchButton"),
    searchInput = document.getElementById("searchField"),
    addMoreButton = document.getElementById('addMoreButton'),
    itemsSearchResults = document.getElementById("searchResults"),
    searchTypeCombo = document.getElementById("searchType");
    
    
/**
 * varia el tipo de busqueda
 * @function
 */

var searchType = searchTypeCombo.options[searchTypeCombo.selectedIndex].getAttribute("data-id");
searchTypeCombo.addEventListener("change", function(){
    searchType = searchTypeCombo.options[searchTypeCombo.selectedIndex].getAttribute("data-id");
});


/**
 * Limpia tanto la variable que contiene los items de resultado, 
 * así como el contendor para dicha busqueda.
 * @function
 */

function cleanSearch(){
    itemsList = '';
    itemsSearchResults.innerHTML = itemsList;
}

/**
 * Consulta la api de spotify y devuelve un objeto con dicha busqueda
 * Si la busqueda la devuleve vacia muestra un error
 * Si ya hay items añade n más
 * @function
 */
 
function addItemsSearch(dataSearch){  
        
        
        var url = '/apiSearch/data?keyword=' + encodeURIComponent(dataSearch) + '&offset=' + numOffset + '&searchType=' + searchType;
        peticionAJAX(url, function(data){
            data = JSON.parse(data);
            
            var dataItems = data.items;

            if ( dataItems.length === 0){
                
                /**  Creamos un modal especial que controle el input del buscador, 
                que maneje su focus asi como el contenido del mismo */
                
                var modalTinyNoFooter = new tingle.modal({
                  onOpen: function() {
                      searchInput.blur()
                    },
                  beforeClose: function(){
                      this.destroy();
                      searchInput.value = '';
                  }
                });
                
                modalTinyNoFooter.open();
                modalTinyNoFooter.setContent("No matches found");
                
            } else {
                
                /**  Condicional para manejar si la busqueda viene a traves del buscador o 
                del 'add more items' que añade mas items al resultado, si la busqueda es igual, 
                añadimos items, sino borramos la busqueda antrerior para una busqueda de 0 */
                
                if ( dataSearch != searchWord ){
                    searchWord = dataSearch;
                    cleanSearch();
                } 
        
                /**  Construimos el DOM con los resultados de la busqueda */
                
                dataItems.forEach(function ShowResults(value, index) {
                    itemsList += '<li class="c-item-box">' + 
                                 '<div class="c-item-box__img">' +
                                    '<img src="' + value.imageAlbum + '">' +
                                    '<div class="actions">' +
                                        '<a title="play" class="track play-preview" data-preview="'+ value.previewUrl + '" data-id="' + value.id + '"><i class="fa fa-play"  aria-hidden="true"></i></a>' +
                                        '<a title="add track" class="anade-playlist" data-uri="' + value.URITrack + '" data-id="' + value.id + '" aria-hidden="true"><i class="fa fa-plus" ></i></a>' +
                                  '</div></div>' +
                                  '<div class="c-item-box__text">' +
                                    '<p class="title">' + value.artist + '</p>' +
                                    '<p class="subtitle">' + value.name + '</p>' +
                                  '</div></li>';
                 });
                 
                /** Pintamos el objeto */
                 
                itemsSearchResults.innerHTML = itemsList;
                
                
                /**  Comprobamos cual es el resultado de la busqueda pra que cuando
                queden menos de 8 resultados restantes deshabilitar el boton de 'add more items' */
                
                if (dataItems.length >= 8){
                    addMoreWrap.classList.remove("hide");
                
                } else if (dataItems.length < 8) {
                   addMoreWrap.classList.add("hide");
                    
                }
                 
                 
                
            }
        });
    
}

/**
 * Función para realizar la busqueda en la api de spotify, comprobamos si el campo esta vacío,
 * y si no es así realizamos la busqueda llamando a la función addItemsSearch()
 * @function
 */
 
function searchSpoty(){ 
    
    /** Comprobamos si el campo del buscador esta vacio, sino es así limpiamos 
    la busqueda anterior (si la hay) y añadimos items */
    
    if (searchInput.value != ""){
       
       cleanSearch();
       addItemsSearch(searchInput.value.trim()); 
          
    } else {
      
      /** si el campo esta vacío creamos un modal con el que quitamos el focus del
      input del buscador y mostramos un error */
      
      var modalTinyNoFooter = new tingle.modal({
          cssClass: ['modal--error-search'],
          onOpen: function() {
              searchInput.blur()
            },
          beforeClose: function(){
              this.destroy()
          }
      });
      
      modalTinyNoFooter.open();
      modalTinyNoFooter.setContent("The search is empty");
      
    }
}; 
 
 
/** Eventos para la busqueda de contenido */
 
searchInput.addEventListener("keypress", function(event){
    if (event.which == 13 || event.keyCode == 13 ) {
        searchSpoty();
    };    
});
    
searchButton.addEventListener("click", function(event){
    searchSpoty();
});
 
 
addMoreButton.addEventListener("click", function(event){
    numOffset += 8;
    addItemsSearch(searchWord);
})  


/** Eventos para los items de los resultados de la busqueda */

mainApp.addEventListener("click", function(e){
    var target = e.target;
    
    /** Comprobamos que el elemento done hacemos click contiene la clase '.anade-playlist' */
    
    if ( target.classList.contains("anade-playlist")){
        
        
        /**  Detectamos si ya esixte el tema en la playlist y creamos un array cpm todos los Uris de los tracks */
        
        var dataUrisArray = [];
        for (var uris in itemsToPlaylist){
          dataUrisArray.push(itemsToPlaylist[uris].URItrack);
        };
        
        
        /**  Comprobamos si el track ya existe en el playlist */
        
        if ( dataUrisArray.indexOf(target.getAttribute("data-uri")) != -1) {
            console.log("Ya estoy en la playlist");
                
             /** Si el tema esta ya en la playlist, se llama a un modal para 
             decidir si se quiere repetir dicho track en la playlist,
             y añadimos los botones a dicho modal*/
            
            var repeatTrack = new tingle.modal({
                closeMethods: [],
                footer: true,
                stickyFooter: true
            });
            
            repeatTrack.addFooterBtn('Add Track', 'c-button tingle-btn', function(){
                addTrack();
                repeatTrack.close();
            });
            
            repeatTrack.addFooterBtn('No', 'c-button tingle-btn', function(){
                repeatTrack.close();
            }); 
    
            repeatTrack.open();
            repeatTrack.setContent("the song is already in the playlist, are you sure you want to add it?");
            
        } else {
            
            addTrack(); /**  Si el tema no esta repetido lo añadimos */
        }
        
        
        /**
         * Creamos una función privada para añadir el tema a la lista final.
         * @function
         */        
        
        function addTrack(){
            var fatherPath = target.parentNode.parentNode.parentNode;
            
            /**  Añadimos los datos necesarios para luego exporetar la playlist */
            itemsToPlaylist.push({ 
                name : fatherPath.querySelector(".title").innerHTML,
                album: fatherPath.querySelector(".subtitle").innerHTML,
                imageAlbum: fatherPath.querySelector("img").getAttribute("src"),
                previewURL : fatherPath.querySelector(".play-preview").getAttribute("data-preview"),
                URItrack : target.getAttribute("data-uri"),
                id : target.getAttribute("data-id")
            });
            
            addPlaylist(itemsToPlaylist);
            
            /**  Añadimos la propiedad 'data-uri' a la variable tracksToPlaylist que
            luego sera lo necesario para exportar a nuestro perfil la playlist */
            
            tracksToPlaylist.push(target.getAttribute("data-uri"));
            
            /**  Guardamos la variable con los datos en el localStorage */
            
            window.localStorage.setItem('playListStorage', JSON.stringify(itemsToPlaylist));
        } 
        
        
        /** Hablitimaos el input para el nombre de la creacióon del playlist, asi como el boton si el campo tiene caractéres */
        listName.removeAttribute("disabled");
        
        /** comprobamos si tiene o no caracteres para habilitarlo */
        if (listName.value != 0) {
            createPlaylistButton.removeAttribute("disabled");
        }
        
    };
}); 
 
  


 
 
 