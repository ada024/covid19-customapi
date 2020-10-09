import * as admin from 'firebase-admin'
import { Request, Response } from 'express';
import * as superagent from 'superagent';
import { invalidTokenFailure, unavailableDataFailure } from './failure'




export async function world(req: Request, res: Response) {
    const validAccessToken = await validateToken(req)
    if (!validAccessToken) {
        res.status(401).send(invalidTokenFailure())
        return
    }
    const totalsData = await getTotals()
    if (totalsData === undefined) {
        res.status(404).send(unavailableDataFailure('cases'))
        return
    }
    const value = totalsData?.data.confirmed
    const date = totalsData?.date
    res.send([{
        cases: value,
        date: date
    }])
}

export async function country(req: Request, res: Response) {
    const country = req.query.country;
    try {
        const data =await fetFromApiWithCountry(country);  
        if (data === undefined) {
         console.error('Parsing from remote api failed!')
         return;
     }
     res.send(data);
    }catch(e){
        res.status(404).send(unavailableDataFailure('country'))
        return;
    }
    
}


async function fetFromApiWithCountry(country:any): Promise<{ data: { confirmed: number, deaths: number, recovered: number, active: number }, date: string } | undefined> {
    const apiUrl = 'https://covid19.mathdro.id/api/countries/${country}'
    const res = await superagent.get(apiUrl)
    if (res.text === undefined) {
        console.error(`Fetch data from api failed: ${apiUrl}`)
        return undefined
    }
    const confirmed = res.body.confirmed.value
    const deaths = res.body.deaths.value
    const recovered = res.body.recovered.value
    const date = res.body.lastUpdate
    return {
        data: {
            confirmed: confirmed,
            active: confirmed,
            deaths: deaths,
            recovered: recovered
        },
        date: date
    }

}


async function getTotals() {
    const latestDoc = await admin.firestore().collection('latest').doc('totals').get()
    if (latestDoc === undefined) {
        return undefined
    }
    return latestDoc.data()
}

async function validateToken(req: Request) {
    const accessToken = await fetchAccessToken(req)
    if (accessToken === undefined) {
        return false
    }
    return await isAccessTokenValid(accessToken)
}

async function fetchAccessToken(req: Request) {
    if (req.method !== 'GET') {
        console.log(`request is not called as GET method`)
        return undefined
    }
    const authHeader = req.headers.authorization
    if (authHeader === undefined) {
        console.log(`Missing  Authorization header: fetchAccessToken`)
        return undefined
    }
    if (authHeader.indexOf('Bearer ') !== 0) {
        console.log(`Authorization header is not type of Bearer: fetchAccessToken`)
        return undefined
    }
    const accessToken = authHeader.slice(7)
    if (accessToken.length === 0) {
        console.log(`Authorization key is empty: fetchAccessToken`)
        return undefined
    }
    return accessToken
}

async function isAccessTokenValid(accessToken: string) {
    const accessTokenDocRef = admin.firestore().collection('accessTokens').doc(accessToken)
    const accessTokenSnapshot = await accessTokenDocRef.get()
    if (!accessTokenSnapshot.exists) {
        return false
    }else return true;
}