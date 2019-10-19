const express = require('express')
const csv = require('csvtojson');
const app = express()
const port = 3000

const files = [
    './data/US_LosAngeles-LongBeach-SantaAna_Anaheim.MOD04.csv',
    './data/US_LosAngeles-LongBeach-SantaAna_Glendora-Laurel.MOD04.csv',
    './data/US_LosAngeles-LongBeach-SantaAna_LosAngeles-N.Mai.MOD04.csv',
    './data/US_LosAngeles-LongBeach-SantaAna_Reseda.MOD04.csv',
    './data/US_LosAngeles-LongBeach-SantaAna_SantaClarita.MOD04.csv',
    './data/US_LosAngeles-LongBeach-SantaAna_SouthLongBeach.MOD04.csv'];

let data = [];

startup();

async function startup() {
    await loadAllFiles();
    console.log(data);
}

async function loadAllFiles() {
    for(let i = 0; i < files.length; i++) {
        let r = await loadData(files[i]);
        data.push(r);
    }
}

function getLatest() {
    let result = [];
    data.forEach(d => {
        result.push(d[d.length-1]);
    });
    return result;
}

async function loadData(path) {
    return await csv({
        noheader: true, 
        headers: ['year','month','day','latitude','longitude','aod1','aod3','std3']
    }).fromFile(path);
}

app.get('/', (req, res) => res.send('Hello World!'))

app.get('/losAngelesSateliteLatest', (req, res) => res.send(getLatest()))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))