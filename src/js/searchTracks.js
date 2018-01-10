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
                                  '<img src="' + value.imageAlbum + '" data-preview="'+ value.previewUrl + '" class="cover" data-id="' + value.id + '">' +
                                  '<div class="actions">' +
                                  '<a title="play track"><i class="fa fa-play" aria-hidden="true"></i></a>' +
                                  '<a data-uri="' + value.URITrack + '" data-id="' + value.id + ' title="play track"><i class="fa fa-plus" aria-hidden="true"></i></a>' +
                                  '</div></div>' +
                                  '<div class="c-item-box__text">' +
                                  '<p class="title">' + value.name + '</p>' +
                                  '<p class="subtitle">' + value.album + '</p>' +
                                  '</div></li>';
                 });
                 
                 itemsSearchResults.innerHTML = itemsList;
                 // itemsList = '';
                 
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