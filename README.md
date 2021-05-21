# Dual Commander

Document browser featuring dual panes.


## Requirements

The core requirements for this project are NodeJs, npm (node package manager) and webpack:

* [nodejs](https://nodejs.org/en/) >= 10.24
* [npm](https://docs.npmjs.com/about-npm) >= 7.8
* [webpack](https://webpack.js.org/) >= 5.30.0

## Installation

Install all nodejs dependent packages:

    $ npm i  # looks in package.json and installs dependencies


## Playground

In `playground/` folder there is a [flask](https://flask.palletsprojects.com/en/2.0.x/) based application used as playground.
In order to setup and run playground, use following commands:

    $ cd playground
    $ virtualenv .venv -p /usr/bin/python3.7
    $ source .venv/bin/activate
    $ pip install -r requirements.txt
    $ cd ..
    $ make run

Playground flask app provides couple of extra features to simulate more
realistic scenarios - like slower server responses.

To slow down all server side responses with two seconds, start playground using
following command:

    $ cd playground
    $ python index.py --delay 2  # delays all server side responses with 2 seconds

To slow down server side responses with one second AND disable browser's assets cache
(browsers try to very hard to cache static assets) use command:

    $ cd playground
    $ python index.py --delay 1 --no-cache


Start playground on port 5002:

    $ cd playground
    $ python index.py --port 5002

For all options:

    $ cd playground
    $ python index.py --help

