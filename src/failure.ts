
export function badRequestFailure () {
    return {
        error: {
            code: 4001,
            message: 'Bad request',
            description: `The resone could be wrong parameter`
        }
    }
}