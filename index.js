const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');

const app = express();
app.use(cors());
const PORT = process.env.PORT || 3000;

app.get('/api/rates', async (req, res) => {
  try {
    const { data } = await axios.get('https://www.livechennai.com/gold_silverrate.asp', {
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    });

    const $ = cheerio.load(data);
    const row = $('table.today-gold-rate tbody tr').first();

    const date = row.find('td').eq(0).text().trim();
    const gold22KRaw = row.find('td').eq(1).text().trim();
    const silverRaw = row.find('td').eq(2).text().trim();

    const gold22K = gold22KRaw.replace(/[^0-9.,]/g, '').split('(')[0].trim();
    const silver = silverRaw.replace(/[^0-9.,]/g, '').split('(')[0].trim();

    res.json({
      date,
      goldRates: { '22K': gold22K },
      silverRate: silver
    });
  } catch (err) {
    res.status(500).json({ error: 'Scraping failed', details: err.message });
  }
});

app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
