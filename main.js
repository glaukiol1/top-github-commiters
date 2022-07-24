const makeMarkdown = require("./markdown");
const getCountryList = require("./requesters/request_country");
const fs = require('fs');
const path = require("path");

var country = ["paraguay"]
const seconds_to_grab_data = parseInt(process.argv[3]) || -1; // change this to the time you want to grab data; use -1 if you want to grab until there is none left
// i recommend upping this more if your are in a very big country; something between 10-30 mintues; if you are in a very small country; set it to -1; where it will get all the users.

if (process.argv[4]) {
    country = process.argv[4].split(',')
}

console.log(`Starting with time: ${seconds_to_grab_data} & country: ${country}`)

getCountryList(country, seconds_to_grab_data, process.argv[2])
    .then(list=>{
        var lowest_follower_amount = 100*100;
        list.list.forEach(s=>{
            if (s.followers.totalCount < lowest_follower_amount) {lowest_follower_amount = s.followers.totalCount};
        })
        fs.writeFileSync(path.join(__dirname,`/output/${country}.md`), makeMarkdown(list.list,country,lowest_follower_amount), {encoding: 'utf-8'})
    })
    .catch(error => {
        console.error("Promise Error: "+error)
    })