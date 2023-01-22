const { downloadSite } = require('./hoarder')
const prompt = require('prompt-sync')();
const fs = require('fs');
const open = require('open');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('db.sqlite');

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
    db.all("select * from websites", async function(err, rows) {  

        for (let index = 0; index < rows.length; index++) {
            console.log(`[${index}] ${rows[index].name} (${rows[index].url})`)
        }
        const indexChosen = prompt('(number or a name) > ')
        if (!/\d+/.test(indexChosen)) {
            const result = rows.filter(obj => {
                return obj.name === indexChosen
            })
            await open(__dirname + '/sites/' + indexChosen + '.html')
            askForAction()
        } else {
            await open(__dirname + '/sites/' + rows[indexChosen].name + '.html')
            askForAction()
        }
    })
}

askForAction()
