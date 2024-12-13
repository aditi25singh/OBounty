const express = require("express")
const cors = require("cors")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const cookieParser = require("cookie-parser")
const mongoose = require('mongoose')
const axios = require('axios')

const connectDB = require("./db")
const User = require("./models/user")
const Issue = require("./models/issues")
const Solution = require("./models/solutions")
const getGitIssue = require("./utils/git")
const sendEmailForNewSol = require("./utils/email")

const app = express()
const port = 5000

app.use(cors())
app.use(cookieParser())
app.use(express.json())

connectDB();

// post issue
// get issue
// get all issues
// finish-bounty
// add-money
// signup
// signin
// reset password
// oauth-github-callback
// oauth-google-callback

function checkToken(req, res, next) {
    const authToken = req.cookies.token;

    jwt.verify(authToken, process.env.JWT_KEY, (err, data) => {
        if (err) {
            console.log("Error : ", err);
            res.status(403).json({error : "Unauthorized for this endpoint "});
        } else if (data.userId) {
            req.userId = data.userId;
            next();
        }
    })
}

app.get('/api/v1/getissues', async (req, res) => {
    try {
        let issues = await Issue.find({});
            // {
            //     id: 0,
            //     title: "0 Hello world issue",
            //     creator: "lu-zero",
            //     created: "1 year ago",
            //     updated: "4 months ago",
            //     reward: 80,
            //   }

        console.log(issues);

        let rIssues = [];

        for (let i = 0; i < issues.length; i++) {
            let issue = issues[i];
            let id = issue._id;
            let title = issue.issueTitle;
            let desc = issue.issueDescription;
            let reward = issue.amount;
            let url = issue.url;

            const user = await User.findById(issue.user);
            console.log("User info:", user);

            let nIssue = {
                'url' : url,
                'id' : id,
                'title' : title,
                'creator' : user.firstname,
                'description' : desc,
                'reward' : reward,
                'created' : issue.createdAt,
                'updated' : issue.updatedAt,
                'avatar' : user.avatar
            }

            rIssues.push(nIssue);
        }

        console.log(rIssues);

        res.status(200).json({message: rIssues});
    } catch(error) {
        console.log(error)
        res.status(500).json({error: "Internal server error!" });
    }
})

app.post('/api/v1/postissue', checkToken, async (req, res) => {
    try {
        const {url, amount, type} = req.body;

        const {title, body, username, avatarurl} = await getGitIssue(url);

        console.log(title, body);
        
        const issueTitle = title;
        const issueDescription = body;
        const userid = req.userId;

        console.log(userid, url, type);

        const issue = new Issue({user : userid, 
            url : url, 
            issueTitle: issueTitle, 
            issueDescription: issueDescription, 
            amount: amount,
            isOpen: true,
            isBest: type === 'better',
            createdBy: username,
            createdAvatar: avatarurl
        });

        await issue.save();

        console.log("Issue inserted!");

        res.status(200).json({message: 'Issue inserted' });

    } catch(error) {
        console.log(error)
        res.status(500).json({error: "Internal server error!" + error });
    }
})

app.post('/api/v1/signup', async (req, res) => {
    console.log("Recevied signup request", req)
    try {
        const {email, firstname, lastname, password} = req.body;
        const hashedpassword = await bcrypt.hash(password, 10);
        const user = new User({email, firstname, lastname, password: hashedpassword });
        await user.save();
        res.status(200).json({ message: 'Registration successful' });
    } catch(error) {
        console.log(error)
        res.status(500).json({ error: "Internal server error!" });
    }
})

app.post('/api/v1/signin', async (req, res) => {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({'email': email});
        if (!user) {
            return res.status(400).json({error : "User does not exist!", errorcode : 100});
        }

        if (password === null) {
            return res.status(400).json({error: "Login without password not allowed", errorcode: 102});
        }

        const isValid = await user.comparePassword(password);
        if (!isValid) {
            return res.status(400).json({error: "Incorrect Password", errorcode: 101});
        }

        const token = jwt.sign({userId : user._id}, process.env.JWT_KEY, {
            expiresIn : '1 hour'
        });

        console.log("Login successful! " + token);
        return res.status(200).json({ token : token });
    } catch(error) {
        console.log(error)
        res.status(500).json({ error: "Internal server error!" })
    }
})

app.post('/api/v1/pay', checkToken, async (req, res) => {
    console.log("Recieved payment request");
    try {
        const {issue, amount} = req.body;
        const iss = await Issue.findById(issue);

        console.log(issue, amount);
        console.log(iss);

        iss.amount = Number.parseInt(amount) + Number.parseInt(iss.amount);
        iss.backers.push(req.userId);

        iss.save();
        res.status(200).json({message : "Amount updated"});
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: "Internal server error!" });
    }
})

app.post('/api/v1/solution', checkToken, async (req, res) => {
    console.log("Recieved solution request");
    try  {
        const {url, acomments, issueid} = req.body;
        const iss = await Issue.findById(issueid);

        const sol = new Solution({user: req.userId, issue: issueid, prURL: url, additionalComments: acomments});
        await sol.save();

        const user = await User.findById(iss.user);
        const suser = await User.findById(req.userId);

        const solurl = "http://localhost:3000/solution/?sol="+sol._id;
        const issurl = "http://localhost:3000/issue/?issue="+issueid;
        await sendEmailForNewSol(user.email, user.firstname, suser.firstname, solurl, issurl);
        res.status(200).json({message: "Solution added!"});
    } catch (err) {
        console.log("Error occured:", err);
    }
})

