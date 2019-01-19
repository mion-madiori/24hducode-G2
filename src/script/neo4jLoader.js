const neo4j = require('neo4j-driver').v1;

require('dotenv').config();
console.log(process.env.DB_HOST);
console.log(process.env.DB_USER);
console.log(process.env.DB_PASS);

const driver = neo4j.driver(process.env.DB_HOST, neo4j.auth.basic(process.env.DB_USER, process.env.DB_PASS));
const session = driver.session();

// EXEMPLE REQ
const personName = 'Alice';
const resultPromise = session.run(
  'CREATE (a:Person {name: $name}) RETURN a',
  {name: personName}
);

resultPromise.then(result => {
  session.close();

  const singleRecord = result.records[0];
  const node = singleRecord.get(0);

  console.log(node.properties.name);

  // on application exit:
  driver.close();
});