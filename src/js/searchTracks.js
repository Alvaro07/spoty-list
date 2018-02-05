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
                
                
                if ( dataSearch != searchWord ){
                    searchWord = dataSearch;
                    cleanSearch();
                } 
        
                // itemsList = "";
                dataItems.forEach(function ShowResults(value, index) {
                    itemsList += '<li class="c-item-box">' + 
                                 '<div class="c-item-box__img">' +
                                    '<img src="' + value.imageAlbum + '">' +
                                    '<div class="actions">' +
                                        '<a title="play" class="track play-preview" data-preview="'+ value.previewUrl + '" data-id="' + value.id + '"><i class="fa fa-play"  aria-hidden="true"></i></a>' +
                                        '<a title="add track" class="anade-playlist" data-uri="' + value.URITrack + '" data-id="' + value.id + '" aria-hidden="true"><i class="fa fa-plus" ></i></a>' +
                                  '</div></div>' +
                                  '<div class="c-item-box__text">' +
                                    '<p class="title">' + value.name + '</p>' +
                                    '<p class="subtitle">' + value.album + '</p>' +
                                  '</div></li>';
                 });
                 
                 itemsSearchResults.innerHTML = itemsList;

                 // REFACORIZAR A UNA SOLO!!
                 if (dataItems.length != 10){
                     addMoreWrap.classList.remove("hide");
                 }
                 
                 // REFACORIZAR A UNA SOLO!!
                 if (dataItems.length < 8) {
                   addMoreWrap.classList.add("hide");
                 }
                 
            }
        });
    
}



/**
 * Añade eventos de la busqueda en spotify
 * @function
 */
 function searchSpoty(){ 
     
      if (searchInput.value != ""){
           
           cleanSearch();
           addItemsSearch(searchInput.value.trim()); 
              
      } else {
          
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
 
 
/**
 * Eventos para la busqueda de contenido
 * @function
 */
 
searchInput.addEventListener("keypress", function(event){
    if (event.which == 13 || event.keyCode == 13 ) {
        searchSpoty();
    };    
});
    
searchButton.addEventListener("click", function(event){
    searchSpoty();
});
 
 
/**
 * Evento para la busqueda de más items
 * @function
 */
addMoreButton.addEventListener("click", function(event){
    
    numOffset += 8;
    addItemsSearch(searchWord);
    
})  



/**
 * 
 * Añade item a la playlist
 * @function
 */
 mainApp.addEventListener("click", function(e){
        var target = e.target;
        
        // añadimos playlist
        if ( target.classList.contains("anade-playlist")){
            
            
            // Detectamos si ya esixte el tema en la playlist
            var dataUrisArray = [];
            for (var uris in itemsToPlaylist){
              dataUrisArray.push(itemsToPlaylist[uris].URItrack);
            };
            
            if ( dataUrisArray.indexOf(target.getAttribute("data-uri")) != -1) {
                console.log("Ya estoy en la playlist");
                    
                    
                    
                 /**
                 * Funciona para los temas repetidos, si se quieren introducir oi no
                 * @function
                 */
                 
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
                addTrack();
            }
            
            
            function addTrack(){
                var fatherPath = target.parentNode.parentNode.parentNode;
              
                itemsToPlaylist.push({ 
                    name : fatherPath.querySelector(".title").innerHTML,
                    album: fatherPath.querySelector(".subtitle").innerHTML,
                    imageAlbum: fatherPath.querySelector("img").getAttribute("src"),
                    previewURL : fatherPath.querySelector(".play-preview").getAttribute("data-preview"),
                    URItrack : target.getAttribute("data-uri"),
                    id : target.getAttribute("data-id")
                });
                console.log(itemsToPlaylist);
                
                addPlaylist(itemsToPlaylist);
                tracksToPlaylist.push(target.getAttribute("data-uri"));
                
                window.localStorage.setItem('playListStorage', JSON.stringify(itemsToPlaylist));
            } 
            
            
            // Hablitimaos el input para el nombre del playlist, asi como el boton si el campo tiene caractéres
            listName.removeAttribute("disabled");
            
            if (listName.value != 0) {
                createPlaylistButton.removeAttribute("disabled");
            }
            
            
            
        };

        
 }); 
 
  


 
 
 