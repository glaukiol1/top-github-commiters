const countries = [
    ["albania"],
    ["kosovo"],
    ["macedonia"],
    ["india"],
    ["canada"],
    ["ukraine"],
    ["usa","united+states","united+states+of+america","america"],
    ["italy"],
    ["greece"],
    ["afghanistan"],
    ["germany"],
    ["netherlands"],
    ["france"],
    ["algeria"],
    ["andorra", "andorra-la-vella", "santa-coloma", "la-margineda", "engolasters"],
    ["angola","luanda","cabinda","huambo","lubango","kuito","malanje","lobito,benguela"],
    ["argentina"],
    ["addis+ababa", "ethiopia"],
    ["azerbaijan"],
    ["sofia,bulgaria"],
    ["bogor", "jakarta", "indonesia"]
]

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const makeMarkdown = require('../markdown');
const getCountryList = require('../requesters/request_country');

function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
}

function pushChanges(country) {
    return new Promise((resolve,reject)=>{
        const d = exec("sh /Users/glaukiollupo/Projects/top-github-commiters/auto-updater/push.sh "+country)
        d.stdout.on('data', (dat)=>{
            console.log(dat)
        })
        d.stderr.on('data', (dat)=>{
            console.error(dat)
        })
        d.on('exit', (code) => {
            if (code == 0) {resolve()}
            else {reject()}
        })
    })
    
    
}

const run = async (country) => {
    return new Promise(async(resolve,reject)=> {
        console.log(`Starting with country ${country}\n\n\n`)
        
        const n = exec(`node /Users/glaukiollupo/Projects/top-github-commiters/main.js ${process.argv[2]} -1 ${country}`)

        n.stdout.on('data', (d)=>{console.log(d)})
        n.stderr.on('data', (d)=>{console.log(d)})

        n.on('exit', async (code)=>{
            if (code == 0) {
                await pushChanges(country)
                console.log('Done!')
                resolve()
            } else {
                reject("Non-0 status code")
            }
        })

    })
    
}

async function main() {
    var i = 0;
    for (const country of countries) {
        if (i!=0) {
            console.log("Waiting 30 seconds before start... (due to ratelimit)")
            await sleep(30000)
        }
        await run(country)
        i=i+1
    }
}

main()