var express = require('express'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    methodOverride = require('method-override'),
    session = require('express-session'),
    passport = require('passport'),
    pug = require('pug'),
    SpotifyWebApi = require('spotify-web-api-node'),
    SpotifyStrategy = require('passport-spotify').Strategy,
    router = express.Router(),
    path = require('path'),
    http = require('http'),
    _ = require('lodash'),
    config = require('./config');
    
var tokens = {};
var appKey = config.spotify.clientID;
var appSecret = config.spotify.clientSecret;    

var spotifyApi = new SpotifyWebApi({
  clientId : appKey,
  clientSecret : appSecret,
  redirectUri : config.spotify.callbackURI
});


 
/**
 * Passport session setup.
 * @function
 */
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});


/**
 * Use the SpotifyStrategy within Passport.
 * @description Strategies in Passport require a `verify` function, which accept credentials
 * (in this case, an accessToken, refreshToken, and spotify profile), and invoke a callback with a user object.
 * @function
 */
passport.use(new SpotifyStrategy({
  clientID: appKey,
  clientSecret: appSecret,
  callbackURL: config.spotify.callbackURI
  },
  function(accessToken, refreshToken, profile, done) {
    tokens[profile.id] = accessToken;
    spotifyApi.setAccessToken(accessToken);
    // console.log("accesstoken", accessToken);
    var authorizeURL = spotifyApi.createAuthorizeURL(['playlist-modify', 'user-library-modify', 'playlist-read', 'playlist-modify-public', 'playlist-modify-private'], "prueba");
    // console.log(authorizeURL);
    process.nextTick(function () {
      return done(null, profile);
      
    });
  }));


var app = express();

/**
 * Configure Express
 * @function
 */
app.set('views', __dirname + '/src/views');
app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.locals.pretty = true // indent produces HTML for clarity

app.use(router);  
app.use(express.static(path.join(__dirname, '/public')));

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(cookieParser());
app.use(bodyParser());
app.use(methodOverride());
app.use(session({ secret: 'keyboard cat' }));


/**
 * Inicialización de passport
 * @description Initialize Passport!  Also use passport.session() middleware, to support persistent login sessions (recommended).
 * @function
 */

app.use(passport.initialize());
app.use(passport.session());


/**
 * Router
 * @description Express para las rutas de la aplicación
 * @function
 */
 
app.get('/', function(req, res){
  res.render('login.pug', { user: req.user });
});

app.get('/account', ensureAuthenticated, function(req, res){
  res.render('account.html', { user: req.user });
});

app.get('/login', function(req, res){
  res.render('login', { user: req.user});
});

app.get('/create', function(req, res){
  res.render('create.pug', { user: req.user.displayName, hasData : false, tracks : 17 });
});

app.get('/mix', function(req, res){
  res.render('mix.pug', { user: req.user.displayName, hasData : false, tracks : 17 });
});



/**
 * Autentificación de spotify
 * @description Use passport.authenticate() as route middleware to authenticate the request. 
 * The first step in spotify authentication will involve redirecting the user to spotify.com. 
 * After authorization, spotify will redirect the user back to this application at /auth/spotify/callback
 * @function
 */
 
app.get('/auth/spotify',
  passport.authenticate('spotify', {scope: ['playlist-modify', 'user-library-modify', 'playlist-read', 'playlist-modify-public', 'playlist-modify-private'], showDialog: true}),
  function(req, res){
  // The request will be redirected to spotify for authentication, so this
  // function will not be called.
});


/**
 * Callback de la autentificación de spotify
 * @description Use passport.authenticate() as route middleware to authenticate the request. 
 * If authentication fails, the user will be redirected back to the login page. Otherwise, the primary route function
 * function will be called, which, in this example, will redirect the user to the home page.
 * @function
 */
 
app.get('/callback',
  passport.authenticate('spotify', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/create');
  });


app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

app.listen(process.env.PORT || 3000);


/**
 * Simple route middleware to ensure user is authenticated.
 * @description Use this route middleware on any resource that needs to be protected.
 * If the request is authenticated (typically via a persistent login session),
 * the request will proceed. Otherwise, the user will be redirected to the login page.
 * @function
 */
 
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/');
}


