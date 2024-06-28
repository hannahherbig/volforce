# SDVX Volforce Calculator

This is a site to calculate your [Volforce rating](https://bemaniwiki.com/index.php?SOUND+VOLTEX+EXCEED+GEAR/VOLFORCE) in the same way SDVX does. It's useful to keep track of your scores from different game servers (eAmuse and private servers).

You can drag a csv exported from the eAmuse website onto the table and it will import it.

It saves data using local storage, so you can close the page and everything you entered will still be there on the next load.

## Build Instructions

Building and running the tracker locally requires you to install [Node 20](https://nodejs.org/en/download/) and [Git](https://git-scm.com/downloads).

Clone the repository by running the following in a command prompt:

```bash
git clone https://github.com/hannahherbig/volforce.git
```

Navigate to the `volforce` folder and install dependencies:

```bash
cd volforce && npm install
```

You can then build and serve the tracker application:

```bash
npm start
```

After the server starts, you can go to [localhost:3000](http://localhost:3000/) to open the tracker.
