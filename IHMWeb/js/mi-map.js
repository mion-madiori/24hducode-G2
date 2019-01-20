function pays_mapper(pays_id){
  var out = "";
  // Russia
  if (pays_id == "RU"){
    out = "Russie";
  }
  // Brazil
  else if (pays_id == "BR"){
    out = "Bresil";
  }
  // Italy
  else if (pays_id == "IT"){
    out = "Italie";
  }
  // Germany
  else if (pays_id == "DE"){
    out = "Allemagne";
  }
  // Switzerland
  else if (pays_id == "CH"){
    out = "Suisse";
  }
  // United Kingdom
  else if (pays_id == "GB"){
    out = "Royaume Uni";
  }
  // Ireland
  else if (pays_id == "IE"){
    out = "Irlande";
  }
  // United States
  else if (pays_id == "US"){
    out = "Etats Unis";
  }
  // France
  else if (pays_id == "FR"){
    out = "France";
  }
  return out;
}

function back_to_map(){
  document.getElementById("mynetwork").className = "mi-hidden";
  document.getElementById("chartdiv").className = "mi-show";

  // Update title
  document.getElementById("titre-pays").innerHTML = "Carte du Monde";
}

function load_pays(pays_id){
  document.getElementById("chartdiv").className = "mi-hidden";
  document.getElementById("mynetwork").className = "mi-show";
  //
  set_left_loader_visible(true);
  // load map
  console.log(pays_id);
  var pays_nom = pays_mapper(pays_id);
  console.log(pays_nom);
  // update pays title
  document.getElementById("titre-pays").innerHTML = pays_nom;
  // load nodes from pays
  load_node_graph(pays_nom);
}


//World map
var map = AmCharts.makeChart("chartdiv", {

  "type": "map",
  "theme": "light",

  "dataProvider": {
    "map": "worldLow",
    // "getAreasFromMap": true,
    "areas": [
      { "id": "RU" },
      { "id": "BR" },
      { "id": "IT" },
      { "id": "DE" },
      { "id": "CH" },
      { "id": "GB" },
      { "id": "IE" },
      { "id": "US" },
      { "id": "FR" }
    ]
  },
  "areasSettings": {
    "autoZoom": false,
    "selectedColor": "#CC0000",
    "selectable": true
  },
  "smallMap": {}
});


map.addListener("clickMapObject", function(event) {
  var info = 'Clicked ID: ' + event.mapObject.id + ' (' + event.mapObject.title + ')';
  // alert(info);
  load_pays(event.mapObject.id);
  // document.getElementById("info").innerHTML = ;
});
