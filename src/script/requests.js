[

    "LOAD CSV WITH HEADERS FROM 'file:///domaine_influence.csv' AS line CREATE (d:Domaine_influence { id:toInteger(line.id), libelle: line.libelle});"
    
    ,"CREATE CONSTRAINT ON (d:Domaine_influence) ASSERT d.id IS UNIQUE;"
    
    ,"LOAD CSV WITH HEADERS FROM 'file:///ecole.csv' AS line CREATE (e:Ecole { id:toInteger(line.id), nom: line.nom});"
    
    ,"CREATE CONSTRAINT ON (e:Ecole) ASSERT e.id IS UNIQUE;"
    
    ,"LOAD CSV WITH HEADERS FROM 'file:///ecole_influence.csv' AS line MATCH (d:Domaine_influence {id:toInteger(line.influence_id)}), (e:Ecole {id:toInteger(line.ecole_id)}) MERGE (e)-[:INFLUENCE]->(d);"
    
    ,"LOAD CSV WITH HEADERS FROM 'file:///entreprise.csv' AS line CREATE (e:Entreprise { id:toInteger(line.id), nom: line.nom});"
    
    ,"CREATE CONSTRAINT ON (e:Entreprise) ASSERT e.id IS UNIQUE;"
    
    ,"LOAD CSV WITH HEADERS FROM 'file:///entreprise_influence.csv' AS line MATCH (d:Domaine_influence {id:toInteger(line.influence_id)}), (e:Entreprise {id:toInteger(line.entreprise_id)}) MERGE (e)-[:influence]->(d);"
    
    ,"LOAD CSV WITH HEADERS FROM 'file:///ville.csv' AS line CREATE (ville:Ville { id: toInteger(line.id), nom: line.nom, pays:line.pays });"
    
    ,"CREATE CONSTRAINT ON (v:Ville) ASSERT v.id IS UNIQUE;"
    
    ,"LOAD CSV WITH HEADERS FROM 'file:///personne.csv' AS line CREATE (p:Personn { id: toInteger(line.id), nom: line.nom, prenom:line.prenom });"
    
    ,"CREATE CONSTRAINT ON (p:Personn) ASSERT p.id IS UNIQUE;"
    
    ,"LOAD CSV WITH HEADERS FROM 'file:///personne.csv' AS line MATCH (person:Personn {id: toInteger(line.id)}),(ville:Ville {id: toInteger(line.ville_id)}) MERGE (person)-[:habite]->(ville);"
    
    ,"LOAD CSV WITH HEADERS FROM 'file:///personne_ecole.csv' AS line MATCH (p:Personn {id:toInteger(line.personne_id)}), (e:Ecole {id:toInteger(line.ecole_id)}) MERGE (p)-[:personne_ecole]->(e);"
    
    ,"LOAD CSV WITH HEADERS FROM 'file:///personne_entreprise.csv' AS line MATCH (p:Personn {id:toInteger(line.personne_id)}), (e:Entreprise {id:toInteger(line.entreprise_id)}) MERGE (p)-[:personne_entreprise]->(e);"
    
    ,"LOAD CSV WITH HEADERS FROM 'file:///personne_influence.csv' AS line MATCH (p:Personn {id:toInteger(line.personne_id)}), (d:Domaine_influence {id:toInteger(line.influence_id)}) MERGE (p)-[:influence]->(d);"
    
    ,"LOAD CSV WITH HEADERS FROM 'file:///tbl_amis.csv' AS line MATCH (p1:Personn {id:toInteger(line.ami_de_id)}), (p2:Personn {id:toInteger(line.ami_id)}) MERGE (p2)-[:ami_de]->(p1);"
    
    ,"LOAD CSV WITH HEADERS FROM 'file:///tbl_dossier.csv' AS line MATCH (p1:Personn {id:toInteger(line.a_dossier_id)}), (p2:Personn {id:toInteger(line.dossier_id)}) MERGE (p1)-[:a_dossier_sur]->(p2);"
    

]