app.get('/api/v1/solution/:solution', async (req, res) => {
    try {
        let sol = await Solution.findById(req.params.solution);

        if (sol) {
            let prURL = sol.prURL;
            let acomments = sol.additionalComments;
            let positiveVotes = sol.positiveVotes;
            
            const user = await User.findById(sol.user);
            const issue = await Issue.findById(sol.issue);

            let threshold = Math.round(issue.backers.length / 2);
            let name = user.firstname;
            let avatar = user.avatar;
            let createdAt = sol.createdAt;

            let obj = {
                'url' : prURL,
                'issue_url' : "http://localhost:3000/issue/?issue="+sol.issue,
                'comments' : acomments,
                'votes' : positiveVotes,
                'threshold' : threshold,
                'name' : name,
                'avatar' : avatar,
                'created' : createdAt
            }

            console.log("Sending data: ", obj);
            res.status(200).send({message: obj});

        }
    } catch (err) {
        console.log("Error occured: ", err);
    }
})

app.get('/api/v1/issue/:issue', async (req, res) => {
    console.log("Recieved issue request", req);

    try {
        let issue  = await Issue.findById(req.params.issue);
        console.log(issue);

        if (issue) {
            let id = issue._id;
            let title = issue.issueTitle;
            let desc = issue.issueDescription;
            let reward = issue.amount;
            let createdAt = issue.createdAt;
            let updatedAt = issue.updatedAt;
            let type = issue.isBest;
            let open = issue.isOpen;
            let url = issue.url;

            let createdBy = issue.createdBy;
            let avatarurl = issue.createdAvatar;

            const user = await User.findById(issue.user);
            console.log("User info:", user);
            
            let nIssue = {
                'url' : url,
                'id' : id,
                'title' : title,
                'creator' : user.firstname,
                'description' : desc,
                'reward' : reward,
                'isBest' : type,
                'isOpen' : open,
                'created' : createdAt,
                'updated' : updatedAt,
                'createdBy' : createdBy,
                'avatar' : avatarurl,
                'type' : issue.isBest ? "Preference given to the Best Solution" : "Preference given to the Fastest Solution"
            }

            console.log("Issue is: ", nIssue)

            res.status(200).json({message: nIssue});
        }

    } catch (err) {
        console.log(err);
        res.status(500).json({error: "Internal server error!"});
    }
})

app.get("/github/callback", async (req, res) => {
    console.log("Recieved oauth callback from github!");
    console.log(req);

    const {code} = req.query;

    const data = {
        code,
        client_id : process.env.GITHUB_CLIENT_ID,
        client_secret : process.env.GITHUB_CLIENT_SECRET,
        redirect_uri : "http://localhost:5000/github/callback",
    }

    let response = await axios.post(process.env.GITHUB_ACCESS_TOKEN_URL, data, {
        headers: {
            Accept : "application/json"
        }
    });

    const access_token_data = response.data;

    console.log(access_token_data);

    const token = access_token_data["access_token"];

    console.log("Token is" + token);

    const auth_req = "Bearer " + token; 

    const token_info_response = await axios.get(process.env.GITHUB_TOKEN_INFO_URL, {
    headers : {
        Authorization: auth_req
    }
    });

    console.log(token_info_response);
    
    const {email, name, login, avatar_url} = token_info_response.data;
    // console.log(picture);

    let user = await User.findOne({'email': email});
    if (!user) {
        user = new User({email: email, firstname: name, lastname: login, avatar : avatar_url});
        await user.save();
    }

    const authToken = jwt.sign({userId : user._id}, process.env.JWT_KEY, {
        expiresIn : '1 hour'
    });

    console.log(authToken);
    res.status(200).send(`<script> window.location.replace('http://localhost:3000/signin?token=${authToken}'); </script> Redirecting...`);
})

app.get("/google/callback", async (req, res) => {
    console.log("Recieved oauth callback from google!");
    console.log(req);

    const {code} = req.query;

    const data = {
        code,
        client_id : process.env.GOOGLE_CLIENT_ID,
        client_secret : process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri : "http://localhost:5000/google/callback",
        grant_type : "authorization_code"
    }

    let response = await axios.post(process.env.GOOGLE_ACCESS_TOKEN_URL, data)
    const access_token_data = response.data;

    console.log(access_token_data);

    const token = access_token_data["id_token"];

    console.log("Token is" + token);

    const token_info_response = await axios.get(
        `${process.env.GOOGLE_TOKEN_INFO_URL}?id_token=${token}`
    );

    console.log(token_info_response);
    
    const {email, given_name, family_name, picture} = token_info_response.data;
    console.log(picture);

    let user = await User.findOne({'email': email});
    if (!user) {
        user = new User({email: email, firstname: given_name, lastname: family_name, avatar : picture});
        await user.save();
    }

    const authToken = jwt.sign({userId : user._id}, process.env.JWT_KEY, {
        expiresIn : '1 hour'
    });

    console.log(authToken);
    res.status(200).send(`<script> window.location.replace('http://localhost:3000/signin?token=${authToken}'); </script> Redirecting...`);
})

app.get('*', function(req, res) {
    console.log(req);
});

app.post('*', function(req, res) {
    console.log(req);
});

app.listen(port, () => {
    console.log("Backend is listening on port 5000!")
})