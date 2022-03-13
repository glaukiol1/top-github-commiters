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
async function getCountryList(country, amount, authkey) {
    var data = [];
    var current_cursor;
    var done = false;
    while (!done) {
        await request(country,authkey, current_cursor).then(
            dat => {
                data = data.concat(dat.search.edges)
                dat.search.edges.forEach(s => {
                    // var spaces = 30-`${country}: {${s.node.login}}`.length
                    // var spaces1 = 50-`${country}: {${s.node.login}}${" ".repeat(spaces)}${s.node.contributionsCollection.contributionCalendar.totalContributions}`.length
                    // console.log(`${country}: {${s.node.login}}${" ".repeat(spaces)}${s.node.contributionsCollection.contributionCalendar.totalContributions}${" ".repeat(spaces1)}Followers: ${s.node.followers.totalCount}`)
                    // console.log(s.node.contributionsCollection.contributionCalendar.totalContributions)
                    list.add(s.node)
                })
                if (data.length >= amount) {
                    done = true
                }
                if (dat.search.pageInfo.hasNextPage) {
                    current_cursor = dat.search.pageInfo.endCursor
                } else {
                    done = true;
                }
            }
        )
    }
    return list
}

let request = async function (location, AUTH_KEY, cursor) {
    try{
        const graphqlWithAuth = graphql.defaults(getHeader(AUTH_KEY));
        const response = await graphqlWithAuth(getQuery(location, cursor));
        return response
    } catch (error) {
        console.log(error)
    }
}

module.exports = getCountryList