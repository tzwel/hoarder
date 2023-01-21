const { downloadSite } = require('./hoarder')
const prompt = require('prompt-sync')();

let site = {
    url: '',
    name: ''
}


site.url = prompt('Wklej linka (w prostej postaci prosze, z https) \n > ');

site.name = prompt('Podaj nazwe stronki ktora chcesz pobrac (to dla ciebie) \n > ')


downloadSite(site.url, site.name)

