export async function getToken(tokenRequest,backendService) {
    var details = {
        'code': tokenRequest.code,
        'firstName':tokenRequest.firstName,
        'lastName':tokenRequest.lastName,
        'address':tokenRequest.address,
        'grant_type': "authorization_code"
    };

    const response = await fetch(backendService, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(details)
    });

    return await response.json();
}
