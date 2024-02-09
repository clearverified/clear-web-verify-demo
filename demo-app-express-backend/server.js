const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const port = 3002;

const axios = require("axios");
const qs = require("qs");

const cors = require("cors");
var jwksClient = require("jwks-rsa");

app.use(cors());
app.use(express.json());

//Docker Build Vars
const redirect_uri = process.env.REACT_APP_REDIRECT_URI;
const client_id = process.env.REACT_APP_CLIENT_ID;
const grant_type = "authorization_code";
const clientSecret = process.env.CLIENT_SECRET;
const apiKey = process.env.API_KEY;
const jwkToPem = require('jwk-to-pem');

const authURL = process.env.CLEAR_AUTH_URL;
const memberDataUrl = process.env.CLEAR_BACKEND_SERVICE;

/**
 * URLS needed for OIDC Integration
 */
const oidcURL = process.env.CLEAR_OIDC_TOKEN_URL;
const oidcSignatureURL = process.env.CLEAR_SIGNATURE_URL;

/**
 * Single API endpoint to call get token and call the backend service API.
 * Don't log PII in Production
 */
app.post("/api/open", async (req, res) => {
  const data = req.body;

  const inputData = {
    first_name: data.firstName,
    last_name: data.lastName,
    address: data.address,
    city: data.city,
    zipCode: data.zipCode,
  };

  console.log("inputData: " + JSON.stringify(inputData));
  try {
    const response = await getToken(data.code);
    res.json({
      message: "Data received!",
      responseData: response,
      inputData: inputData,
    });
  } catch (error) {
    //Do not log full error message in Production
    res.status(500).json({ error: error.message });
  }
});

/**
 * Single API endpoint to call get access token and call the backend service with the New OIDC Feature.
 * It returns something similar to Member Data API.
 * Not all ClientIDs will have this feature enabled. Read CLEAR Documentation for more information
 * Don't log PII in Production
 */
app.post("/api/oidc", async (req, res) => {
  const data = req.body;

  const inputData = {
    first_name: data.firstName,
    last_name: data.lastName,
    address: data.address,
    city: data.city,
    zipCode: data.zipCode,
  };

  console.log("inputData: " + JSON.stringify(inputData));
  try {
    const response = await getOIDCToken(data.code);
    res.json({
      message: "Data received!",
      responseData: response,
      inputData: inputData,
    });
  } catch (error) {
    //Do not log full error message in Production
    res.status(500).json({ error: error.message });
  }
});

/**
 * First call to get the auth token. DO NOT LOG SENSITIVE DATA IN PRODUCTION
 * @param {string} code
 * @returns
 */
