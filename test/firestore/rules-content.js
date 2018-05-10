'use strict';

const rules = `service cloud.firestore {
    match /databases/{database}/documents {
        match /{document=**} {
            allow read, write: if false;
        }

        match /{collection} {
            allow read, write: if false;
        }

        match /users {
            allow read, write: if false;

            match /{userId} {
                allow get: if request.auth.uid != null
                    && request.auth.uid == userId
                    && exists(/databases/$(database)/documents/users/$(userId));

                allow list: if false;

                allow update, delete: if request.auth.uid != null
                    && request.auth.uid == userId
                    && exists(/databases/$(database)/documents/users/$(userId));

                allow create: if request.auth.uid != null
                    && request.auth.uid == userId
                    && exists(/databases/$(database)/documents/users/$(userId)) == false;
            }
        }

        match /parties {
            allow read, write: if false;

            match /{party} {
                allow create: if request.auth.uid != null
                    && exists(/databases/$(database)/documents/users/$(request.auth.uid))
                    && exists(/databases/$(database)/documents/parties/$(party)) == false
                    && request.resource.data.keys().hasAll([
                        'gm',
                        'balance',
                        'currentDay'
                    ])
                    && request.resource.data.gm is string
                    && request.resource.data.gm == request.auth.uid
                    && request.resource.data.balance is int
                    && request.resource.data.balance >= 0
                    && request.resource.data.currentDay is int
                    && request.resource.data.currentDay == 0;

                allow update: if request.auth.uid != null
                    && exists(/databases/$(database)/documents/users/$(request.auth.uid))
                    && exists(/databases/$(database)/documents/parties/$(party))
                    && request.auth.uid == get(/databases/$(database)/documents/parties/$(party)).data.gm
                    && request.resource.data.keys().hasAll([
                        'gm',
                        'balance',
                        'currentDay'
                    ])
                    && request.resource.data.gm is string
                    && request.resource.data.gm == request.auth.uid
                    && request.resource.data.balance is int
                    && request.resource.data.balance >= 0
                    && request.resource.data.currentDay is int
                    && request.resource.data.currentDay >= 0;

                allow delete: if request.auth.uid != null
                    && exists(/databases/$(database)/documents/users/$(request.auth.uid))
                    && exists(/databases/$(database)/documents/parties/$(party))
                    && request.auth.uid == get(/databases/$(database)/documents/parties/$(party)).data.gm;

                allow get: if request.auth.uid != null
                    && exists(/databases/$(database)/documents/users/$(request.auth.uid))
                    && exists(/databases/$(database)/documents/parties/$(party))
                    && request.auth.uid == resource.data.gm;

                allow list: if false;

                match /hirelings {
                    allow read, write: if false;

                    match /{hireling} {
                        allow read: if request.auth.uid != null
                            && exists(/databases/$(database)/documents/users/$(request.auth.uid))
                            && exists(/databases/$(database)/documents/parties/$(party))
                            && exists(/databases/$(database)/documents/parties/$(party)/hirelings/$(hireling))
                            && request.auth.uid == get(/databases/$(database)/documents/parties/$(party)).data.gm;

                        allow create: if request.auth.uid != null
                            && exists(/databases/$(database)/documents/users/$(request.auth.uid))
                            && exists(/databases/$(database)/documents/parties/$(party))
                            && exists(/databases/$(database)/documents/parties/$(party)/hirelings/$(hireling)) == false
                            && request.auth.uid == get(/databases/$(database)/documents/parties/$(party)).data.gm
                            && request.resource.data.keys().hasAll([
                                'level',
                                'name',
                                'role',
                                'abilities',
                                'currentMission'
                            ])
                            && request.resource.data.level is int
                            && request.resource.data.level >= 1
                            && request.resource.data.level <= 20
                            && request.resource.data.name is string
                            && request.resource.data.role is int
                            && request.resource.data.role >= 0
                            && request.resource.data.role <= 3
                            && request.resource.data.abilities.size() >= 1
                            && request.resource.data.abilities.size() <= 3
                            && request.resource.data.currentMission is string
                            && request.resource.data.currentMission == ''

                        allow update: if request.auth.uid != null
                            && exists(/databases/$(database)/documents/users/$(request.auth.uid))
                            && exists(/databases/$(database)/documents/parties/$(party))
                            && exists(/databases/$(database)/documents/parties/$(party)/hirelings/$(hireling))
                            && request.auth.uid == get(/databases/$(database)/documents/parties/$(party)).data.gm
                            && request.resource.data.keys().hasAll([
                                'level',
                                'name',
                                'role',
                                'abilities',
                                'currentMission'
                            ])
                            && request.resource.data.level is int
                            && request.resource.data.level >= 1
                            && request.resource.data.level <= 20
                            && request.resource.data.name is string
                            && request.resource.data.role is int
                            && request.resource.data.role >= 0
                            && request.resource.data.role <= 3
                            && request.resource.data.abilities.size() >= 1
                            && request.resource.data.abilities.size() <= 3
                            && request.resource.data.currentMission is string

                        allow delete: if request.auth.uid != null
                            && exists(/databases/$(database)/documents/users/$(request.auth.uid))
                            && exists(/databases/$(database)/documents/parties/$(party))
                            && exists(/databases/$(database)/documents/parties/$(party)/hirelings/$(hireling))
                            && request.auth.uid == get(/databases/$(database)/documents/parties/$(party)).data.gm
                    }
                }

                match /missions {
                    allow read, write: if false;

                    match /{mission} {
                        allow read: if request.auth.uid != null
                            && exists(/databases/$(database)/documents/users/$(request.auth.uid))
                            && exists(/databases/$(database)/documents/parties/$(party))
                            && exists(/databases/$(database)/documents/parties/$(party)/missions/$(mission))
                            && request.auth.uid == get(/databases/$(database)/documents/parties/$(party)).data.gm;

                        allow create: if request.auth.uid != null
                            && exists(/databases/$(database)/documents/users/$(request.auth.uid))
                            && exists(/databases/$(database)/documents/parties/$(party))
                            && exists(/databases/$(database)/documents/parties/$(party)/missions/$(mission)) == false
                            && request.auth.uid == get(/databases/$(database)/documents/parties/$(party)).data.gm
                            && request.resource.data.keys().hasAll([
                                'level',
                                'name',
                                'length',
                                'challenges',
                                'reward',
                                'startDate',
                                'status'
                            ])
                            && request.resource.data.length is int
                            && request.resource.data.length >= 1
                            && request.resource.data.level is int
                            && request.resource.data.level >= 1
                            && request.resource.data.level <= 20
                            && request.resource.data.name is string
                            && request.resource.data.reward is int
                            && request.resource.data.reward >= 0
                            && request.resource.data.startDate is int
                            && request.resource.data.startDate >= 0
                            && request.resource.data.status is int
                            && request.resource.data.status == 0
                            && request.resource.data.challenges.size() >= 0

                        allow update: if request.auth.uid != null
                            && exists(/databases/$(database)/documents/users/$(request.auth.uid))
                            && exists(/databases/$(database)/documents/parties/$(party))
                            && exists(/databases/$(database)/documents/parties/$(party)/missions/$(mission))
                            && request.auth.uid == get(/databases/$(database)/documents/parties/$(party)).data.gm
                            && request.resource.data.keys().hasAll([
                                'level',
                                'name',
                                'length',
                                'challenges',
                                'reward',
                                'startDate',
                                'status'
                            ])
                            && request.resource.data.length is int
                            && request.resource.data.length >= 1
                            && request.resource.data.level is int
                            && request.resource.data.level >= 1
                            && request.resource.data.level <= 20
                            && request.resource.data.name is string
                            && request.resource.data.reward is int
                            && request.resource.data.reward >= 0
                            && request.resource.data.startDate is int
                            && request.resource.data.startDate >= 0
                            && request.resource.data.status is int
                            && request.resource.data.status >= 0
                            && request.resource.data.status <= 4
                            && request.resource.data.challenges.size() >= 0

                        allow delete: if request.auth.uid != null
                            && exists(/databases/$(database)/documents/users/$(request.auth.uid))
                            && exists(/databases/$(database)/documents/parties/$(party))
                            && exists(/databases/$(database)/documents/parties/$(party)/missions/$(mission))
                            && request.auth.uid == get(/databases/$(database)/documents/parties/$(party)).data.gm
                    }
                }
            }
        }
    }
}
`;

module.exports = {
    rules
};
