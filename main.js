const makeMarkdown = require("./markdown");
const getCountryList = require("./requesters/request_country");
const fs = require('fs');
const path = require("path");

const country = "albania"

getCountryList(country, -1, process.argv[2])
    .then(list=>{
        fs.writeFileSync(path.join(__dirname,`/output/${country}.md`), makeMarkdown(list.list,country), {encoding: 'utf-8'})
    })