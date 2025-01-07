const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();

app.set("view engine", "ejs");

console.log("Folder index.js: ", __dirname);
console.log("Calea fisierului index.js: ", __filename);
console.log("Folder curent de lucru: ", process.cwd());

let obGlobal = {
    obErori: {}
}

let vectorFoldere = ["temp", "poze-uploadate", "backup"];
for (let folder of vectorFoldere) {
    let folderCaleAbsoluta = path.join(__dirname, folder);
    if (!fs.existsSync(folderCaleAbsoluta)) {
        fs.mkdirSync(folderCaleAbsoluta);
    }
}

app.use("/resurse", express.static(path.join(__dirname, "resurse")));

app.get("/favicon.ico", (_req, res) => {
    res.sendFile(path.join(__dirname, "resurse/imagini/ico/favicon.ico"));
});

app.get(["/","/index","/home"], (req, res) => {
    res.render("pagini/index", { ip: req.ip });
});

app.get(/^\/resurse\/[a-z0-9A-Z\/]*$/, (_req, res) => {
    afisareEroare(res, 403);
});

app.get("/*.ejs", (_req, res) => {
    afisareEroare(res, 400);
});

app.get("/*", (req, res) => {
    try {
        res.render("pagini"+req.url, function(err, rezRandare){
            if (err) {
                if (err.message.startsWith("Failed to lookup view")) {
                    afisareEroare(res, 404, "Pagina negasita", "Verificati calea URL-ului");
                } else {
                    afisareEroare(res, -1);
                }
            } else {
                res.send(rezRandare);
            }
        });
    } catch (err1) {
        if (err1.message.startsWith("Cannot find module")) {
            afisareEroare(res, 404, "Pagina negasita", "Verificati calea URL-ului");
        } else {
            afisareEroare(res, -1);
        }
    }
});

initErori();

function initErori() {
    let continut = fs.readFileSync(path.join(__dirname, "resurse/json/erori.json")).toString("utf-8");
    obGlobal.obErori = JSON.parse(continut);
    obGlobal.obErori.eroare_default.imagine = path.join(obGlobal.obErori.cale_baza, obGlobal.obErori.eroare_default.imagine);

    for (let eroare of obGlobal.obErori.info_erori) {
        eroare.imagine = path.join(obGlobal.obErori.cale_baza, eroare.imagine);
    }
}

function afisareEroare(res, identificator, titlu, text, imagine) {
    let eroare = obGlobal.obErori.info_erori.find(function(elem){
        return elem.identificator == identificator;
    });

    if (eroare) {
        if (eroare.status) {
            res.status(identificator);
        }
        res.render("pagini/eroare", {
            titlu: titlu || eroare.titlu,
            text: text || eroare.text,
            imagine: imagine || eroare.imagine
        });
    } else {
        res.render("pagini/eroare", {
            titlu: titlu || obGlobal.obErori.eroare_default.titlu,
            text: text || obGlobal.obErori.eroare_default.text,
            imagine: imagine || obGlobal.obErori.eroare_default.imagine
        });
    }
}

app.listen(8080);