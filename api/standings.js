const axios = require('axios');

const leagueId = '901692'; // Replace with your actual league ID
const url = `https://fantasy.premierleague.com/api/leagues-h2h-matches/league/${leagueId}/`;

async function fetchH2HData(leagueId, startGW, endGW) {
    try {
        const response = await axios.get(url);
        const data = response.data;
        return data.results.filter(match => match.gw >= startGW && match.gw <= endGW);
    } catch (error) {
        console.error(error);
        throw new Error('Error fetching data from FPL API');
    }
}

module.exports = async (req, res) => {
    const { startGW, endGW } = req.query;
    try {
        const data = await fetchH2HData(leagueId, parseInt(startGW), parseInt(endGW));
        res.status(200).json({ results: data });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
