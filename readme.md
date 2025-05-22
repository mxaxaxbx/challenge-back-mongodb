# Backend Base TypeScript

Backend base made in **Typescript** and **node js**

---

Create **.env** file with the following
* MONGODB_URI= (connection string)
* PORT=
* JWT_SECRET= (secret key to sign token)

## Install dependencies

```
npm install
```

## Run server with reloading

```
npm run dev
```

## build project

```
npm run build
```

## populate database

once the project has been started

```
Connecting to MongoDB...
Connected to MongoDB
SERVER started in port [PORT]
```

run the following request
```
curl --location --request POST '127.0.0.1:8080/api/poblate'
```

## endpoints documentation

open the file backend-challenge.postman_collection.json to check examples of cunsumption

## Using google cloud run

This project is already in Google cloud run. So you can use the following url in postman directly to test and qualify

[https://challenge-backend-290571698035.us-east1.run.app](https://challenge-backend-290571698035.us-east1.run.app)
