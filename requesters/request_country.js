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

const list = new List()
async function getCountryList(country, seconds, authkey) {
    const start_time = Date.now();
    var current_cursor;
    var done = false;
    var errors = 0;
    while (!done) {
        try {
            await request(country,authkey, current_cursor).then(
                dat => {
                    dat.search.edges.forEach(s => {
                        if (s.node["__typename"]==="User") {
                            var spaces = 100-`${country}: {${s.node.login}}`.length
                            console.log(`${country}: {${s.node.login}}${" ".repeat(spaces)}${s.node.followers.totalCount} | Second: ${Math.ceil( (Date.now()-start_time)/1000 )}/${seconds}`)
                            list.add(s.node) 
                        }
                        
                    })
                    if ( seconds !== -1 && (Date.now() - start_time)/1000 >= seconds) {
                        done = true
                    }
                    if (dat.search.pageInfo.hasNextPage) {
                        current_cursor = dat.search.pageInfo.endCursor
                    } else {
                        done = true;
                    }
                }
            )
        } catch (error) {
            errors=errors+1
            if (errors>=3) {
                break;
            }
            console.error("Error "+errors)
        }
        
    }
    return list
}

let request = async function (location, AUTH_KEY, cursor) {
    try{
        const graphqlWithAuth = graphql.defaults(getHeader(AUTH_KEY));
        const response = await graphqlWithAuth(getQuery(location, cursor))
        return response
    } catch (error) {
        console.log(error)
    }
}

module.exports = getCountryList