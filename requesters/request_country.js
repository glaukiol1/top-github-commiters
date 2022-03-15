const { graphql } = require("@octokit/graphql");
const {getHeader, getQuery} = require("./build_request");

class List {
    constructor() {
        this.list = []
    }

    add(node) {
        const contribs = node.contributionsCollection.contributionCalendar.totalContributions
        node.contribs = contribs
    
        for (let i = 0; i < this.list.length; i++) {
            const current_node = this.list[i]
            const dc = current_node.contribs

            if (dc <= contribs) {
                this.list.splice(i,0,node)
                return
            }
        } 
        if (this.list.length === 0) {
            this.list.push(node)
            return
        }
        this.list.push(node)
    }
}

async function getCountryList(country, seconds, authkey) {
    const list = new List()
    const start_time = Date.now();
    var current_cursor;
    var done = false;
    while (!done) {
        try {
            await request(country,authkey, current_cursor).then(
                dat => {
                    console.log(`==== ${dat.search.edges.length} entries ; ${dat.search.pageInfo.endCursor} ====`)
                    dat.search.edges.forEach(s => {
                        if (s.node["__typename"]==="User") {
                            var spaces = 80-`${country}: {${s.node.login}}`.length
                            if (spaces<0) {
                                while(spaces<1) {spaces++}
                            }
                            console.log(`${country}: {${s.node.login}}${" ".repeat(spaces)}${s.node.followers.totalCount} | Second: ${Math.ceil( (Date.now()-start_time)/1000 )}/${seconds} | RateLimit: ${dat.rateLimit.cost} / ${dat.rateLimit.remaining}`)
                            list.add(s.node) 
                        }
                        
                    })
                    if ( seconds !== -1 && (Date.now() - start_time)/1000 >= seconds) {
                        console.log("Done with time!")
                        done = true
                    }
                    if (dat.search.pageInfo.hasNextPage) {
                        current_cursor = dat.search.pageInfo.endCursor
                    } else {
                        console.log("No next page; done")
                        done = true;
                    }
                }
            )
        } catch (error) {
            console.error("Error "+error)
            await sleep(5000);
        }
        
    }
    return list
}

function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
}

let request = async function (location, AUTH_KEY, cursor) {
    const graphqlWithAuth = graphql.defaults(getHeader(AUTH_KEY));
    const resp = graphqlWithAuth(getQuery(location, cursor))
    resp.catch(async error=>{
        // console.log("Error: "+error)
        await sleep(1000*5)
        console.log("Continuing...")
        return
    })
    return resp
}

module.exports = getCountryList