/**
 * Función para buscar los temas y devolver los datos.
 * @param {string} track - la cadena de texto de la busqueda,
 * @param {number} offsetItems - el offset de la busqueda, para seguir devolviendo items nuevos.
 * @param {string} searchType - el tipo de busqueda para realizar un tipo de busqueda o otra.
 * @param {function} cb - Callback para el uso de los datos devueltos.
 * @function
 */
     
function searchTrack(track, offsetItems, searchType, cb) {

  spotifyApi.clientCredentialsGrant()
    .then(function(data) {
      spotifyApi.setAccessToken(data.body['access_token']);
      return spotifyApi.searchTracks(searchType + ':' + track, { limit: 8, offset: offsetItems })

      
    }).then(function(data) {

      cb(data.body);
      spotifyApi.setRefreshToken(data.body['refresh_token']);
      
  
    }).catch(function(err) {
      console.log('Unfortunately, something has gone wrong.', err.message);
    }); 
};


/**
 * Función para buscar top tracks de artistaas
 * @param {string} id - el id del artista,
 * @param {string} market - El pais de la busqueda de top.
 * @param {number} offsetItems - el offset de la busqueda, para seguir devolviendo items nuevos.
 * @param {function} cb - Callback para el uso de los datos devueltos.
 * @function
 */
function searchTopTracks(id, market, offsetItems, cb) {
 
  spotifyApi.clientCredentialsGrant()
    .then(function(data) {
      spotifyApi.setAccessToken(data.body['access_token']);
      return spotifyApi.getArtistTopTracks(id, market);
      
    }).then(function(data) {

      cb(data.body);
      spotifyApi.setRefreshToken(data.body['refresh_token']);
      
  
    }).catch(function(err) {
      console.log('Unfortunately, something has gone wrong.', err.message);
    }); 
}



/**
 * Funcion para recibir los datos desde el front y realizar las busquedas a la API
 * @function
 */
 
app.get('/apiSearch/:data', function (req, res) {
  
    var searchTypeString = req.param('searchType');
    var keyword = req.param('keyword');
    var offset = req.param('offset');
    
    if (searchTypeString === "top-tracks") {
      
      // busqueda top artist tracks
      searchTrack(keyword, offset, "artist", function(data){
        
        var items = data.tracks.items;
        var searchName = _.find(items, function(o){
          
          var name = (o.album.artists[0].name).toUpperCase();
          if (name.indexOf(keyword.toUpperCase()) > -1){
            return name
          };
          
        });
        
        if (searchName != null && typeof searchName === 'object'){
          
          var idArtist = searchName.album.artists[0].id;
          
          searchTopTracks(idArtist, "ES", offset, function(data){
            
            // console.log(data);
            var items = data.tracks;
            var itemTrack = [];
            
            for (var track in items){
              
              itemTrack.push({
                artist : items[track].artists[0].name,
                name : items[track].name,
                link : items[track].href,
                album : items[track].album.name,
                imageAlbum : items[track].album.images[0].url,
                previewUrl: items[track].preview_url,
                URITrack: items[track].uri,
                id : items[track].id
              });
        
            };
          
            var dataReturn = {
              items: itemTrack
            };
            res.json(JSON.stringify(dataReturn));
          });
          
          
        } else {
          var dataReturn = {
            items: []
          };
          res.json(JSON.stringify(dataReturn));
        };

      });
      
    
    
    } else {
      
      // busqueda de tracks estandar y de artistas
      searchTrack(keyword, offset, searchTypeString, function(data){
        
        var items = data.tracks.items;
        var itemTrack = [];
        
        for (var track in items){
          
          itemTrack.push({
            artist : items[track].artists[0].name,
            name : items[track].name,
            link : items[track].href,
            album : items[track].album.name,
            imageAlbum : items[track].album.images[0].url,
            previewUrl: items[track].preview_url,
            URITrack: items[track].uri,
            id : items[track].id
          });
    
        };
      
        var dataReturn = {
          items: itemTrack
        };
  
        res.json(JSON.stringify(dataReturn));
    
      });
    
    }
});



