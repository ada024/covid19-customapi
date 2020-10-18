import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin'

admin.initializeApp();

import { world, country } from './api_endpoints'
//import {exeLatestTotalsToDb } from './store_to_db' 
// exports.scheduleFirestoreUpdate = functions.pubsub.schedule('0 10,22 * * *').onRun((_) => exeLatestTotalsToDb())


exports.world = functions.https.onRequest(world)
exports.country = functions.https.onRequest(country)