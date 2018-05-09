const functions = require('firebase-functions');
const cors = require('cors')({origin: true});

exports.testDb = functions.https.onRequest((req, res) => {

    return cors(req, res, () => {
        res.status(200).send('Hello World!');
    });
});
