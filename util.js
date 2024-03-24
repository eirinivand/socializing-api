const rXlsx = require("read-excel-file/node");
const {Sequelize} = require("sequelize");
const {User} = require("./models/models");

const LIKE_PREFIX = 'l_';
const CASE_INSENSITIVE_PREFIX = 'i_';

async function readUsers() {
    return rXlsx('./seeds.xlsx', {sheet: 'users'}).then((rows) => {
        return rows;
    });

}

async function readMessages() {
    return rXlsx('./seeds.xlsx', {sheet: 'messages'}).then((rows) => {
        return rows;
    });
}

function processParams(rawParams, expectedParams) {
    const params = {};
    const wrongEntries = [];
    Object.keys(rawParams).map((rawKey) => {
        // Since we allow a prefix to determine case insensitivity we need to

        // 1. remove insensitivity prefix to match the actual attribute
        const regex = new RegExp('^(' + CASE_INSENSITIVE_PREFIX + '|' + LIKE_PREFIX + ')', 'g');
        const key = rawKey.replace(regex, '');
        if (!(key.replace(regex, '') in expectedParams)) {
            // Keep any query params not matching User attributes to explain later.
            wrongEntries.push(key);
        }

        // 2. Make the search insensitive
        if (key === 'gender' &&
            (rawKey.startsWith(CASE_INSENSITIVE_PREFIX) || rawKey.startsWith(LIKE_PREFIX))) {
            // ENUMs don't support Op.iLike,
            // however making them follow the standard of lower case has a similar effect
            params[key] = rawParams[rawKey].toLowerCase();
            if (!(params[key] in User.rawAttributes.gender.values)) {
                throw new Error(`${rawParams[rawKey]} is not in available values for gender. Available values: ${User.rawAttributes.gender.values}`);
            }
        } else if (rawKey.startsWith(CASE_INSENSITIVE_PREFIX)) {
            params[key] = {[Sequelize.Op.iLike]: rawParams[rawKey]};
        } else if (rawKey.startsWith(LIKE_PREFIX)) {
            params[key] = {[Sequelize.Op.iLike]: `%${rawParams[rawKey]}%`};
        } else {
            params[key] = rawParams[rawKey];
        }
    });
    if (wrongEntries.length > 0) {
        throw new Error(`${wrongEntries} not in objects attributes. Available attributes: ${Object.keys(expectedParams)}`);
    }
    return params;
}

module.exports = {readUsers, readMessages, processParams}