const makeMarkdown = (list, country) => {
    var total = `
# Ranking for ${country}
| Rank | Name | Followers | Contribs | Avatar |
|-------|-------|--------|---------|----------|
    `
    var i = 1;
    list.forEach(node => {
        total+=`| #${i} | ${node.name} | ${node.followers.totalCount} | ${node.contribs} | ![](${node.avatarUrl})|\n`
        i=i+1
    })
    return total
}

module.exports = makeMarkdown