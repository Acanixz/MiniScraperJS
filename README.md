# MiniScraperJS
 A very simple scraper for your basic extraction necessities.

### SETUP INSTRUCTIONS 
    Running locally:
    1 - Create MiniScraperConfig.json inside the data folder
    Paste the code below there and ajust the settings:

    {
    "timeOffset": 0,
    "URL": "",
    "mutationTarget": "",
    "extractionTarget": "",
    "fileName": "./data/lastExtraction.json"
    }
    
    2 - Install node.js if you haven't yet and to run just use node index.js on any program you like (Visual Studio Code)
    
    Running on a server (Using Heroku as a base for this):
    
    1 - Create the following environment variables in your project's settings:
    SCPR_timeOffset (this is the main one, if this one does not exist, it will run locally)
    SCPR_URL
    SCPR_mutationTarget
    SCPR_extractionTarget
    SCPR_Filename

    2 - Install heroku's native nodejs buildpack
    https://elements.heroku.com/buildpacks/heroku/heroku-buildpack-nodejs

    3 - Install the puppeteer buildpack
    https://elements.heroku.com/buildpacks/jontewks/puppeteer-heroku-buildpack

    Notes:
    - timeOffset is used to ajust the hours in servers that you cannot change timezone

    - timeOffset should always be 0 when running locally (since time is adquired
    from your computer's clock, it should always be correct)

    - mutationTarget is usually a div that the program will watch for child changes

    - extractionTarget is the child from the mutation, you can have multiple classes

    - fileName should be kept as it is, unless you want to change the source code to support
    multiple values/ change path/ change name.
