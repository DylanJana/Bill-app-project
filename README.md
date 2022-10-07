# Bill-app-project

#Prérequis :
- Vous devrez installez NodeJS et le gestionnaire de package npm

Pour pouvoir naviguer au sein du projet :
# La mise en place du projet :
- Vous pouvez cloner ce projet en utilisant -> git clone https://github.com/DylanJana/Bill-app-project.git 
- Lorsque le projet est cloné, vous allez devoir installer les différentes dépendances

#Pour le Back
- Utilisez la commande cd Billed-app-FR-Back-main dans votre invite de commande depuis le dossier Bill-app-project
- Lorsque vous êtes dans le dossier Billed-app-FR-Back-main, utilisé la commande npm i
- Cette commande vous a permis d'installer toute les dépendances
- Pour lancer l'API -> Utilisé la commande npm run run:dev

#Accéder à l'API :
L'api est accessible sur le port 5678 en local, c'est à dire http://localhost:5678

#Pour le Front
- Pensez à lancer le Backend en premier
- Depuis le dossier Bill-app-project utilisé la commande cd Billed-app-FR-Front-main pour accèder au dossier Front
- Lorsque vous êtes dans le dossier Front -> Utilisé la commande npm i pour installer toutes les dépendances du projet
- Vous pouvez également utilisé la commande npm install -g live-server pour pouvoir lancer l'application depuis votre CLI
- La commande live-server permettra de lancer l'application depuis votre CLI
- Accéder à l'application via l'url -> http://127.0.0.1:8080/

#Pour lancer les tests ?

Positionnez-vous dans le dossier Billed-app-FR-Front-main :
- La commande npm run test -> Va tester tous vos fichiers de tests
- La commande yarn jest src/__tests__/NomDuFichierTest.js -> Va vous permettre de tester que le fichier en question
- La commande npx jest --coverage -> Va vous permettre de découvrir le % de l'application couverte par vos tests

#Pour se connecter à l'application :
Pour les Admins :

utilisateur : admin@test.tld 
mot de passe : admin

Pour les Employés :

utilisateur : employee@test.tld
mot de passe : employee

