const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
const PORT = 3000;

// Your API key and Custom Search Engine ID
const API_KEY = 'AIzaSyCac67OiwxJQf3pTXvLjHkVRSNClhd00VU';
const CX = '07bd509583d50428f';

const competitors = [
  "TCS", "Accenture", "Wipro", "HCLTech", "Cognizant", "Capgemini", "IBM", "Tech Mahindra", "DXC"
];

const confirmedPartners = ["TCS", "Accenture", "Wipro"];

const getSearchURL = (company) =>
  `https://www.googleapis.com/customsearch/v1?key=${API_KEY}&cx=${CX}&q=Virgin Media ${encodeURIComponent(company)}`;

app.get('/api/find-collaborators', async (req, res) => {
  const results = [];

  for (const company of competitors) {
    let category = confirmedPartners.includes(company)
      ? "Confirmed Partnership"
      : "Weak/Unverified Proof";

    const url = getSearchURL(company);

    try {
      const response = await axios.get(url);
      const items = response.data.items;

      results.push({
        company,
        category,
        description: items?.[0]?.snippet || `Possible collaboration with ${company}`,
        proof: items?.[0]?.link || 'Not found',
      });
    } catch (error) {
      results.push({
        company,
        category,
        description: error.message,
        proof: 'Error fetching data',
      });
    }
  }

  res.json(results);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
