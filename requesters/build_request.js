function getHeader(AUTH_KEY) {
    return {
        headers: {
            Authorization: `bearer ${AUTH_KEY}`,
            "Keep-Alive": "timeout=100000 max=1500000"
        }
    }
}

function getQuery(_location, cursor) {
    var location = "";
    _location.forEach(s=>{
      location+=`location:${s} `
    })
    if (!cursor) {
        return { query: `query {
            search(type: USER, query:"${location} sort:followers-desc", first:${5}) {
              edges {
                node {
                  __typename
                  ... on User {
                    login,
                    avatarUrl(size: 72),
                    name,
                    location,
                    company,
                    twitterUsername,
                    followers {
                      totalCount
                    }
                    contributionsCollection {
                      contributionCalendar {
                        totalContributions
                      }
                      restrictedContributionsCount
                    }
                  }
                }
              }
               pageInfo {
                  endCursor
                  hasNextPage
                }
            }
            rateLimit {
              limit
              cost
              remaining
            }
          }`};
    } else {
        return { query: `query {
            search(type: USER, query:"${location} sort:followers-desc", first:${10}, after:"${cursor}") {
              edges {
                node {
                  __typename
                  ... on User {
                    login,
                    avatarUrl(size: 72),
                    name,
                    location,
                    company,
                    twitterUsername,
                    followers {
                      totalCount
                    }
                    contributionsCollection {
                      contributionCalendar {
                        totalContributions
                      }
                      restrictedContributionsCount
                    }
                  }
                }
              }
               pageInfo {
                  endCursor
                  hasNextPage
                }
            }
            rateLimit {
              limit
              cost
              remaining
            }
          }`};
    }
}

module.exports = { getQuery, getHeader }