/**
 * Funcion para crear la playlist en el usuario con los datos recibidos
 * @function
 */ 
app.post('/playlist', function (req, res) {

    var data = req.body;
    var playlistName = data.name;
    var tracksToAdd = data.tracksToAdd;

    spotifyApi.setAccessToken(tokens[req.user.id]);
    spotifyApi.createPlaylist(req.user.id, data.name, { 'public' : false })
    
    .then(function(data){
      var playlistId = data.body.id;
      spotifyApi.addTracksToPlaylist(req.user.id, playlistId, tracksToAdd);

    })
    .then(function(data) {
      console.log('Created playlist!');

    }, function(err) {
      console.log('Something went wrong!', err);
    });
  
  
});





/**
 * Funcion para obtener las playlist del usuario
 * @param {string} userId - el id del usuario,
 * @param {function} cb - Callback para el uso de los datos devueltos.
 * @function
 */
function getUserPlaylists(userId, cb) {
 
  spotifyApi.clientCredentialsGrant()
    .then(function(data) {
      spotifyApi.setAccessToken(data.body['access_token']);
      return spotifyApi.getUserPlaylists(userId);
      
    }).then(function(data) {
      cb(data.body);
      spotifyApi.setRefreshToken(data.body['refresh_token']);
  
    }).catch(function(err) {
      cb(err)
      console.log('Unfortunately, something has gone wrong.', err.message);
    }); 
};


/**
 * Funcion para recibir los datos desde el front y realizar las busquedas a la API
 * @function
 */
 
app.get('/apiPlaylists/:dataPlaylists', function (req, res) {

  var userProfile = req.user.id;
  var userID = req.param('user');
  var userName = req.user.displayName;
  var user;
  
  if (userID === 'myUser'){
    user = userProfile
  } else {
    user = userID
  }
  
  getUserPlaylists(user, function(data){
    
    var items= data.items;
    var playlists = [];
    
    for (var playlistNumber in items){
      playlists.push({
        name: items[playlistNumber].name,
        id: items[playlistNumber].id,
        ownerId: items[playlistNumber].owner.id
      });
    };
      
      var dataReturn = {
        items: playlists,
        userName: userName
      };

    res.json(JSON.stringify(dataReturn));
    
  });
  
  
});




/**
 * Funcion para obtener las canciones de una playlist
 * @param {string} playlistId - el id de la playlist,
 * @param {function} cb - Callback para el uso de los datos devueltos.
 * @function
 */
function getPlaylistsTracks(userId, playlistId, cb) {
 
  spotifyApi.clientCredentialsGrant()
    .then(function(data) {
      spotifyApi.setAccessToken(data.body['access_token']);
      return  spotifyApi.getPlaylist(userId, playlistId);
      
    }).then(function(data) {
      cb(data.body);
      spotifyApi.setRefreshToken(data.body['refresh_token']);
  
    }).catch(function(err) {
      console.log('Unfortunately, something has gone wrong.', err.message);
    }); 
};



app.get('/apiListsTracks/:datatracks', function (req, res) {

  // var userProfile = req.user.id;
  // console.log(req.param('user'));
  var playlistId = req.param('id');
  var ownerId = req.param('user');
  
  
  getPlaylistsTracks(ownerId, playlistId, function(data){
    
    
    var temas = data.tracks.items;
    var tracks = [];
    
    for ( var trackNumber in temas) {
      
      tracks.push({
        artist : temas[trackNumber].track.artists[0].name,
        name : temas[trackNumber].track.name,
        album : temas[trackNumber].track.album.name,
        previewURL : temas[trackNumber].track.preview_url,
        number : temas[trackNumber].track.track_number,
        id : temas[trackNumber].track.id,
        uri : temas[trackNumber].track.uri,
        imageAlbum : temas[trackNumber].track.album.images[0].url
      });  
      

    }
    
      var dataReturn = {
        items: tracks
      };
      
      res.json(JSON.stringify(dataReturn));
      
  });  
  
});