async function getToken(code) {
  //Function to validate the authcode
  if (!isValidFormat(code)) {
    throw new Error("AUTH code not valid");
  }

  const requestBody = qs.stringify({
    code: code,
    redirect_uri: redirect_uri,
    grant_type: grant_type,
    client_id: client_id,
    client_secret: clientSecret,
  });

  try {
    const response = await axios.post(authURL, requestBody, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    var access_token = response.data.access_token;
    console.log("200 OK from Auth Server: " + JSON.stringify(response.data));
    var jwtDecoded = decodeToken(response.data.access_token);
    console.log("DECODED JWT: ", jwtDecoded);

    //Can contain preferred_username or partner_scoped_user_id.
    //preferred_username is default. Read CLEAR Documentation for more information on decoded JWT
    var id = jwtDecoded.preferred_username;
    //var id = jwtDecoded.com.clearme.partner_scoped_user_id

    //Call API to get the Member Data, we will return this to the frontend
    var memberdata = getMemberData(access_token, id);

    return memberdata;
  } catch (error) {
    console.error("Error:", error);
    throw new Error("An error occurred while processing the data.");
  }
}

/**
 * Second data sharing call. DO NOT LOG SENSITIVE DATA IN PRODUCTION
 * @param {string} access_token
 * @param {string} id
 * @returns
 */
async function getMemberData(access_token, id) {
  const url = memberDataUrl + id;
  console.log("Calling API on: " + url);
  try {
    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Bearer " + access_token,
        "x-api-key": apiKey,
        //Change this line in PROD or during development
        "User-Agent": "CLEAR Demo App",
        "X-CLEAR-CorrelationInfo": buildCorrelationInfo(
          "sessionId",
          client_id,
          "demo_app_device"
        ),
      },
    });

    console.log("Response from CLEAR SERVER:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    throw new Error(error);
  }
}
async function getOIDCToken(code) {
  //Function to validate the authcode
  if (!isValidFormat(code)) {
    console.log("code: " + code);
    console.log("isValidFormat: " + isValidFormat(code));
    throw new Error("AUTH code not valid");
  }

  const requestBody = qs.stringify({
    code: code,
    redirect_uri: redirect_uri,
    grant_type: grant_type,
    client_id: client_id,
    client_secret: clientSecret,
  });

  try {
    const response = await axios.post(authURL, requestBody, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    var access_token = response.data.access_token;
    console.log("200 OK from Auth Server: " + JSON.stringify(response.data));
    var jwtDecoded = decodeToken(response.data.access_token);
    console.log("DECODED JWT: ", jwtDecoded);

    var id = jwtDecoded.preferred_username;

    getIdentityAttestationToken(access_token, id)
      .then((result) => {
        console.log("Decoded and Signature Verified Identity Token:", result);
        return result;
      })
      .catch((error) => {
        console.error("Error:", error);
        throw new Error("An error occurred while getting the Identity Token");
      });
  } catch (error) {
    console.error("Error:", error);
    throw new Error("An error occurred while processing the data.");
  }
}

/**
 * Retrieve Data using the Identity Attestation Token. DO NOT LOG SENSITIVE DATA IN PRODUCTION
 * @param {string} access_token
 * @param {string} id
 * @returns
 */
async function getIdentityAttestationToken(access_token, id) {
  //Build the request URL
  const url = oidcURL + id + "/identity-attestation-token";

  try {
    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Bearer " + access_token,
        "x-api-key": apiKey,
        //Change this line in PROD or during development
        "User-Agent": "CLEAR Demo App",
        "X-CLEAR-CorrelationInfo": buildCorrelationInfo(
          "sessionId",
          client_id,
          "demo_app_device"
        ),
      },
    });
    var serverResponse = response.data;
    var iat = serverResponse.identity_attestation_token;
    console.log("Identity Token: " + iat);

    function getKey(header, callback) {
      axios.get(oidcSignatureURL)
        .then(response => {
          console.log(response.data)
          const keys = response.data.keys;
          const signingKeyData = keys.find(key => key.kid === header.kid);
    
          if (!signingKeyData) {
            callback(new Error('The JWKS endpoint did not contain a matching key'));
            return;
          }
    
          const signingKey = jwkToPem(signingKeyData);
          callback(null, signingKey);
        })
        .catch(err => {
          callback(err);
        });
    }

    //Use `jsonwebtoken` to verify the signature of the IAT
    return new Promise((resolve, reject) => {
      jwt.verify(iat, getKey, (err, decoded) => {
        if (err) {
          reject(err);
        } else {
          resolve(decoded);
        }
      });
    });
  } catch (error) {
    console.error("Error:", error);
    throw new Error(error);
  }
}

/**
 * Decode Auth Server's JWT Token
 * @param {string} token
 * @returns
 */
function decodeToken(token) {
  try {
    const decoded = jwt.decode(token);
    return decoded;
  } catch (error) {
    console.error("Error decoding JWT:", error.message);
    throw new Error("Invalid token");
  }
}

/**
 * You can generate your own requestId and also pass in the sessionId from the frontend.
 * This is optional but it can help CLEAR  header track a users journey through our services
 * @param {string} sessionId
 * @param {string} clientId
 * @param {string} deviceId
 * @returns
 */
function buildCorrelationInfo(sessionId, clientId, deviceId) {
  const requestId = Math.random().toString(36).substr(2, 5).toUpperCase();
  console.log("data sharing requestId: " + requestId);
  return `[sessionId='${sessionId}'], [requestId='${requestId}'], [clientId='${clientId}'], [deviceId='${deviceId}']`;
}

/**
 * Validate string value is AlphaNumeric
 */
function isValidFormat(str) {
  var regex = /^[a-z0-9]+(?:[._-][a-z0-9]+)*$$/;
  return regex.test(str);
}

// Start the server
app.listen(port, () => {
  console.log(`Express server is running on port ${port}`);
});
