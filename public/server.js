const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
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

// Function to fetch league details including users
async function fetchLeagueDetails(leagueId) {
    try {
        const response = await axios.get(url);
        const data = response.data;
        // Extract user information from league details
        return data.league.standings.results.map(user => ({
            id: user.entry,
            name: user.player_name
        }));
    } catch (error) {
        console.error(error);
        throw new Error('Error fetching league details from FPL API');
    }
}

// Route to fetch H2H data for a specific section
app.get('/api/standings/:startGW/:endGW', async (req, res) => {
    const { startGW, endGW } = req.params;
    const leagueId = '901692'; // Replace with your actual league ID
    try {
        const data = await fetchH2HData(leagueId, parseInt(startGW), parseInt(endGW));
        res.json({ results: data });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// // Route to fetch existing joined users
// app.get('/api/users', async (req, res) => {
//     const leagueId = '901692'; // Replace with your actual league ID
//     try {
//         const users = await fetchLeagueDetails(leagueId);
//         res.json({ users });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
