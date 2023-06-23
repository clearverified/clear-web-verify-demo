import React, { useEffect, useState } from 'react';
import { getToken } from '../services/DataShareService';
import { useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import '../CardStyles.css'; 

const backendService = process.env.REACT_APP_BACKEND_SERVICE;

const CallbackPage = () => {
  const location = useLocation();
  const [responseValues, setResponseValues] = useState({});
  const [responseAddress, setresponseAddress] = useState({});
  useEffect(() => {

    //BUILD Request from query and local storage
    const queryParams = new URLSearchParams(location.search);
    const code = queryParams.get('code');

    //Check query param for state variables
    const state = queryParams.get('state');
    console.log('checking state variable: '+state);
    console.log('checking state variable from localstorage: '+localStorage.getItem('state'));

    const firstName = localStorage.getItem('firstName');
    const lastName = localStorage.getItem('lastName');
    const address = localStorage.getItem('address');
    const city = localStorage.getItem('city');
    const zipCode = localStorage.getItem('zipCode');
    
    const tokenRequest = {
      code,
      firstName,
      lastName,
      address,
      city,
      zipCode
    };

    if (code && (state === localStorage.getItem('state'))) {
      getToken(tokenRequest, backendService)
        .then((response) => {
          console.log('response from CallbackPage:', response);
          setResponseValues(response.responseData.member_data);
          setresponseAddress(response.responseData.member_data.address);
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }
  }, [location.search]);

  return (
<div className="container">
<div class="card mb-4">
  <h2 class="card-header bg-light-blue"> Callback Page </h2>
  <div class="card-body">
  <h5 class="card-title">Verify the input data with CLEAR</h5>
    <p class="card-text">     
    <table className="table">
        <thead>
          <tr>
            <th></th>
            <th>Member Entered</th>
            <th>CLEAR Response</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>First Name</td>
            <td>{localStorage.getItem('firstName')}</td>
            <td>{responseValues.given_name}</td>
          </tr>
          <tr>
            <td>Last Name</td>
            <td>{localStorage.getItem('lastName')}</td>
            <td>{responseValues.family_name}</td>
          </tr>
          <tr>
            <td>Street Address</td>
            <td>{localStorage.getItem('address')}</td>
            <td>{responseAddress.street_address}</td>
          </tr>
          <tr>
            <td>City</td>
            <td>{localStorage.getItem('city')}</td>
            <td>{responseAddress.locality}</td>
          </tr>
          <tr>
            <td>Zip Code</td>
            <td>{localStorage.getItem('zipCode')}</td>
            <td>{responseAddress.postal_code}</td>
          </tr>
        </tbody>
      </table></p>
  </div>
</div>
</div>
  );
};

export default CallbackPage;
