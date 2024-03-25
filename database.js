const {Sequelize} = require('sequelize');
const {Client} = require('pg');

async function initDatabase() {
    const client = new Client({
        user: `${process.env.DB_USER}`,
        password: `${process.env.DB_PASSWORD}`,
        host: `${process.env.DB_HOST}`,
        port: `${process.env.DB_PORT}`
    });
    try {
        await client.connect();
        await client.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
        console.log('Database created or already exists.');
    } catch (error) {
        console.error('Error creating database:', error);
    } finally {
        await client.end();
    }
}

const db = new Sequelize(
    `${process.env.DB_NAME}`,
    `${process.env.DB_USER}`,
    `${process.env.DB_PASSWORD}`,
    {
        host: `${process.env.DB_HOST}`,
        dialect: 'postgres',
        port: `${process.env.DB_PORT}`
    });

initDatabase().then(r => {
    // Ensure connection
    db.authenticate().then(() => {
        console.log('Connection has been established successfully.');
    }).catch((error) => {
        console.error('Unable to connect to the database: ', error);
    });

});
module.exports = db;