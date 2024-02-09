# Sample App (Web SDK)
_For those that prefer to learn by doing_ 

This app provides an easy way to run the end-to-end _Powered by_ CLEAR experience and learn how to build your own integration. 
### Tech Stack
[![React][React.js]][React-url] [![Express][Express.js]][Express-url] [![Docker][Dockerlogo]][Docker-url]

There are two parts to this WebApp: 
- A React frontend. 
- An ExpressJS backend. 
- Built using Docker Compose
- Runs on Docker, to simplify dependency management. 

## Scenario
The _Powered by_ CLEAR Web SDK offers a seamless way for partners to integrate our products into browser-based web applications. These applications are typically designed to verify a user’s identity and remove friction from end-user onboarding, check-in, & age verification experiences. 

This example presents a fake company (R-eally Fake Company) and a form for their end-users. The form asks the user to provide a few pieces of self-attested information, then click "Verify", leading the user to CLEAR's verfication experience. CLEAR verifies the user with high-trust methods like "taking a selfie" and scanning state-issued IDs. 

### Data Matching
Once verified, the user is returned to the R-eally Fake app, where the callback screen shows both sets of data, side-by-side. This represents a common use case for _Powered by_ CLEAR partners.

![ghflow-new](https://github.com/poweredbyclear/Demo-Verify-React-Web/assets/111535748/305c1e4a-9a4d-48a2-8950-b05e1eb08636)

# Set Up 
### Configure CLEAR

Work with your CLEAR account team to get your **client_id**, **client_secret**, and other environment variables. Ensure your config can callback to the correct **redirectURI**. If you are running on localhost, the **redirect_uri** must include `http://localhost:3000/callback` or `http://localhost:3000/*` 

Update `.env` file (lives in the base project directory). Input your `REACT_APP_CLIENT_ID`, `REACT_APP_SCOPE`, `CLIENT_SECRET`, `API_KEY`, `CLEAR_AUTH_URL` and `CLEAR_BACKEND_SERVICE`

### Running the Buildscript
For developers using MacOS, you can build the project and run it automatically with the file: **mac_build.sh**. Just navigate to the folder and run the following command: 
```
./mac_build.sh
```

### Manual Setup
You can also choose to manually run this project. Before getting started, ensure that you have the Docker installed on your machine
- Docker: [Installation Guide](https://docs.docker.com/install/)

Docker Desktop is an additional UI tool that is free for individual users but needs a paid license for enterprises. If you choose to install Desktop Desktop, Docker Compose comes included. 
- Docker Desktop: [Installation Guide](https://www.docker.com/products/docker-desktop/)

If you choose not to install Docker Desktop, you can install Docker Compose and Colima
- Docker Compose: [Installation Guide](https://docs.docker.com/compose/install/)
- Colima: [Installation Guide](https://github.com/abiosoft/colima)

#### Run The App
_Execute locally (localhost:3000)_

1. Clone the repository 
   ```sh
   git clone https://github.com/poweredbyclear/Demo-Verify-React-Web.git
   ```
   

2. Navigate into the project directory:
   ```sh
   cd Demo-Verify-React-Web
   ```

3. Build and run the project using Docker Compose:
   ```sh
   docker-compose up --build
   ```
   
This command will build the Docker images and start the containers defined in the `docker-compose.yml` file.

4. Go to `localhost:3000` on your browser to get started

5. **For the best experience**, open Developer Tools (right click -> inspect) and simulate a mobile viewport with the _"device toolbar"_.

![toolbar](https://github.com/unrestrictedidentity/Demo-App-React-ExpressJS/assets/111535748/bf75c48e-16dc-4bd2-b1c9-0db0de8b9625)

- https://developer.chrome.com/docs/devtools/device-mode/
- https://firefox-source-docs.mozilla.org/devtools-user/responsive_design_mode/

[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[Express.js]: https://img.shields.io/badge/express.js-4A4A55?style=for-the-badge&logo=express&logoColor=4FC08D
[Express-url]: https://expressjs.com/
[Dockerlogo]: https://img.shields.io/badge/docker-20232A?style=for-the-badge&logo=docker&logoColor=61DAFB
[Docker-url]: [https://expressjs.com/](https://docs.docker.com)https://docs.docker.com


