const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const port = 3002;

const axios = require('axios');
const qs = require('qs');

const cors = require('cors');
const e = require('express');

//TODO: Add Rules for CORs 
app.use(cors()); 
app.use(express.json());

//Docker Build Vars
const redirect_uri = process.env.REACT_APP_REDIRECT_URI;
const client_id = process.env.REACT_APP_CLIENT_ID
const grant_type = 'authorization_code'
const clientSecret= process.env.CLIENT_SECRET
const apiKey = process.env.API_KEY

const authURL = process.env.CLEAR_AUTH_URL
const memberDataUrl = process.env.CLEAR_BACKEND_SERVICE

/**
 * Single API endpoint to call get token and call the backend service API. 
 * Don't log PII in Production 
 */
app.post('/api/open', async (req, res) => {
    const data = req.body;

    const inputData  = {
      'first_name': data.firstName,
      'last_name': data.lastName,
      'address': data.address,
      'city': data.city,
      'zip code': data.zipCode
    }

    console.log('inputData: ' + JSON.stringify(inputData));
    try {
      const response = await getToken(data.code);
      res.json({ message: 'Data received!', responseData: response, inputData: inputData});
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
    const requestBody = qs.stringify({
      code: code,
      redirect_uri: redirect_uri,
      grant_type: grant_type,
      client_id: client_id,
      client_secret: clientSecret
    });
  
    try {
      const response = await axios.post(authURL, requestBody, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });
  
      var access_token = response.data.access_token
      console.log('200 OK from Auth Server: '+JSON.stringify(response.data))
      var jwtDecoded = decodeToken(response.data.access_token)
      console.log('DECODED JWT: ', jwtDecoded)

      //Can contain preferred_username or partner_scoped_user_id.
      //preferred_username is default and partner_scoped_user_id might not be in decoded JWT
      var id = jwtDecoded.preferred_username
      //var id = jwtDecoded.com.clearme.partner_scoped_user_id

      var memberdata = getMemberData(access_token,id)
      return memberdata
    } catch (error) {
      console.error('Error:', error);
      throw new Error('An error occurred while processing the data.');
    }
  }

  /**
   * Second data sharing call. DO NOT LOG SENSITIVE DATA IN PRODUCTION
   * @param {string} access_token 
   * @param {string} id 
   * @returns 
   */
  async function getMemberData(access_token,id) {
    const url =  memberDataUrl+id
    console.log('Calling API on: '+url);
    try {
      const response = await axios.get(url, {
        headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json', 
        'Authorization':'Bearer '+access_token,
        'x-api-key':apiKey,
        //Change this line in PROD or during development
        'User-Agent':'CLEAR Demo App',
        'X-CLEAR-CorrelationInfo':  buildCorrelationInfo('sessionId',client_id,'demo_app_device')
        }
    });
  
      console.log('Response from CLEAR SERVER:', response.data)
      return response.data;
    } catch (error) {
        console.error('Error:', error)
        throw new Error(error);
      }
  }

  function decodeToken(token) {
    try {
      const decoded = jwt.decode(token);
      return decoded;
    } catch (error) {
      console.error('Error decoding JWT:', error.message);
      throw new Error('Invalid token');
    }
  }

  /**
   * You can generate your own requestId and also pass in the sessionId from the frontend. 
   * This is optional but it can help us Debug Data Sharing Failures
   * @param {string} sessionId 
   * @param {string} clientId 
   * @param {string} deviceId 
   * @returns 
   */
  function buildCorrelationInfo(sessionId, clientId, deviceId) {
    const requestId = Math.random().toString(36).substr(2, 5).toUpperCase();
    console.log('data sharing requestId: '+requestId)
    return `[sessionId='${sessionId}'], [requestId='${requestId}'], [clientId='${clientId}'], [deviceId='${deviceId}']`;
  }



// Start the server
app.listen(port, () => {
    console.log(`Express server is running on port ${port}`);
});