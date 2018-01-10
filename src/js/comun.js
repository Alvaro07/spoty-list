
// Globals variables

    var itemsList,
        searchWord,
        numOffset = 0;

// DOM Elements
    var searchButton = document.getElementById("searchButton"),
        searchInput = document.getElementById("searchField"),
        addMoreButton = document.getElementById('addMoreButton'),
        addMoreWrap = document.getElementById('addMoreWrap'),
        itemsSearchResults = document.getElementById("searchResults"),
        searchTypeCombo = document.getElementById("searchType");


/**
 * Función generica AJAX para las consultas
 * @param {string} url - la URL enviada al back para su consulta a la api, asi como su deviolución de datos.
 * @param {fuction} cb - Callback para el uso de los datos devueltos.
 * @function
 */
 
function peticionAJAX(url, cb) {
  var xmlHttp = new XMLHttpRequest();

  document.querySelector(".loader-content").style.display = 'flex';
  xmlHttp.onreadystatechange = function() {
    if (xmlHttp.readyState === 4) {

      if (xmlHttp.status >= 100 && xmlHttp.status <= 300) {
        var datosCrudos = JSON.parse(xmlHttp.responseText);
        cb(datosCrudos);

      } else {
         console.error("ERROR AJAX! en", url ,JSON.parse(xmlHttp.responseText));
      }
      document.querySelector(".loader-content").style.display = 'none';
    } 
  };
  xmlHttp.open("GET", url, true);
  xmlHttp.send();  
}
    
