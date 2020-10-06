import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin'

admin.initializeApp();

import {exeLatestTotalsToDb } from './store_to_db'
import { cases, casesSuspected, casesConfirmed, deaths, recovered } from './endpoints'

exports.scheduleFirestoreUpdate = functions.pubsub.schedule('0 10,22 * * *').onRun((_) => exeLatestTotalsToDb())


exports.cases = functions.https.onRequest(cases)
exports.casesSuspected = functions.https.onRequest(casesSuspected)
exports.casesConfirmed = functions.https.onRequest(casesConfirmed)
exports.deaths = functions.https.onRequest(deaths)
exports.recovered = functions.https.onRequest(recovered)