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
  
  