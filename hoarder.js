const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const fs = require('fs');
const https = require('https');
const nodePath = require('path')
const crypto = require('crypto')
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('db.sqlite');
db.run('CREATE TABLE IF NOT EXISTS websites(url text, name text, tags text)');
async function downloadSite(url, name) {
    const domain = url.match(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img)[0]

    try {
        const res = await fetch(url);
        const responseText = await res.text()
        const dom = new JSDOM(responseText);

        const bodyElements = dom.window.document.getElementsByTagName("html");
        const bodyElement = bodyElements[0];
        const images = bodyElement.querySelectorAll('img[src]')
        if (images && images.length) images.forEach(image => {
            const hash = crypto.createHash('md5').update(image.src).digest('hex');
            const imgSrc = image.src
            let extension
            if (image.src) {
                extension = nodePath.extname(imgSrc).match(/.[a-z]+/)
            }
            if (extension) {
                extension = extension[0]
            }
             /*
            if (bodyElement.querySelector(`[src="${imgSrc}"]`) && bodyElement.querySelector(`[src="${imgSrc}"]`).src.startsWith('/')) {
      //          bodyElement.querySelector(`[src="${imgSrc}"]`).setAttribute('trueSrc', 'https:' + imgSrc)
                if (bodyElement.querySelector(`[src="${imgSrc}"]`).src.startsWith('//')) {
                    console.log('https:' + imgSrc);
                    bodyElement.querySelector(`[src="${imgSrc}"]`).setAttribute('trueSrc', 'https:' + imgSrc)
                    bodyElement.querySelector(`[src="${imgSrc}"]`).setAttribute('hash', crypto.createHash('md5').update('https:' + image.src).digest('hex'))

                } else if (bodyElement.querySelector(`[src="${imgSrc}"]`).src.startsWith('h')) {
                    console.log('123');
                    bodyElement.querySelector(`[src="${imgSrc}"]`).setAttribute('trueSrc', imgSrc)
                    bodyElement.querySelector(`[src="${imgSrc}"]`).setAttribute('hash', hash)

                } else {
                    console.log('asd');
                    bodyElement.querySelector(`[src="${imgSrc}"]`).setAttribute('trueSrc', imgSrc)
                    bodyElement.querySelector(`[src="${imgSrc}"]`).setAttribute('hash', hash)

                }

                bodyElement.querySelector(`[src="${imgSrc}"]`).src = './images/' + hash + extension 

            } else {
                bodyElement.querySelector(`[src="${imgSrc}"]`).setAttribute('hash', hash)
                bodyElement.querySelector(`[src="${imgSrc}"]`).setAttribute('trueSrc', imgSrc)


                bodyElement.querySelector(`[src="${imgSrc}"]`).src = './images/' + hash + extension 
    
            } */

            if (extension && imgSrc) {
                if (imgSrc.startsWith('//')) {
                    bodyElement.querySelector(`[src="${imgSrc}"]`).setAttribute('trueSrc', 'https:' + imgSrc)
                    bodyElement.querySelector(`[src="${imgSrc}"]`).setAttribute('hash', hash)
                    bodyElement.querySelector(`[src="${imgSrc}"]`).src = './images/' + hash + extension 
        
                } else {
                    bodyElement.querySelector(`[src="${imgSrc}"]`).setAttribute('trueSrc', imgSrc)
                    bodyElement.querySelector(`[src="${imgSrc}"]`).setAttribute('hash', hash)
                    bodyElement.querySelector(`[src="${imgSrc}"]`).src = './images/' + hash + extension 
                }
            }
            





        });

        

        const styles = bodyElement.querySelectorAll('link[rel="stylesheet"]')
        if (styles && styles.length) {
            styles.forEach(style => {
                const styleSrc = style.href
                console.log(styleSrc);
                let extension = nodePath.extname(styleSrc).match(/.[a-z]+/)
                if (extension) {
                    extension = extension[0]
                }
                const hash = crypto.createHash('md5').update(style.href).digest('hex');
    
                if (extension) {
                    bodyElement.querySelector(`[href="${styleSrc}"]`).removeAttribute('crossorigin')
                    if (bodyElement.querySelector(`[href="${styleSrc}"]`) && bodyElement.querySelector(`[href="${styleSrc}"]`).href.startsWith('/')) {
                        bodyElement.querySelector(`[href="${styleSrc}"]`).setAttribute('hash', hash)
                  //      bodyElement.querySelector(`[href="${styleSrc}"]`).href = domain + bodyElement.querySelector(`[href="${styleSrc}"]`).href
                        bodyElement.querySelector(`[href="${styleSrc}"]`).setAttribute('trueHref', domain + styleSrc)
                        bodyElement.querySelector(`[href="${styleSrc}"]`).href = './styles/' + hash + extension 
        
                    //    bodyElement.querySelector(`[src="${styleSrc}"]`).href = './styles/' + hash + extension 
        
                    } else if (bodyElement.querySelector(`[href="${styleSrc}"]`).href.startsWith('h')) {
                        bodyElement.querySelector(`[href="${styleSrc}"]`).setAttribute('hash', hash)
                        bodyElement.querySelector(`[href="${styleSrc}"]`).setAttribute('trueHref', styleSrc)
                        bodyElement.querySelector(`[href="${styleSrc}"]`).href = './styles/' + hash + extension 
        
                    } else {
                        bodyElement.querySelector(`[href="${styleSrc}"]`).setAttribute('hash', hash)
                        bodyElement.querySelector(`[href="${styleSrc}"]`).setAttribute('trueHref', domain + '/' + styleSrc)
                        bodyElement.querySelector(`[href="${styleSrc}"]`).href = './styles/' + hash + extension 
                    } 
                }
                

            });
        }


        const links = bodyElement.querySelectorAll('a[href]')
        if (links && typeof links !== null) {
            links.forEach(link => {
                // weird
                if (!link.href) bodyElement.querySelector(`[href="${link.href}"]`).href = domain + bodyElement.querySelector(`[href="${link.href}"]`).href
            })
        }


        saveFile(`./sites/${name}.html`, bodyElement.innerHTML, name, url)
      } catch (err) {
        console.log(`errorrr ${err}`)
      }
}

