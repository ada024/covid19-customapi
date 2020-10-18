import * as admin from 'firebase-admin';
import * as superagent from 'superagent';
import * as config from './env'

export async function exeLatestTotalsToDb(): Promise<boolean> {
    try {
        const data = await fetchDataFromApi()
        if (data === undefined) {
            console.error('Parsing from remote api failed!')
            return false
        }
        const latestRef = admin.firestore().collection('latest').doc('totals')
        await latestRef.set(data)
        console.log(`SAVED: successful: ${data.data.confirmed}, deaths: ${data.data.deaths}, recovered: ${data.data.recovered}, active: ${data.data.active}, date: ${data.date}`)
        return true
    } catch (e) {
        console.log(e)
        return false
    }
}


async function fetchDataFromApi(): Promise<{ data: { confirmed: number, deaths: number, recovered: number, active: number }, date: string } | undefined> {
    const apiUrl = config.apiUrl;
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