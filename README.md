# Angular Events Chatbot

A chatbot that provides you some interesting locations in your neighborhood. 

You are bored and want to do something?

> Just ask the bot:
<a href="https://events-chatbot.firebaseapp.com/" target="_blank">https://events-chatbot.firebaseapp.com</a>

## Components

<p align="center">
    <img src="./images/components.png" alt="components" width="700px"/>
</p>

## Use cases
You can ask the bot multiple questions and he will react properly. 

Possible questions you can ask the bot (only German):

- "Wie kannst du mir helfen?"
- "Wer bist du?"
- "Was kann ich heute tun?"
- "Was schlägst du mir vor?"

or more precisely:

- "Ich will Pizza essen gehen"
- "Ich will in Karlsruhe Pizza essen gehen"

be kind:

- "Danke schön"
- "Du bist der Beste"

make smalltalk:

- "Wie geht es dir?"
- "Wie heißt du?"

or send smileys:

- ":)"
- "xD"
- "lol"

or where you want to search the locations:

- "Ich wohne in Karlsruhe"
- "Karlsruhe"

and it is even possible to let the bot find out your current position:

<img src="./images/get_my_location.gif" alt="get my location" width="350px">

#### What should I do with a selected location?

Save your favored location:

- "Favorisiere das"
- "Merke dir diesen Ort"

Show you favored locations:

- "Zeige meine Favoriten"
- "Was sind meine Favoriten?"

Remove favored location:

- "Entferne das aus den Favoriten"
- "Lösche diesen Favoriten"

## Screenshots

<p align="center">
    <img src="./images/screenshot_01.png" alt="get my location" width="30%">
    <img src="./images/screenshot_02.png" alt="get my location" width="30%">
    <img src="./images/screenshot_03.png" alt="get my location" width="30%">
</p>


## Architecture

### Angular
The chatbot is based on the [Angular Framework](https://angular.io/). It was created and implemented with the help of [Angular CLI](https://cli.angular.io/) and [Angular Material](https://material.angular.io/).

### Dialogflow
To understand what the user is actually saying the bot sends the input message to [Dialogflow](https://dialogflow.com/). Dialogflow helps the bot to create an interactive and dynamic conversation with the user. Next it enables the bot to behave natural, i.e. the bot answers differently to same questions. The bot also provides the user with suggestions for possible next interaction steps.

### Firebase Functions
The chatbot uses [Firebase Functions](https://firebase.google.com/docs/functions/) for the backend functionality. The backend is very simple and only used as a proxy for the Google Places API to avoid CORS issues.

The functions provide some APIs to call the Google Places APIs to get the requested information about locations. The [Express](https://expressjs.com/) library is used here.

### HTML5 Web Storage
The HTML5 local storage is used to provide a straightforward usage of the bot without many barriers such as authentication or user sessions. Basically the following information is cached in the local storage:

- Favored locations
- Design theme

### Overview

The following image gives a short overview of the underlying technologies of the chatbot:

<p align="center">    
    <img src="images/architecture.png" alt="architecture image" width="700px"/>
</p>

## Development

### Node.js
Install [Node.js](https://nodejs.org/en/) on your machine.

### Angular
The bot is implemented as an Angular web application. To start the application navigate into the `bot-client`-directory and run the following commands in your terminal:

Install the required modules:
```
npm install
```

Run the application:
```
npm start
```

This command creates a small development server which is running in your browser: [http://localhost:4200/](http://localhost:4200/).


#### Angular CLI
You can install Angular CLI globally with this command:

```
npm install @angular/cli --global
```

Then you can start the application with `ng serve --open`.

Finally you also want to deploy the application on a production server. Therefore you have to type the following command in your terminal:

```
npm run build
```

This creates a `dist`-folder containing the bundled files that can be uploaded to a web server.

### Dialogflow
This application is so configured that is uses a specific token to get access to the dialogflow project. The token cannot be used for other projects.

Tokens can be found in the `/bot-client/src/environments`-directory in the `environment.ts`-file.

### Google API
For the Google Places API is an authentication token required. You have to [create your own access key](https://developers.google.com/maps/documentation/javascript/get-api-key?hl=de). Create a `.env`-file in the `functions`-directory and insert the token like this:

```
GOOGLE_KEY=MY_ACCESS_TOKEN
```

### Firebase
The functions and the hosting can be simulated during development. Navigate into the `functions`-folder and open a terminal there.

Install packages:

```
npm install
```

```
npm install firebase-tools -g
```

Setup firebase:

```
firebase login
```

```
firebase use --add
```

Start simulation of functions:

```
npm run serve
```

Deploy the project:

```
firebase deploy
```

---

*This document was written by Philipp Kief in 2018*