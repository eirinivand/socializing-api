const {readUsers, processParams} = require("../util");
const {User} = require("../models/models");

async function saveUsers() {
    // Parse and persist data of users spreadsheet
    const rows = await readUsers();
    const usrs = [];

    for (const row of rows) {
        const usr = await User.findOrCreate({
            where: {
                id: row[0],
                name: row[1],
                surname: row[2],
                birthday: Date.parse(row[3]),
                gender: row[4].toLowerCase(),
                username: row[5]
            }
        });
        usrs.push(usr[0]);
    }
    return usrs;

}

async function getUsers(params) {
    // Validate query params are within the User attributes.
    const userAttrs = processParams(params,User.getAttributes())

    return await User.findAll({
        where: userAttrs
    });
}

module.exports = {saveUsers, getUsers}