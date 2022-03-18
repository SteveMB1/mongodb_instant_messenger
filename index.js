'use strict';

const ObjectId = require('mongodb').ObjectId;

async function getMessages(blockedProfiles = [], profileId, recipientId, prefetch = 15, preLoadedMessages = []) {
    if (typeof preLoadedMessages != "object") {
        var loadedMessages = [];
    } else {
        var loadedMessages = [];
        preLoadedMessages.forEach(element => {
            loadedMessages.push(ObjectId(element))
        });
    };

    var messages = await db
        .collection('messages')
        .find({
            $and: [
                { "sender": { $nin: blockedProfiles } },
                { "recipient": { $nin: blockedProfiles } },
                { sender: { $in: [ObjectId(profileId), recipientId] } },
                { recipient: { $in: [ObjectId(profileId), recipientId] } },
                { _id: { $nin: loadedMessages } }
            ]
        }, { projection: { unread: 0 } })
        .sort({ timestamp: -1 })
        .limit(Number(prefetch))
        .toArray();

    return (messages)
};

async function markRead(sender, recipientId) {
    db.collection('messages').bulkWrite([{
        updateMany: {
            "filter": {
                $and: [
                    { sender: { $in: [ObjectId(sender)] } },
                    { recipient: { $in: [recipientId] } },
                    { unread: true },
                ],
            },
            "update": { $set: { "unread": false } }
        }
    }]);
};

async function inbox(recipientId, blockedProfiles = []) {
    var recipientId = ObjectId(recipientId);

    const messages = await db
        .collection('messages')
        .aggregate([
            {
                $match: {
                    $and: [
                        { "sender": { $nin: blockedProfiles } },
                        { "recipient": { $nin: blockedProfiles } },
                        {
                            $or: [
                                { "sender": recipientId },
                                { "recipient": recipientId },
                            ],
                        }
                    ]
                }
            },
            { $sort: { 'timestamp': -1 } },
            {
                $group: {
                    "_id": { $cond: { if: { $eq: ["$sender", recipientId] }, then: "$recipient", else: "$sender" } },
                    "sender": { $first: "$sender" },
                    "content": { $first: "$content" },
                    "unread": { $first: "$unread" },
                    "timestamp": { $first: "$timestamp" },
                }
            }
        ])
        .sort({ timestamp: -1 })
        .toArray();

    return(messages)
};

async function sendMessage(content, recipient, sender) {
    var messageID = await db.collection('messages').insertOne({
        content: String(content.trim()),
        recipient: ObjectId(recipient),
        sender: ObjectId(sender),
        timestamp: new Date(),
        unread: true
    });
    return(messageID)
};


exports.markRead = markRead;
exports.getMessages = getMessages;
exports.inbox = inbox;
exports.sendMessage = sendMessage;
