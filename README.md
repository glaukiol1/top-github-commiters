# top-github-commiters

See your countries leaderboard for most GitHub commits!

## 🤔 Why am I not here?

One of the reasons might be that you dont have your country in your `location` part of your GitHub profile. Another might be that the list might not be updated to the latest time, to update it, look futher down this document.

## 📕 How do I add my country?

Its simple to add a country;

- Fork this repo.
- Clone it locally.
- Edit `main.js`; change the country (make sure its all lower case, change spaces with _ character)
- Change the call to `getCountryList` in `main.js`, the second argument is how many users to search for. Users are sorted by followers, so if you set the second argument to `1000`, you will see the 1000 people with most followers for that region, not most contributions. If you live in a big country, I recommend to set this anywhere from 5 to 1000, depeing on your population.
- CREATE THE FILE FIRST!!! You will lose the data you got if you dont create the file first. The file must be named the same as the `country` variable in `main.js`. Example `output/country.md`.
- Create a access token.
- Run the script with the access token as a command line option; Example; `node main.js ghp_9uhjpIgozqmbuM5M1b***********`
- Wait until the script finishes, you will see the names and how many followers you are on right now in the command line.