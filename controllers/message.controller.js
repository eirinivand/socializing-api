const {readMessages, processParams} = require("../util");
const {Message, User} = require("../models/models");
const {Sequelize} = require("sequelize");
const db = require("../database")

async function saveMessages() {
    // Parse and persist data of users spreadsheet
    const rows = await readMessages();
    const messages = [];
    for (const row of rows) {
        const msg = await Message.findOrCreate({
            where: {
                id: row[0],
                content: row[1],
                fromId: row[2],
                toId: row[3],
                isSeen: row[4] === "TRUE",
                sentAt: Date.parse(row[5])
            }
        });
        messages.push(msg[0]);
    }
    return messages;

}

async function getMessagesBetweenUsers(params) {
    // Validate params are within the Message attributes.
    const user1 = parseInt(params['userId1']);
    const user2 = parseInt(params['userId2']);
    if (user1 && user2) {
        return await Message.findAll({
            where: {
                [Sequelize.Op.or]: [
                    {[Sequelize.Op.and]: [{fromId: user1}, {toId: user2}]},
                    {[Sequelize.Op.and]: [{toId: user1}, {fromId: user2}]}
                ]
            }, order: [
                ['sentAt', 'DESC']
            ]
        });
    } else {
        throw new Error(`Given params are erroneous. '${params['userId1']}' or '${params['userId2']}' are not valid user ids.`)
    }
}

async function getLatestUserChats(rawUserId) {
    const userId = parseInt(rawUserId)
    // const chats =  await Message.findAll({
    //     attributes: [
    //         [Sequelize.literal(`CASE WHEN "messages"."fromId" = ${userId}
    //             THEN  "messages"."toId" ELSE  "messages"."fromId" END`), 'otherUser'],
    //         [Sequelize.fn('MAX', Sequelize.col('sentAt')), 'sent']
    //     ],
    //     where: {
    //             [Sequelize.Op.or]:
    //                 [{fromId: userId}, {toId: userId}]
    //     },
    //     order: [
    //         ['sent', 'DESC']
    //     ],
    //     group: ['otherUser']
    // });
    const chats = await db.query(`
        WITH "last_message" AS
                 (SELECT MAX("m"."sentAt")         as "last_message_sent_at",
                         CASE
                             WHEN "m"."fromId" = ${userId}
                                 THEN "m"."toId"
                             ELSE "m"."fromId" END AS "otheruser"
                  FROM "messages" AS "m"
                  WHERE ("m"."fromId" = ${userId} OR "m"."toId" = ${userId})
                  GROUP BY "otheruser")
        SELECT "u".*, "lm"."last_message_sent_at"
        FROM "users" AS "u",
             "last_message" AS "lm"
        WHERE "u"."id" = "lm"."otheruser"
        ORDER BY "lm"."last_message_sent_at" DESC`);
    return chats[0];
}

module.exports = {saveMessages, getMessagesBetweenUsers, getLatestUserChats}