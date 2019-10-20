const express = require("express");
const axios = require("axios")
const app = express();
const bodyParser = require('body-parser');


const port = 5000;

// Body parser
app.use(bodyParser());
app.use(express.urlencoded({ extended: false }));

//CORS
// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   // preflight
//   next();
// });

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Authorization, UserId');
  res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Max-Age', '86400');
  if(req.method === 'OPTION'){
    res.sendStatus(200);
  }
  next();
});




app.post("/login", (req, res) => {
  res.send({
    "userId": "AAAAA",
    "userName": "Test Player",
    "teamID": "TestTeam",
    "apiToken" : "TESTAPITOKEN",
    "requestedToken": req.body.token
  })
});

app.get("/login", (req, res) => {
  res.send({
    "userId": "AAAAA",
    "userName": "Test Player",
    "teamID": "TestTeam",
    "apiToken" : "TESTAPITOKEN",
    "requestedToken": "AAAAA"
  })
});

app.get('/user/:id', function(req, res) {
  res.send({
    "rate": 560,
    "weeklyDistance": 25.12,
    "totalDistance": 125,
    "achievementRate": 80
  });
});

app.get('/team/:id', function(req, res) {
  res.send({
    teamGoal: 200,
    teamMember: [
        {
            userName: "AAA",
            userData: {
                "rate": 560,
                "weeklyDistance": 13,
                "totalDistance": 125,
                "achievementRate": 80
            }
        },
        {
            userName: "BBB",
            userData: {
                "rate": 560,
                "weeklyDistance": 30,
                "totalDistance": 125,
                "achievementRate": 80
            }
        },
        {
            userName: "CCC",
            userData: {
                "rate": 560,
                "weeklyDistance": 50,
                "totalDistance": 125,
                "achievementRate": 80
            }
        },
        {
            userName: "DDD",
            userData: {
                "rate": 560,
                "weeklyDistance": 25.12,
                "totalDistance": 125,
                "achievementRate": 80
            }
        }
    ]
});
});


// Listen on port 5000

app.listen(port, () => {
  console.log(`Server is booming on port 5000
Visit http://localhost:5000`);
});