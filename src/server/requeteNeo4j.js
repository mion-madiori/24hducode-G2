const neo4j = require('neo4j-driver').v1

function createConnexion() {
  const driver = neo4j.driver("bolt://localhost", neo4j.auth.basic("neo4j", "test"))
  return driver;
}
  
function closeConnexion(driver) {
  driver.close()
}
  
exports.getRecruteur = function(nbPersonne, res) {
  let driver = createConnexion()
  let session = driver.session()

  let request = 'match (p:personne)-[r:EST_AMI_AVEC*0..2]-() with p as p1, count(r) as cnt where cnt = '+ nbPersonne +' return p1, cnt'

  session
  .run(request)
  .then(function (result) {
    result.records.forEach(function (record) {
      res(record.get('p1').properties)
    });
  session.close()
  closeConnexion(driver)
  })
  .catch(function (error) {
    console.log(error)
  }); 
}

exports.getPays = function(res) {
  let driver = createConnexion()
  let session = driver.session()

  let request = 'MATCH (n:pays) RETURN n'

  session
  .run(request)
  .then(function (result) {
    let resultat = []
    result.records.forEach(function (record) {
      resultat.push(record.get('n').properties)
    });
  res(resultat)
  session.close()
  closeConnexion(driver)
  })
  .catch(function (error) {
    console.log(error)
  }); 
}


exports.getPersonVille = function(pays, res) {
  let driver = createConnexion()
  let session = driver.session()

  let request = 'MATCH (p:personne)-[:HABITE]->(v:ville), (v)-[:VILLE_DANS]->(pa:pays) where pa.nom = "'+ pays +'" '+
  'WITH p, v, {nom: p.nom, prenom: p.prenom, ville: v.nom, pays: pa.nom} as x '+
  'match (p:personne)-[:EST_INFLUENT]->(di1:domaine_influence) '+
  'match (p:personne)--()-[:EST_INFLUENT]->(di2:domaine_influence) '+
  'WITH (count(di1) + count(di2)) as totalInfluence, x '+
  'RETURN x '+
  'ORDER BY totalInfluence ASC '+
  'LIMIT 10'

  session
  .run(request)
  .then(function (result) {
    let resultat = {}
    result.records.forEach(function (record) {
      const pers = record.get('x')
      if (!(pers.ville in resultat)) {
        resultat[pers.ville] = []
      }
      resultat[pers.ville].push({
        nom: pers.nom,
        prenom: pers.prenom,
        label: pers.nom + ' ' + pers.prenom
      })
    });
  res(resultat)
  session.close()
  closeConnexion(driver)
  })
  .catch(function (error) {
    console.log(error)
  }); 
}
  
exports.getDetailPersonne = function(nom, prenom, res) {
  let driver = createConnexion()
  let session = driver.session()

  let request = 'Match (p:personne {nom: "' + nom +'", prenom: "'+ prenom +'"})-[r:EST_AMI_AVEC]->(n:personne) '+
  'Match (p:personne {nom: "' + nom +'", prenom: "'+ prenom +'"})-[r3:HABITE]->(v:ville) '+
  'OPTIONAL Match (p:personne {nom: "' + nom +'", prenom: "'+ prenom +'"})-[r1:A_TRAVAILLE_A]->(e:entreprise) '+
  'OPTIONAL Match (p:personne {nom: "' + nom +'", prenom: "'+ prenom +'"})-[r2:EST_ALLE_A]->(ec:ecole) '+
  'with collect(n.nom+\' \'+n.prenom) as ne, e, ec, v, p '+
  'with collect(e.nom) as en, ne, ec, v, p '+
  'with collect(ec.nom) as eco, ne, en, v, p '+
  'with collect(v.nom) as villes, eco, ne, en, p '+
  'with {personnes: ne, entreprises: en, ecoles: eco, villes: villes, label: p.nom+\' \'+p.prenom } as x '+
  'return x'

  session
  .run(request)
  .then(function (result) {
    let resultat = []
    result.records.forEach(function (record) {
      resultat.push(record.get('x'))
    });
  res(resultat)
  session.close()
  closeConnexion(driver)
  })
  .catch(function (error) {
    console.log(error)
  }); 
}


