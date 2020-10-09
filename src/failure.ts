
export function badRequestFailure () {
    return {
        error: {
            code: 4001,
            message: 'Bad request',
            description: `The resone could be wrong parameter`
        }
    }
}

export function accessTokenRequiresGetMethodError(method: string) {
    return {
        error: {
            code: 1001,
            message: 'token should be called with the POST method',
            description: `Called token with ${method} method. Use POST instead`
        }
    }
}

export function accessTokenRequiresBasicAuthorizationErrorData() {
    return {
        error: {
            code: 1002,
            message: 'Missing or invalid authorization header',
            description: `token must be called with an Basic <apiKey> header`
        }
    }
}

export function invalidTokenFailure() {
    return {
        error: {
            code: 4001,
            message: 'Invalid Credentials',
        }
    }
}

export function unavailableDataFailure(api: string) {
    return {
        error: {
            code: 4000,
            message: 'No data found',
            description: `No data was found for ${api} api`
        }
    }
}