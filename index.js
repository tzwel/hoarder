const { downloadSite } = require('./hoarder')
const prompt = require('prompt-sync')();
const fs = require('fs');
const open = require('open');

if (!fs.existsSync('./sites/images')){
    fs.mkdirSync('./sites/images', { recursive: true });
    fs.mkdirSync('./sites/styles', { recursive: true });
}

let site = {
    url: '',
    name: ''
}

console.info(`
Welcome to the Hoarder CLI!
What would you like to do?
`)

function askForAction() {
    const action = prompt(`Actions: [O]pen a website or [S]ave a website \n >`);
    switch (action) {
        case 'o':
            openAWebsite()
            break;

        case 's':
            saveAWebsite()
            break;

    
        default:
            askForAction()
            break;
    }
}

askForAction()

function saveAWebsite() {
    site.url = prompt('Paste a link to a website here: \n > ');
    site.name = prompt('Name of the file it will be stored in \n > ')
    downloadSite(site.url, site.name)
}

async function openAWebsite() {
    const availableWebsites = []
    console.info('\n Available websites:')
    fs.readdirSync('./sites').forEach(file => {
        if (file.endsWith('.html')) console.log(`> [${availableWebsites.length}] ${file}`), availableWebsites.push(file)
    });
    const websiteToOpen = availableWebsites[Number(prompt('>'))]
    await open(__dirname + '/sites/' + websiteToOpen)
}