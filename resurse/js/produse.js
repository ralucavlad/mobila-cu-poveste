window.addEventListener('load', function () {
    document.getElementById('pretMin').addEventListener('input', function() {
        document.getElementById('pretMinVal').textContent = this.value;
    });
    document.getElementById('pretMax').addEventListener('input', function() {
        document.getElementById('pretMaxVal').textContent = this.value;
    });

    function validateInputs() {
        let numeProdus = document.getElementById('numeProdus').value.trim();
        let descriere = document.getElementById('descriere').value.trim();
        let valid = true;

        if (numeProdus && !isNaN(numeProdus)) {
            document.getElementById('numeProdus').classList.add('is-invalid');
            valid = false;
        } else {
            document.getElementById('numeProdus').classList.remove('is-invalid');
        }

        if (descriere && descriere.length < 10) {
            document.getElementById('descriere').classList.add('is-invalid');
            document.querySelector('label[for="descriere"]').classList.add('is-invalid');
            valid = false;
        } else {
            document.getElementById('descriere').classList.remove('is-invalid');
            document.querySelector('label[for="descriere"]').classList.remove('is-invalid');
        }

        return valid;
    }

    document.getElementById('descriere').addEventListener('input', function() {
        if (this.value.trim().length >= 10) {
            this.classList.remove('is-invalid');
            document.querySelector('label[for="descriere"]').classList.remove('is-invalid');
        }
    });

    document.getElementById('filtreaza').addEventListener('click', function() {
        if (!validateInputs()) {
            alert('Verificati valorile introduse in campurile de text si textarea.');
            return;
        }

        let numeProdus = document.getElementById('numeProdus').value.toLowerCase().trim();
        let pretMin = document.getElementById('pretMin').value;
        let pretMax = document.getElementById('pretMax').value;
        let material = document.getElementById('material').value;
        let categorie = document.getElementById('categorie').value;
        let inaltime = document.querySelector('input[name="inaltime"]:checked').value;
        let materiale = Array.from(document.getElementById('materiale').selectedOptions).map(option => option.value);
        let reducere = document.getElementById('reducere').checked;
        let descriere = document.getElementById('descriere').value.trim();

        let produse = document.querySelectorAll('.produs');
        let sumaPreturi = 0;
        produse.forEach(function(produs) {
            let id = produs.id.replace('art', '');
            let nume = produs.querySelector('h3 span')?.textContent.toLowerCase() || '';
            let pret = parseFloat(produs.querySelector(`#pret-${id}`)?.textContent || 0);
            let prodMaterial = produs.querySelector(`#material-${id}`)?.textContent || '';
            let prodCategorie = produs.querySelector('p:nth-child(2) span')?.textContent || '';
            let prodInaltime = parseInt(produs.querySelector(`#inaltime-${id}`)?.textContent || 0);
            let prodMateriale = produs.querySelector(`#toate-materialele-${id}`)?.textContent.split(', ') || [];
            let prodReducere = produs.querySelector(`#reducere-${id}`)?.textContent.trim() === 'Da';
            let prodDescriere = produs.querySelector('p:nth-child(3) span')?.textContent.trim() || '';

            let matchNume = !numeProdus || nume.startsWith(numeProdus);
            let matchPret = pret >= pretMin && pret <= pretMax;
            let matchMaterial = !material || prodMaterial === material;
            let matchCategorie = !categorie || prodCategorie === categorie;
            let matchInaltime = inaltime === 'oricare' || 
                                (inaltime.includes(':') && 
                                 prodInaltime >= parseInt(inaltime.split(':')[0]) && 
                                 prodInaltime <= parseInt(inaltime.split(':')[1])) || 
                                (inaltime === '100' && prodInaltime === 100);
            let matchMateriale = !materiale.length || materiale.every(mat => prodMateriale.includes(mat));
            let matchReducere = !reducere || prodReducere;
            let matchDescriere = !descriere || prodDescriere.startsWith(descriere);

            if (matchNume && matchPret && matchMaterial && matchCategorie && matchInaltime && matchMateriale && matchReducere && matchDescriere) {
                produs.style.display = 'block';
                sumaPreturi += pret;
            } else {
                produs.style.display = 'none';
            }
        });

        let divSumaPreturi = document.getElementById('sumaPreturi');
        if (!divSumaPreturi) {
            divSumaPreturi = document.createElement('div');
            divSumaPreturi.id = 'sumaPreturi';
            divSumaPreturi.className = 'mt-3';
            document.querySelector('#filtre .col-md-12').appendChild(divSumaPreturi);
        }
        divSumaPreturi.textContent = `Suma preturilor produselor afisate: ${sumaPreturi} RON`;
    });

    document.getElementById('sortAsc').addEventListener('click', function() {
        if (!validateInputs()) {
            alert('Verificati valorile introduse in campurile de text si textarea.');
            return;
        }
        sortProduse(1);
    });

    document.getElementById('sortDesc').addEventListener('click', function() {
        if (!validateInputs()) {
            alert('Verificati valorile introduse in campurile de text si textarea.');
            return;
        }
        sortProduse(-1);
    });

    document.getElementById('reseteaza').addEventListener('click', function() {
        document.getElementById('numeProdus').value = '';
        document.getElementById('pretMin').value = 0;
        document.getElementById('pretMax').value = 5000;
        document.getElementById('pretMinVal').textContent = 0;
        document.getElementById('pretMaxVal').textContent = 5000;
        document.getElementById('material').value = '';
        document.getElementById('categorie').value = '';
        document.querySelector('input[name="inaltime"][value="oricare"]').checked = true;
        document.getElementById('materiale').selectedIndex = -1;
        document.getElementById('reducere').checked = false;
        document.getElementById('descriere').value = '';

        let produse = document.querySelectorAll('.produs');
        produse.forEach(function(produs) {
            produs.style.display = 'block';
        });

        let divSumaPreturi = document.getElementById('sumaPreturi');
        if (divSumaPreturi) {
            divSumaPreturi.textContent = '';
        }
    });

    document.getElementById('calculeaza').addEventListener('click', function() {
        if (!validateInputs()) {
            alert('Verificati valorile introduse in campurile de text si textarea.');
            return;
        }

        let produse = document.querySelectorAll('.produs');
        let sumaPreturi = 0;
        produse.forEach(function(produs) {
            if (produs.style.display !== 'none') {
                let id = produs.id.replace('art', '');
                let pret = parseFloat(produs.querySelector(`#pret-${id}`)?.textContent || 0);
                sumaPreturi += pret;
            }
        });

        let div = document.createElement('div');
        div.style.position = 'fixed';
        div.style.top = '10px';
        div.style.right = '10px';
        div.style.backgroundColor = 'white';
        div.style.border = '1px solid black';
        div.style.padding = '10px';
        div.innerText = `Suma preturilor produselor afisate: ${sumaPreturi} RON`;
        document.body.appendChild(div);
        setTimeout(() => {
            div.remove();
        }, 2000);
    });

    function sortProduse(semn) {
        let produse = Array.from(document.querySelectorAll('.produs'));
        produse.sort(function(a, b) {
            let idA = a.id.replace('art', '');
            let idB = b.id.replace('art', '');
            let pretA = parseFloat(a.querySelector(`#pret-${idA}`)?.textContent || 0);
            let pretB = parseFloat(b.querySelector(`#pret-${idB}`)?.textContent || 0);
            let numeA = a.querySelector('h3 span')?.textContent.toLowerCase() || '';
            let numeB = b.querySelector('h3 span')?.textContent.toLowerCase() || '';

            if (pretA < pretB) return -1 * semn;
            if (pretA > pretB) return 1 * semn;
            if (numeA < numeB) return -1 * semn;
            if (numeA > numeB) return 1 * semn;
            return 0;
        });

        let container = document.querySelector('#produse .row');
        produse.forEach(function(produs) {
            container.appendChild(produs);
        });
    }
});