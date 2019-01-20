const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const port = 3000

const reqneo4j = require('./requeteNeo4j')


isCacheUp = false;
if (!isCacheUp) {
  const NodeCache = require( "node-cache" );
  const myCache = new NodeCache();
}


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

app.get('/getPays', (req, res) => {

  if (checkCache('getPays', res)) {
    return;
  }

  reqneo4j.getPays((result) => {
    res.json({
      result
    })

    saveCache('getPays', {result})
  })


})

app.get('/getEntreprise', (req, res) => {
  reqneo4j.getEntreprise((result) => {
    res.json({
      result
    })
  })
})

app.get('/getEcole', (req, res) => {
  reqneo4j.getEcole((result) => {
    res.json({
      result
    })
  })
})

app.post('/getPersonVille', (req, res) => {
  const pays = req.body.pays

  if (checkCache('getPersonVille' + pays, res)) {
    return;
  }

  reqneo4j.getPersonVille(pays, (result) => {
    res.json({
      result
    })

    saveCache('getPersonVille' + pays, {result})
  })
})

app.post('/getPersonRank', (req, res) => {
  const nb = req.body.nb

  if (checkCache('getPersonRank' + nb, res)) {
    return;
  }

  reqneo4j.getRecruteur(nb, (result) => {
    res.json({
      result
    })

    saveCache('getPersonRank' + nb, {result})
  })
})

app.post('/getDetailPersonne', (req, res) => {
  const nom = req.body.nom
  const prenom = req.body.prenom

  if (checkCache('getDetailPersonne' + nom + '%' + prenom, res)) {
    return;
  }

  reqneo4j.getDetailPersonne(nom, prenom, (result) => {
    res.json({
      result
    })

    saveCache('getDetailPersonne' + nom + '%' + prenom, {result})
  })
})

app.post('/personInterest', (req, res) => {
  const nom = req.body.nom
  const prenom = req.body.prenom
  const nb = req.body.nb

  if (checkCache('personInterest' + nom + '%' + prenom + '%' + nb, res)) {
    return;
  }

  reqneo4j.getInfluences(nom, prenom, nb, (result) => {
    res.json({
      result
    })

    saveCache('personInterest' + nom + '%' + prenom + '%' + nb, {result})
  })
})

app.post('/getPersonSpe', (req, res) => {
  const pays = req.body.pays
  const entreprise = req.body.entreprise
  const ecole = req.body.ecole

  reqneo4j.getPersonSpe(pays, entreprise, ecole, (result) => {
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

function checkCache(entry, res){
  if (!isCacheUp) {
    return false;
  }
  let result = myCache.get(entry)
  if (null != result) {
    res.json(result)
    return true
  } 
  return false  
}

function saveCache(key, result) {
  if (!isCacheUp) {
    return;
  }
  myCache.set(key, result)
}