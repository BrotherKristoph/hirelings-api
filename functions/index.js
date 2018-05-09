const functions = require('firebase-functions');
const firebase = require('firebase-admin');
const cors = require('cors')({origin: true});
firebase.initializeApp(functions.config().firebase);

exports.testDb = functions.https.onRequest((req, res) => {

    return cors(req, res, () => {
        res.status(200).send('Hello World!');

        // firebase.database().ref('testDb').once('value').then(snapshot => {
        //     responseData = JSON.stringify(snapshot.val());
        //     res.send(responseData);
        // });
    });
});
