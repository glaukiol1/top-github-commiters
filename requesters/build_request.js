function getHeader(AUTH_KEY) {
    return {
        headers: {
            Authorization: `bearer ${AUTH_KEY}`
        }
    }
}

function getQuery(location, cursor) {
    if (!cursor) {
        return { query: `query {
            search(type: USER, query:"location:${location} sort:followers-desc", first:${10}) {
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
          }`};
    } else {
        return { query: `query {
            search(type: USER, query:"location:${location} sort:followers-desc", first:${10}, after:"${cursor}") {
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
          }`};
    }
}

module.exports = { getQuery, getHeader }