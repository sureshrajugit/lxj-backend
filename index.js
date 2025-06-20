const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');

const app = express();
app.use(cors());
const PORT = process.env.PORT || 3000;

app.get('/api/rates', async (req, res) => {
  try {
    const { data } = await axios.get(
      'https://www.livechennai.com/gold_silverrate.asp',
      { headers: { 'User-Agent': 'Mozilla/5.0' } }
    );
    const $ = cheerio.load(data);

    let goldRates = {}, silverRate = '';

    $('table').each((tableIndex, tableElem) => {
      $(tableElem).find('tr').each((i, row) => {
        const cols = $(row).find('td');
        const label = $(cols[0]).text().trim();
        const value = $(cols[1]).text().trim();

        if (label.includes('22K')) goldRates['22K'] = value;
        if (label.includes('24K')) goldRates['24K'] = value;
        if (label.toLowerCase().includes('silver')) silverRate = value;
      });
    });

    res.json({ goldRates, silverRate });
  } catch (err) {
    res.status(500).json({ error: 'Scraping failed', details: err.message });
  }
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
