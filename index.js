const express = require('express')
const csv = require('csvtojson');
const https = require('https');
const app = express()
const port = process.env.PORT || 3000

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

function getHistorical(n) {
    let result = [];
    data.forEach(d => {
        let arr = [];
        for(let i = 0; i < n; i++)
            arr.push(d[d.length-(n-i)]);
        result.push(arr)
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

app.get('/historical', (req, res) => {
    if( !req.query || !req.query.n)
        return res.status(400).send('Missing N.');

    if( req.query.n <= 0 || req.query.n > 100 )
        return res.status(400).send('Bad N range. Must be 1..100');

    return res.send(getHistorical(req.query.n))
});

app.get('/stations', (req, res) => {
    if( !req.query || !req.query.latlng)
        return res.status(400).send('Missing latlng.');

    https.get(`https://api.waqi.info/map/bounds/?token=aa5209e068f86a4cae5ee4f418c36e36ca46ca6f&latlng=${req.query.latlng}`, (resp) => {
    
    let data = '';

    // A chunk of data has been recieved.
    resp.on('data', (chunk) => {
        data += chunk;
    });

    // The whole response has been received. Print out the result.
    resp.on('end', () => {
        //console.log(JSON.parse(data));
        res.send(JSON.parse(data));
    });

    }).on("error", (err) => {
        console.log("Error: " + err.message);
    });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))