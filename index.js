const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = '8193377f2e3e92ac46c7ad11fcdf749c'; // Set this in Render later

app.use(cors());

app.get('/football', async (req, res) => {
  const { date, type = 'Friendly' } = req.query;

  if (!API_KEY) {
    return res.status(500).json({ error: 'API key missing' });
  }

  const url = `https://v3.football.api-sports.io/fixtures?date=${date}`;

  try {
    const response = await axios.get(url, {
      headers: {
        'x-apisports-key': API_KEY
      }
    });

    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json({
      error: err.message,
      detail: err.response?.data || null
    });
  }
});

app.get('/', (req, res) => {
  res.send('API-Football Proxy is running');
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
