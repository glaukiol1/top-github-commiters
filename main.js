const getCountryList = require("./requesters/request_country");

getCountryList("albania", 20, "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")
    .then(list=>{
        list.list.forEach(s=>{
            console.log(s.contribs)
        })
    })