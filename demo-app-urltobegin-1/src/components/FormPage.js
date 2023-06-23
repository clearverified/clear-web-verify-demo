// FormPage.js
import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';

const getVerificationURL = () => {
  const clientId = process.env.REACT_APP_CLIENT_ID;
  const redirectURI = process.env.REACT_APP_REDIRECT_URI;
  const scope = process.env.REACT_APP_SCOPE;
  const env = process.env.REACT_APP_ENV;

  console.log('env: '+env)
  let baseURL = 'https://verify.partner.platform.clearme.com/';
  if(env === "prod"){
    baseURL = "https://verify.clearme.com"
  }

  //Generate random state variable 
  const state = generateRandomString(8);
  localStorage.setItem('state',state)
  
  const params = new URLSearchParams();
  params.append('clientId', clientId);
  params.append('redirectURI', redirectURI);
  params.append('scope', scope);
  params.append('state', state);

  const url = new URL(baseURL);
  url.search = params.toString();

  console.log('url.href: '+url.href)
  return url.href;
};
function generateRandomString(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charactersLength);
    result += characters.charAt(randomIndex);
  }
  return result;
}

const FormPage = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [zipCode, setZipCode] = useState('');

  const redirectToWebsite = () => {
    localStorage.setItem('firstName', firstName);
    localStorage.setItem('lastName', lastName);
    localStorage.setItem('address', address);
    localStorage.setItem('city', city);
    localStorage.setItem('zipCode', zipCode);


    const url = getVerificationURL();
    console.log('Navigating to: ' + url);
    window.location.href = url;
  };

  const handleFirstNameChange = (e) => {
    setFirstName(e.target.value);
  };

  const handleLastNameChange = (e) => {
    setLastName(e.target.value);
  };

  const handleAddressChange = (e) => {
    setAddress(e.target.value);
  };

  const handleCityChange = (e) => {
    setCity(e.target.value);
  };

  const handleZipCodeChange = (e) => {
    setZipCode(e.target.value);
  };

  return (
<div className="container">
    <div className="customer-app">
      <div className="customer-app-banner">&#169;&nbsp; R-eally Fake Company</div>
      <form className="customer-app-form">
        <div className="mb-3">
          <label htmlFor="firstName" className="form-label">First Name:</label>
          <input
            type="text"
            className="form-control"
            id="firstName"
            name="firstName"
            value={firstName}
            onChange={handleFirstNameChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="lastName" className="form-label">Last Name:</label>
          <input
            type="text"
            className="form-control"
            id="lastName"
            name="lastName"
            value={lastName}
            onChange={handleLastNameChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="Address" className="form-label">Street Address:</label>
          <input
            className="form-control"
            id="address"
            name="address"
            value={address}
            onChange={handleAddressChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="city" className="form-label">City:</label>
          <input
            className="form-control"
            id="city"
            name="city"
            value={city}
            onChange={handleCityChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="city" className="form-label">Zip Code:</label>
          <input
            className="form-control"
            id="zipCode"
            name="zipCode"
            value={zipCode}
            onChange={handleZipCodeChange}
            required
          />
        </div>

        <button type="button" className="btn btn-primary" onClick={redirectToWebsite}>
          Verify
        </button>
      </form>
    </div>

    <div className="explain">
        <div className="title">
            <i>Powered by</i> CLEAR Web SDK Demo
        </div>
        <div className="subtitle">
            This sample application provides an easy way to run the 
            end-to-end <i>Powered by</i> CLEAR experience.
        </div>
        <ol>
            <li>Fill out the form with test info</li>
            <li>Click "Verify with CLEAR" to conduct a sample verification</li>
            <li>Compare results at the end: your self-attested info vs. info verified by CLEAR.</li>
        </ol>
        <div className="use-common-sense">
            <i>Note</i> - this app is for demo purposes only. All production, partner apps must 
            pass a code review with our team. This protects customers, your company and CLEAR.
        </div>
    </div>
</div>
  );
};

export default FormPage;
