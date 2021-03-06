# COVID-911 : A Covid-19 Tweet Locator

We’re currently flooded with posts from social media about all different aspects of the COVID-19 crisis. It’s hard to separate noise from what interests us, or see what people are saying about specific aspects of the situation.

COVID-911 allows a more intelligent search of social media posts, to see what people around you are saying about the aspect of the situation that interests you. It applies natural language processing (NLP) to make this possible, allowing people to find specific types of posts that interest them - either news updates, memes and casual posts, or other types of content.

![illustration](https://user-images.githubusercontent.com/52980739/82765523-5165f580-9e20-11ea-93d2-38faa8ae2871.png)

#### User Interface
* A clean ReactJS interface, including an intelligent search interface and a clickable map with locations of relevant tweets.
#### Browsing tweets
* Uses Twitter user location data with Google geolocation API.
#### Searching tweets by detected topic
* Uses semi-supervised topic modeling (hybrid LDA & clustered word embedding approach).
#### Searching tweets by detected account type
* Uses Random Forest classifier on hand-engineered features + bag-of-words model, applied to usernames and user profile descriptions.

## Frontend

### Requirements

OS X
* brew install npm
* npm install
* npm install -g create-react-app

Available Scripts

In the project directory, you can run:

#### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

#### `npm test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

#### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

#### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Backend

### Requirements

* Python3 + pip

* Install service requirements with **pip3 install -r requirements.txt**.

* Unzip data/formality_model.p.zip to data/formality_model.p

### Running

~~~~
export FLASK_APP=service.service.py
flask run
~~~~

Served at 127.0.0.1:5000

### Endpoints

* GET */test*: Returns hello world text
* POST */search*: Run search (TODO)
