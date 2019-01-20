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

exports.getInfluences = function(nom, prenom, nb, res) {
  let requests;

  if (nb == 0) {
    requests = ['match (p:personne)-[:EST_INFLUENT]->(di:domaine_influence) where p.nom = "' + nom + '" AND p.prenom = "' + prenom + '" return di'
    ,'match (p:personne)--()-[:EST_INFLUENT]->(di:domaine_influence) where p.nom = "' + nom + '" AND p.prenom = "' + prenom + '" return di'  
    ,'match (p:personne)--()--()-[:EST_INFLUENT]->(di:domaine_influence) where p.nom = "' + nom + '" AND p.prenom = "' + prenom + '" return di']
  } else {
    requests = ['match (p:personne)-[r:EST_AMI_AVEC*' + nb + '..' + nb + ']-(p1:personne)-[:EST_INFLUENT]->(di:domaine_influence) where p.nom = "' + nom + '" AND p.prenom = "' + prenom + '" return p, di'
    ,'match (p:personne)--()-[r:EST_AMI_AVEC*' + nb + '..' + nb + ']-(p1:personne)-[:EST_INFLUENT]->(di:domaine_influence) where p.nom = "' + nom + '" AND p.prenom = "' + prenom + '" return p, di',
    , 'match (p:personne)--()--()-[r:EST_AMI_AVEC*' + nb + '..' + nb + ']-(p1:personne)-[:EST_INFLUENT]->(di:domaine_influence) where p.nom = "' + nom + '" AND p.prenom = "' + prenom + '" return p, di']
  }

  getInfluence(nom, prenom, requests, res);
}

function getInfluence(nom, prenom, requests, res){
  
  let call = (request, resolve, reject) => {
    let driver = createConnexion()
    let session = driver.session()
    session
    .run(request, {
      nom: nom,
      prenom: prenom,
    })
    .then(function (result) {
      console.log(result)
      console.log(result.records)
      result.records.forEach(function (record) {
        resolve(record.get('di').properties)
      });
    session.close()
    closeConnexion(driver)
    })
    .catch(function (error) {
      console.log(error)
      reject()
    });
  }

  let promises = [];
  requests.forEach(request => {
    promises.push(new Promise((resolve, reject) => {
      call(request, resolve, reject)
    }))
  });

  let promise_all = Promise.all(promises);

  promise_all.then((val)=> {
    console.log(val)
    let resultat = []
    val.forEach((x)=> {
      resultat.push({label: x.libelle})
    })
    res(resultat)
  })
  
     
}
  
  