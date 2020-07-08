# art4bid

A fullstack dynamic web application for artists or photographers who want to promote or sell their work through a social network bidding system.

## Live Demo
Try the application live at [[http://art4bid.seongkevinlee.com](http://art4bid.seongkevinlee.com)]

## Technologies Used
* JavaScript (ES5, ES6)
* HTML5
* CSS3
* React
* Bootstrap 4
* react-spring
* Node.js
* PostgreSQL
* Express
* Webpack 4
* Babel
* AWS EC2

## Features
* User can login with username
* User can view search page
* User can search for posts based on location
* User can view specific posts
* User can place a bid on a post
* User can send a private message to seller
* User can see list of all private messages
* User can create a new post
* User can edit an existing post
* User can add a post to their bids list
* User can add a post to their watch-list
* User can view profile
* User can edit profile

## Preview
![user-can-login-and-search](https://github.com/seongkevinlee/art4bid/blob/master/user-can-login-and-search.gif?raw=true)
![user-view-post-and-submit-bid](https://github.com/seongkevinlee/art4bid/blob/master/user-view-post-and-submit-bid.gif?raw=true)
![user-can-send-message](https://github.com/seongkevinlee/art4bid/blob/master/user-can-send-message.gif?raw=true)
![user-can-create-post](https://github.com/seongkevinlee/art4bid/blob/master/user-can-create-post.gif?raw=true)
![user-can-view-and-edit-profile](https://github.com/seongkevinlee/art4bid/blob/master/user-can-view-and-edit-profile.gif?raw=true)

## Development
### System Requirements
* Node.js 10 or higher
* NPM 6 or higher
* PostgreSQL

### Getting Started
1. Clone the respository
```
git clone https://github.com/seongkevinlee/art4bid.git
cd art4bid
```
2. Install dependencies with NPM
```
npm install
```
3. Import the example database to PostgreSQL
```
npm run db:import
```
4. Start the PostgreSQL database
```
sudo service postgresql start
```
5. Start the project. Once started you can view the application by opening http://localhost:3000 in your browser.
```
npm run dev
```
