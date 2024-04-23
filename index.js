const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const moment = require('moment');
const _ = require('lodash');
const express = require('express');

const app = express();
const PORT = 3000;

let users = [];

const fetchRandomUser = async () => {
    try {
        const response = await axios.get('https://randomuser.me/api/');
        const userData = response.data.results[0];
        return {
            id: uuidv4(),
            name: `${userData.name.first} ${userData.name.last}`,
            gender: userData.gender,
            timestamp: moment().format('YYYY-MM-DD HH:mm:ss')
        };
    } catch (error) {
        console.error('Error fetching user:', error);
        throw error;
    }
};

app.get('/register', async (req, res) => {
    try {
        const newUser = await fetchRandomUser();
        users.push(newUser);
        res.json(newUser);
    } catch (error) {
        res.status(500).json({ error: 'Error al registrar usuario' });
    }
});

app.get('/users', async (req, res) => {
    const groupedUsers = _.groupBy(users, 'gender');
    const chalk = await import('chalk');
    console.log(chalk.default.bgWhite.blue(JSON.stringify(groupedUsers, null, 2)));
    res.json(groupedUsers);
});

// Iniciar servidor con Nodemon
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
