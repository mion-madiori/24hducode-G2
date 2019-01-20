# 24hducode-G2

https://24hducode-soprasteria.slack.com/messages/CFB43B4J3/

FONCTIONNALITE

Fifche détaillé:
- lien avec personnes direct :
- lien influence
  - niveau 0 : 
  - niveau 1 :
  - niveau 2 :
  - +
  
Personnes avec villes + influence : 
"MATCH (p:personne)-[:HABITE]->(v:ville),
(v)-[:VILLE_DANS]->(pa:pays)
WITH p, v, {nom: p.nom, prenom: p.prenom, ville: v.nom, pays: pa.nom} as x
RETURN x"

Nœuds entre deux personnes données:
