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

██░ ██  ▒█████   ▄▄▄       ██▀███  ▓█████▄ ▓█████  ██▀███  
▓██░ ██▒▒██▒  ██▒▒████▄    ▓██ ▒ ██▒▒██▀ ██▌▓█   ▀ ▓██ ▒ ██▒
▒██▀▀██░▒██░  ██▒▒██  ▀█▄  ▓██ ░▄█ ▒░██   █▌▒███   ▓██ ░▄█ ▒
░▓█ ░██ ▒██   ██░░██▄▄▄▄██ ▒██▀▀█▄  ░▓█▄   ▌▒▓█  ▄ ▒██▀▀█▄  
░▓█▒░██▓░ ████▓▒░ ▓█   ▓██▒░██▓ ▒██▒░▒████▓ ░▒████▒░██▓ ▒██▒
 ▒ ░░▒░▒░ ▒░▒░▒░  ▒▒   ▓▒█░░ ▒▓ ░▒▓░ ▒▒▓  ▒ ░░ ▒░ ░░ ▒▓ ░▒▓░
 ▒ ░▒░ ░  ░ ▒ ▒░   ▒   ▒▒ ░  ░▒ ░ ▒░ ░ ▒  ▒  ░ ░  ░  ░▒ ░ ▒░
 ░  ░░ ░░ ░ ░ ▒    ░   ▒     ░░   ░  ░ ░  ░    ░     ░░   ░ 
 ░  ░  ░    ░ ░        ░  ░   ░        ░       ░  ░   ░     
                                                        
Welcome to the Hoarder CLI!
What would you like to do?
`)

function askForAction() {
        const action = prompt(`Actions: [o]pen a website, [s]ave a website or [q]uit > `);
        switch (action) {
            case 'o':
                openAWebsite()
                break;
    
            case 's':
                saveAWebsite()
                break;
            
            case 'q':
                process.exit()
                break;
    
        
            default:
                askForAction()
                break;
        }
}


function saveAWebsite() {
    site.url = prompt('Paste a link to a website here: > ');
    site.name = prompt('Name of the file it will be stored in > ')
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
    askForAction()
}

askForAction()
