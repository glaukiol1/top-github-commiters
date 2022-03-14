const makeMarkdown = (list, country, min_followers) => {
    var total = `
# Ranking for ${country}

You need at least \`${min_followers}\` followers to be on this list. This list was last updated at \`${Date()}\` with a total amount of users at \`${list.length}\`

Raking is based on Contributions.

| Rank | Name | Followers | Contribs | Avatar |
|-------|-------|--------|---------|----------|`
    var i = 1;
    list.forEach(node => {
        total+=`\n| #${i} | ${node.name} | ${node.followers.totalCount} | ${node.contribs} | ![](${node.avatarUrl})|`
        i=i+1
    })
    return total
}

module.exports = makeMarkdown