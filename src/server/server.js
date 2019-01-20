const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const port = 3000

const reqneo4j = require('./requeteNeo4j')

app.use(bodyParser.json())

// app.get('/', (request, response) => {
//   response.send('Hello from Express!')
// })

// app.get('/testGet', (req, res) => {
//   res.send('ca marche')
// })

app.post('/getPersonRank', (req, res) => {
  const nb = req.body.nb
  reqneo4j.getRecruteur(nb, (result) => {
    console.log(result)
    res.json({
      result
    })
  })
})

app.post('/personInterest', (req, res) => {
  const nom = req.body.nom
  const prenom = req.body.prenom
  const nb = req.body.nb

  reqneo4j.getInfluences(nom, prenom, nb, (result) => {
    console.log(result)
    res.json({
      result
    })
  })
});

app.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log(`server is listening on ${port}`)
})

