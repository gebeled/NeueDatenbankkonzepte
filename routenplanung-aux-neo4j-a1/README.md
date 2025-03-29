# Getting started


# Erstellen Sie bitte eine eigene .env.local Datei mit folgendem Inhalt, um die Verbindung zu der Instanz der Graphdatenbank in Neo4j herstellen zu können

NEO4J_URI=neo4j+s://98103657.databases.neo4j.io
NEO4J_USERNAME=neo4j
NEO4J_PASSWORD=6XHdTu44QPJVVLbts9vLI0WNkE9tFTsTHFy9vPsqZnA



# Wenn Sie sich den Aufbau der Graphdatenbank in Neo4j anschauen möchten, melden Sie sich bitte mit folgenden Angaben bei Neo4j an
# Um Zugriff auf die Graphdatenbank zu bekommen, müssen Sie die Instanz "Instance01 Upgrade" in den "Running" Zustand bringen, dazu müssen Sie folgende Schritte durchführen:

Zuerst müssen Sie sich bei Neo4j anmelden (dazu haben wir für Sie einen Account erstellt):
Link:       https://login.neo4j.com/u/login/identifier?state=hKFo2SBRVW1PaFJ4SDV4RmFOcklTWjktcklMQ2dWcEhNMXBCNqFur3VuaXZlcnNhbC1sb2dpbqN0aWTZIEt0V2RSYXlPU3g2Ujlnc192T2pIUzd6dHZYSU80ejBpo2NpZNkgRXZ2MmNjWFBjOHVPeGV3bzBJalkyMFlJckg3VmtKVzk
Email:      neo4j.aura.testuser@web.de
Passwort:   8y-j4v5NJ6wwH4g

Es kann passieren, dass Sie bei der ersten Anmeldung einen Code eingeben müssen, dieser wird an dieselbe Email-Adresse geschickt mit der Sie sich bei Neo4j anmelden können. Dazu können Sie sich unter https://web.de/ mit der Email und demselben Passwort anmelden.

Falls die "Instance01 Upgrade" unter Instances bei Ihenen nicht angezeigt werden sollte, gehen Sie bitte in Ihr Email-Postfach unter Favoriten und Klicken Sie auf den Link in der Email, um unserem Team beizutreten und folglich Zugriff auf die "Instance01Upgrade" zu bekommen.

Verbinden Sie im nächsten Schritt diese Instanz "Instance01 Upgrade", um Sie zum Laufen zu bekommen. Navigieren Sie dazu zu "Query", klicken Sie auf den Pfeil nach unten neben "No instance connected", klicken Sie dann auf "Connect to instance" und connecten Sie die Instanz "Instance01 Upgrade". Daraufhin werden Sie aufgefordert ein Passwort einzugeben. 
NEO4J_PASSWORD=6XHdTu44QPJVVLbts9vLI0WNkE9tFTsTHFy9vPsqZnA

Die Instanz sollte jetzt aktiviert werden und verfügbar sein, sobald Sie als "RUNNING" gekennzeichent wird (dies kann 2-3 Minuten dauern).



# Anschließend kann das Projekt gestartet werden

npm i
npm run dev



# Wenn Sie sich unsere Queries in Neo4j anzeigen lassen wollen,

können Sie unter dem Reiter Query auf "Saved Cypher" gehen und die Datei "neo4j_query_saved_cypher_2025-3-29.csv" importieren. Diese haben wir Ihnen in der Abgabe per Mail mitgeschickt. 




# Viel Spaß mit userem Projekt 