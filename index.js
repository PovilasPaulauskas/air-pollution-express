const express = require('express')
const app = express()
const port = 3000

const files = [
    './data/US_LosAngeles-LongBeach-SantaAna_Anaheim.MOD04',
    './data/US_LosAngeles-LongBeach-SantaAna_Glendora-Laurel.MOD04',
    './data/US_LosAngeles-LongBeach-SantaAna_LosAngeles-N.Mai.MOD04',
    './data/US_LosAngeles-LongBeach-SantaAna_Reseda.MOD04',
    './data/US_LosAngeles-LongBeach-SantaAna_SantaClarita.MOD04',
    './data/US_LosAngeles-LongBeach-SantaAna_SouthLongBeach.MOD04'];

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))