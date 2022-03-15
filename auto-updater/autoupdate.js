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
const simpleGitPromise = require('simple-git');

function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
}

function pushChanges(country) {
    const c = simpleGitPromise.default(".")
        c.add('.')
        .then(
        (addSuccess) => {
            console.log(addSuccess);
        }, (failedAdd) => {
            console.log('adding files failed');
        });
    c.commit(`Update ${country} | autoupdate.js`)
    .then(
        (successCommit) => {
            console.log(successCommit);
        }, (failed) => {
            console.log('failed commmit'+failed);
    });
    c.push('origin','main')
        .then((success) => {
        console.log('repo successfully pushed');
        },(failed)=> {
        console.log('repo push failed');
    });
}

const run = async (country) => {
    return new Promise(async(resolve,reject)=> {
        console.log(`Starting with country ${country}; waiting 5 seconds before start...\n\n\n`)
        await sleep(5000)
        await getCountryList(country, -1, process.argv[2])
        .then(list=>{
            var lowest_follower_amount = 100*100;
            list.list.forEach(s=>{
                if (s.followers.totalCount < lowest_follower_amount) {lowest_follower_amount = s.followers.totalCount};
            })
            writeToFile(makeMarkdown(list.list,country,lowest_follower_amount), country)
            console.log(`Done with country ${country}, please check if the corresponding file at output/${country}.md has been updated`)
            resolve()
        })
        .catch(error => {
            console.error("Promise Error: "+error)
            reject(error)
        })
    })
    
}


const writeToFile = (data,country) => {
    try {
        fs.writeFileSync(path.join(__dirname, `./output/${country}.md`), data, {encoding: 'utf-8'})
    } catch (error) {
        fs.writeFileSync(path.join(__dirname, `../output/${country}.md`), data, {encoding: 'utf-8'})
    }
}

async function main() {
    for (const country of countries) {
        await run(country)
        // pushChanges(country)
    }
}

// main()
pushChanges("albania")