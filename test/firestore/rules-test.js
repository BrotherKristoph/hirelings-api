'use strict';

const rules = require('./rules-content').rules;
const testSecurityRules = require('firestore-security-tests').testSecurityRules;

function createTestCase(
    expectation,
    uid,
    path,
    method
) {
    return {
        expectation,
        request: {
            auth: {
                uid
            },
            path: `/databases/(default)/documents/${path}`,
            method
        }
    };
}

const testCases = [];
const DENY = 'DENY',
    ALLOW = 'ALLOW',
    fn = {
        get: 'get',
        list: 'list',
        create: 'create',
        update: 'update',
        delete: 'delete'
    }

// /

testCases.push(createTestCase(DENY, 'any', 'nope', fn.get));
testCases.push(createTestCase(DENY, 'any', 'nope', fn.list));
testCases.push(createTestCase(DENY, 'any', 'nope', fn.create));
testCases.push(createTestCase(DENY, 'any', 'nope', fn.update));
testCases.push(createTestCase(DENY, 'any', 'nope', fn.delete));

// /(arbitrary collection)

// /users

// /users/(userId)

// /parties

// /parties/(party)

// /parties/(party)/missions

// /parties/(party)/missions/(mission)

// /parties/(party)/hirelings

// /parties/(party)/hirelings/(hireling)

const testResourceObj = {
    source: {
        files: [{
            name: '../../firestore/firestore.rules',
            content: rules
        }]
    },
    testSuite: {
        testCases
    }
};

function printResults(resultsObj) {
    const projectId = resultsObj.projectId,
        testResults = resultsObj.testResults,
        error = resultsObj.error,
        errMsg = resultsObj.errMsg;

    if (error) {
        return console.error('\n\ntestSecurityRules ERRORED:\n\n$', errMsg, error);
    }

    console.log(`\nTest results for ${projectId}:\n`);
    testResults.forEach(testResult => console.log(testResult.toString()));
}

testSecurityRules(printResults, testResourceObj, { verbose: true });
