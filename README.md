# Reloaded Astrology website ( React Project ) 

 ## Requirement

Below requirement must be full fill in order to run the project successfully : 
 
- React version requires 18.2.0 
- Node version requires v16.17.1
- NPM version requires v8.15.0

## Installation
Note: Go to front - project root directory

1. Clone the repository:

```bash
git clone https://git.devtechnosys.tech/pramod_jangid/reloaded-astrology-frontend.git
```

2. Install the dependencies using NPM:

```bash
cd your-project
npm i -f
```

3. Please run below command to create enviroment files. 

```bash
cp environments/.env.example environments/development.env
cp environments/.env.example environments/production.env
cp environments/.env.example environments/staging.env
```

4. to run the project, Please follow below steps

```bash
npm start
```
5. To create a production build, Follow bellow steps (Please make sure that environments/production.env file have the correct data according to the production server)

```bash
cd project-root-dir
npm run build
```

You can now access the application by visiting http://your-ip-address:3000 in your browser.

## Usage 

To run the admin panel, Please follow below steps.  

- Run the Admin Panel url at browser: http://your-ip-address:3000/admin
- Enter below login details to enter into admin 

    - Username : reloadastrology@mailinator.com
    - Password : Dev@1234
    
## License
Reload Astrology App