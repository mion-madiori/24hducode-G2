var url_app = "http://10.110.6.168:3000/";

function set_left_loader_visible(value){
  var newClass = "mi-hidden";
  if (value == true){
    var newClass = "mi-show";
  }
  document.getElementById("mi-loading-overlay").className = newClass;
}

// AJout un pays
function add_city_node(nodeObject, object, nodes, edges){
  nodeObject['shape'] = 'box';
  nodeObject['size'] = '30';
  nodeObject['font'] ={ size: 32, color: '#ffffff'};

  nodes.add(nodeObject);

  // Si trouve des persons
  var persons = object;
  var i;
  var old_person_id = 0;
  var persons_links = [];

  var strId = "1" + nodeObject['id'] + "00";
  var person_offset = parseInt(strId);

  // For each person
  for (i = 0; i < persons.length; i++) {
    var person_id  = i + person_offset;
    person = persons[i];
    person['id'] = person_id;
    add_person_node(person, nodes, edges);
    // links on lie la personne à la ville
    persons_links.push({"from": nodeObject['id'], "to": person_id});
  }
  // Les liens
  edges.add(persons_links);
}

// Ajoute une ville
function add_cityr_node(object, nodes, edges){

  object['shape'] = 'box';
  object['size'] = '30';
  object['font'] ={ size: 32, color: '#ffffff'};

  nodes.add(object);

  // Si trouve des persons
  var persons = object['persons'];
  var i;
  for (i = 0; i < persons.length; i++) {
    person = persons[i];
    add_person_node(person, nodes, edges);
  }

  // Les liens
  if (object['links'] != undefined ){
    var links = object['links'];
    edges.add(links);
  }
}

// Ajouter une personne
function add_person_node(object, nodes, edges){
  // First add self
  nodes.add(object);

  // Childs
  if (object['persons'] != undefined ){
    var persons = object['persons'];

    var i;
    for (i = 0; i < persons.length; i++) {
      person = persons[i];
      add_person_node(person, nodes, edges);
    }
  }

  // Les liens
  if (object['links'] != undefined ){
    var links = object['links'];
    edges.add(links);
  }
}

function load_person(label){
  var words = label.split(' ');
  var nom = words[0];
  var prenom = words[1];
  var node = [{"nom" : nom, "prenom" : prenom}];
  update_person_profil(node);
}

function load_domaine_influence(){
  var e = document.getElementById("domaine-select");
  var nom = $("#global-current-person-nom").val();
  var prenom = $("#global-current-person-prenom").val();
  var nb = e.options[e.selectedIndex].value;

  $.ajax({
    type: "POST",
    url: url_app + "personInterest",
    // The key needs to match your method's input parameter (case-sensitive).
    data: JSON.stringify({ nom: nom, prenom: prenom, nb: nb }),
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    success: function(json){

      var nodes = new vis.DataSet();
      var edges = new vis.DataSet();

      // Domaines
      var domaines = json['result'];
      var fluxHtml = "";

      // Pour chaque entreprises
      for (var key in domaines) {
        fluxHtml += "<li><div class='mi-label'>" + domaines[key]['label'] + "</div><div class='mi-border-neon'></div></li>";
      }
      $("#liste-domaine").html(fluxHtml);
      // Fin

    },
    failure: function(errMsg) {
      alert(errMsg);
    }
  });
}

function update_person_profil(node){
  $.ajax({
    type: "POST",
    url: "http://10.110.6.168:3000/getDetailPersonne",
    // The key needs to match your method's input parameter (case-sensitive).
    data: JSON.stringify({ nom: node[0]['nom'], prenom: node[0]['prenom'] }),
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    success: function(json){

      var nodes = new vis.DataSet();
      var edges = new vis.DataSet();

      // Mettre a jour la var global de la personne actuelles
      $("#global-current-person-nom").val(node[0]['nom']);
      $("#global-current-person-prenom").val(node[0]['prenom']);

      // Show img
      $("#mi-card-node .mi-card-profil").removeClass("mi-hidden");

      // Parcours les pays
      var person = json['result'][0];

      // Entreprises
      var fluxHtml = "";
      var entreprises = person['entreprises'];

      // Pour chaque entreprises
      for (var key in entreprises) {
        fluxHtml += "<li>" + entreprises[key] + "</li>";
      }
      $("#mi-card-node #liste-entreprise").html(fluxHtml);
      //

      // Ecole
      var fluxHtml = "";
      var ecoles = person['ecoles'];

      // Pour chaque ecole
      for (var key in ecoles) {
        fluxHtml += "<li>" + ecoles[key] + "</li>";
      }
      $("#mi-card-node #liste-school").html(fluxHtml);
      //

      // Titre
      var titre = person['label'] + " (" + person['villes'][0] + ")";
      $("#person-title").html(titre);

      // Complices
      var fluxHtml = "";
      var complices = person['personnes'];

      // Pour chaque complices
      for (var key in complices) {
        fluxHtml += "<li onclick=\"load_person('"+ complices[key] +"')\">" + complices[key] + "</li>";
      }
      $("#liste-complices").html(fluxHtml);
      // Fin

    },
    failure: function(errMsg) {
      alert(errMsg);
    }
  });

}

function load_node_graph(pays_nom){

  $.ajax({
      type: "POST",
      url: "http://10.110.6.168:3000/getPersonVille",
      // The key needs to match your method's input parameter (case-sensitive).
      data: JSON.stringify({ pays: pays_nom }),
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: function(json){

       var nodes = new vis.DataSet();
       var edges = new vis.DataSet();

       // Parcours les pays
       var pays = json['result'];
       var pays_links = [];

       var i = 0;
       var old_id_city = 0;

       for (var key in pays) {
         // init extras attr
         var id_city = i;
         var current_city = pays[key];
         // Node object
         var nodeObject = {"id": id_city, "label": key, "color": "#04B404"};
         add_city_node(nodeObject, current_city, nodes, edges);
         // Add pays link
         if (old_id_city != id_city){
           pays_links.push({"from": old_id_city, "to": id_city});
         }
         // set old id pays
         old_id_city = id_city;
         i++;
       }
       // End of for, links all country
       edges.add(pays_links);

       // create a network
       var container = document.getElementById('mynetwork');

       // provide the data in the vis format
       var data = {
           nodes: nodes,
           edges: edges
       };

       var options = {};

       // initialize your network!
       var network = new vis.Network(container, data, options);

       network.on( 'click', function(properties) {
         var ids = properties.nodes;
         var clickedNodes = nodes.get(ids);
         // Si c'est une personne
         if(undefined !== clickedNodes[0]['nom']){
            update_person_profil(clickedNodes);
         }
         console.log('clicked nodes:', clickedNodes);
       });

       network.on("afterDrawing", function (ctx) {
         set_left_loader_visible(false);
        });
      },
      failure: function(errMsg) {
          alert(errMsg);
      }
  });
}
