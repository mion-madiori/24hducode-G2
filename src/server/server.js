const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const port = 3000

const reqneo4j = require('./requeteNeo4j')

app.use(bodyParser.json())

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, token, Accept");
  next();
});


app.options('/*', function (request, response, next) {
  response.header("Access-Control-Allow-Methods", "GET, POST");
  response.send();
});


// app.get('/', (request, response) => {
//   response.send('Hello from Express!')
// })

// app.get('/testGet', (req, res) => {
//   res.send('ca marche')
// })

app.get('/getPays', (req, res) => {
  reqneo4j.getPays((result) => {
    res.json({
      result
    })
  })
})

app.post('/getPersonVille', (req, res) => {
  const pays = req.body.pays
  reqneo4j.getPersonVille(pays, (result) => {
    res.json({
      result
    })
  })
})

app.post('/getPersonRank', (req, res) => {
  const nb = req.body.nb
  reqneo4j.getRecruteur(nb, (result) => {
    res.json({
      result
    })
  })
})

app.post('/getDetailPersonne', (req, res) => {
  const nom = req.body.nom
  const prenom = req.body.prenom
  reqneo4j.getDetailPersonne(nom, prenom, (result) => {
    res.json({
      result
    })
  })
})

app.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log(`server is listening on ${port}`)
})

