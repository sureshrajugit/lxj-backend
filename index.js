const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;

app.get('/api/rates', async (req, res) => {
  try {
    const { data } = await axios.get('https://www.goodreturns.in/gold-rates/madurai.html');
    const $ = cheerio.load(data);
    const goldRates = {};
    let silverRate = "";

    $('table').first().find('tr').each((i, el) => {
      const cols = $(el).find('td');
      const label = $(cols[0]).text().trim();
      const value = $(cols[1]).text().trim();

      if (label.includes("22 Carat")) goldRates['22K'] = value;
      if (label.includes("24 Carat")) goldRates['24K'] = value;
    });

    $('table').eq(1).find('tr').each((i, el) => {
      const cols = $(el).find('td');
      const label = $(cols[0]).text().trim();
      const value = $(cols[1]).text().trim();

      if (label.includes("Silver")) silverRate = value;
    });

    res.json({ goldRates, silverRate });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch data', details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
