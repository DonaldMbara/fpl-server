const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve static files from the frontend build directory
app.use(express.static(path.join(__dirname, 'public')));

const leagueId = '901692'; // Replace with your actual league ID
const url = `https://fantasy.premierleague.com/api/leagues-h2h-matches/league/${leagueId}/`;

// Function to fetch H2H data for a specific section
async function fetchH2HData(leagueId, startGW, endGW) {
    try {
        const response = await axios.get(url);
        const data = response.data;
        // Filter or process data based on startGW and endGW
        return data.results.filter(match => match.gw >= startGW && match.gw <= endGW);
    } catch (error) {
        console.error(error);
        throw new Error('Error fetching data from FPL API');
    }
}

// Route to fetch H2H data for a specific section
app.get('/api/standings/:startGW/:endGW', async (req, res) => {
    const { startGW, endGW } = req.params;
    try {
        const data = await fetchH2HData(leagueId, parseInt(startGW), parseInt(endGW));
        res.json({ results: data });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Catch-all route to serve the frontend application
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
