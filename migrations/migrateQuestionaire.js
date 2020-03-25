const encoding = require('encoding');
import client from './sanityClient';
import dd from './dd';
const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'database-1.c5bmqomykq6n.eu-central-1.rds.amazonaws.com',
    user: 'admin',
    password: '87654321',
    database: 'twelosas_e',
    port: 3307,
});

function decode(text) {
    return encoding.convert(text, 'utf-8', 'windows-1257').toString();
}

function cleanQ({
    reward_id,
    reward_title,
    reward_question,
    reward_answer,
    reward_points,
}) {
    return {
        _id: Buffer.from(`0000000-${reward_id.toString()}`, 'utf8').toString(
            'hex'
        ),
        category: decode(reward_title),
        question: decode(reward_question),
        answer: decode(reward_answer),
        points: parseInt(reward_points),
    };
}

function handle(item) {
    const data = cleanQ(item);
    // Ready to publish
    client
        .createOrReplace({
            _type: 'questionnaire',
            ...data,
        })
        .then(res => {
            console.log(`Question migrated, doc ID is ${res._id}`);
        })
        .catch(err => {
            console.log(`Error while uploading question`, err);
        });
}

connection.connect();

connection.query('SELECT * FROM plxasc5354zxpui_rewards', function(
    error,
    results,
    fields
) {
    if (error) throw error;
    results.forEach(handle);
});

connection.end();
