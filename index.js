const express = require('express');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');
const sass = require('sass');

const app = express();

app.set("view engine", "ejs");

console.log("Folder index.js: ", __dirname);
console.log("Calea fisierului index.js: ", __filename);
console.log("Folder curent de lucru: ", process.cwd());

let obGlobal = {
    obErori: {},
    obImagini: {},
    folderScss: path.join(__dirname, "resurse/scss"),
    folderCss: path.join(__dirname, "resurse/css"),
    folderBackup: path.join(__dirname, "backup")
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
    res.render("pagini/index", { ip: req.ip, imagini:obGlobal.obImagini.imagini });
});

app.get("/galerie", (req, res) => {
    res.render("pagini/galerie", { imagini:obGlobal.obImagini.imagini });
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
initImagini();

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

function initImagini(){
    var continut = fs.readFileSync(path.join(__dirname,"resurse/json/galerie.json")).toString("utf-8");

    obGlobal.obImagini = JSON.parse(continut);
    let vImagini = obGlobal.obImagini.imagini;

    let caleAbs = path.join(__dirname,obGlobal.obImagini.cale_galerie);
    let caleAbsMediu = path.join(__dirname,obGlobal.obImagini.cale_galerie, "mediu");
    if (!fs.existsSync(caleAbsMediu)) {
        fs.mkdirSync(caleAbsMediu);
    }

    for (let imag of vImagini){
        [numeFis, ext] = imag.cale_fisier.split(".");
        let caleFisAbs = path.join(caleAbs,imag.cale_fisier);
        let caleFisMediuAbs = path.join(caleAbsMediu, numeFis+".webp");
        sharp(caleFisAbs).resize(300).toFile(caleFisMediuAbs);
        imag.fisier_mediu = path.join("/", obGlobal.obImagini.cale_galerie, "mediu",numeFis+".webp" );
        imag.fisier = path.join("/", obGlobal.obImagini.cale_galerie, imag.cale_fisier );        
    }
}

app.listen(8080);

function compileazaScss(caleScss, caleCss) {
    if(!caleCss){
        let numeFisExt = path.basename(caleScss);
        let numeFis = numeFisExt.split(".")[0];
        caleCss = numeFis+".css";
    }
    
    if (!path.isAbsolute(caleScss))
        caleScss = path.join(obGlobal.folderScss, caleScss);
    if (!path.isAbsolute(caleCss))
        caleCss = path.join(obGlobal.folderCss, caleCss);
    
    let caleBackup = path.join(obGlobal.folderBackup, "resurse/css");
    if (!fs.existsSync(caleBackup)) {
        fs.mkdirSync(caleBackup,{recursive:true});
    }
    
    // la acest punct avem cai absolute in caleScss si caleCss
    let numeFisCss = path.basename(caleCss);
    if (fs.existsSync(caleCss)){
        let timestamp = Date.now();
        let numeFisCssBackup = numeFisCss.replace(".css", `_${timestamp}.css`);
        fs.copyFileSync(caleCss, path.join(obGlobal.folderBackup, "resurse/css", numeFisCssBackup));
    }
    rez = sass.compile(caleScss, {"sourceMap":true});
    fs.writeFileSync(caleCss,rez.css);
}

vFisiere = fs.readdirSync(obGlobal.folderScss);
for( let numeFis of vFisiere ){
    if (path.extname(numeFis) == ".scss"){
        compileazaScss(numeFis);
    }
}

fs.watch(obGlobal.folderScss, function(eveniment, numeFis) {
    if (eveniment == "change" || eveniment == "rename"){
        let caleCompleta = path.join(obGlobal.folderScss, numeFis);
        if (fs.existsSync(caleCompleta)){
            compileazaScss(caleCompleta);
        }
    }
})