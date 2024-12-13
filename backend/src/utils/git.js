const axios = require("axios");

const getGitIssue = async (url) => {
    const apiUrl = url.replace(/^https:\/\/(www\.)?github\.com\//, "https://api.github.com/repos/");
    console.log(apiUrl);

    let data = await axios.get(apiUrl);
    let res = data.data;

    console.log(data);
    console.log(res);

    console.log("Title: ",  res.title);
    console.log("Body: ", res.body);

    return {
        title : res.title,
        body : res.body,
        username : res.user.login,
        avatarurl : res.user.avatar_url
    }
}

module.exports = getGitIssue