const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// PostgreSQL connection configuration
const pool = new Pool({
    user: USERNAME,
    host: 'localhost',
    database: 'nfl_data',
    password: PASSWORD,
    port: 5432,
});

// API endpoint to fetch data
app.get('/api/player_data', async (req, res) => {
    const { statistic, year, week, position } = req.query;

    try {
        const columnName = statistic;
        const query = `
        SELECT team, player_name, ${columnName}
        FROM weekly_player_data2
        WHERE season = $1 AND week = $2 AND position = $3
        ORDER BY ${columnName} DESC
        FETCH FIRST 45 ROWS ONLY
        `;
        const result = await pool.query(query, [year, week, position]);
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