function saveFile(path, content, name, url) {
    db.run(`INSERT INTO websites(url, name) VALUES (?,?)`, [url, name], function(err) {
        if (err) {
          return console.log(err.message);
        }
    })

      fs.writeFile(path, content, function(err) {
        if (err) {
            return console.log(err);
        }
        console.log("The file was saved!");
        saveFiles(content)
    })
}

function saveFiles(code) {
    const dom = new JSDOM(code);
    const images = dom.window.document.querySelectorAll('img[src]')
    if (images) {
        images.forEach(img => {
            downloadHash(img.getAttribute('trueSrc'), 'images', img.getAttribute('hash'))
        })
    }

    const styles = dom.window.document.querySelectorAll('link[rel="stylesheet"]')
    if (styles) {
        styles.forEach(style => {
            downloadHash(style.getAttribute('trueHref'), 'styles', style.getAttribute('hash'))
        })
    }
}

function downloadHash(thing, dir, hash) {
    try {
        https
        .get(thing, res => {

            if (!hash) {
                hash = crypto.createHash('md5').update(thing).digest('hex')
            }
    
            const extension = nodePath.extname(thing).match(/.[a-z]+/)[0]
            const path = `${__dirname}/sites/${dir}/${hash}${extension}`; 
            const file = fs.createWriteStream(path)
            res.pipe(file)
      
            file.on('finish', () => {
            file.close()
          })
        })
        .on('error', err => {
          console.log('Error: ', err.message)
        })
    } catch (error) {
        console.log(error);
    }

}


module.exports = { downloadSite } 