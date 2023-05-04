const admin = require("firebase-admin");
const express = require("express");
var jwt = require("jsonwebtoken");
const cors = require("cors");
const serviceAccount = require("./bth4-d5049-firebase-adminsdk-5z1j5-71aaa39e73.json");
const jwt_decode = require("jwt-decode");
const { parseJwt, calculateDayNow } = require("./function");
const mySecret='thanhcong'
const app = express();

// 👇️ configure CORS
app.use(cors());
// app.use( express.json() );
// const tokenUser = 'eoyTP57MQduljXccW6jw4Z:APA91bGEH54E3NJvZEzct3ksOBDHQ9SXFlYbpeRxXDsA8oYWR40ae-ka0Jz4SDYg_vHYElx70aq4owP-oMeRpo2clFu8P1xvA8YamvLfhD7X1wgeed-8U_OlUZUW7Xw5OXwcppmgjH2J';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();
const collectionRef = db.collection("Cross-Tech");

app.get("/api", (req, res) => {
  res.send("hello");
});
app.get("/version-unity", (req, res) => {
  res.send('43');
});
app.post("/api/send", (req, res) => {
  console.log("== req.body==============================");
  console.log(req.body);
  console.log("== req.date==============================");
  console.log(req.data);
  const tokenUser = req.body.tokens;
  console.log("====================================");
  const message = {
    notification: {
      title: "Hello World",
      body: " req.body",
    },
    token: tokenUser,
    data: {
      id: "1",
      name: "test",
    },
  };
  admin
    .messaging()
    .send(message)
    .then((result) => {
      console.log("====================================");
      console.log({ result });
      console.log("====================================");
    })
    .catch((err) => {});
});
app.get("/api/:tokenId", (req, res) => {
  const query = collectionRef.where("tokenId", "==", req.params?.tokenId);
  query
    .get()
    .then((querySnapshot) => {
      let data = {
        name: "",
        description: "Basic blockchain Croostech",
        image_url: "",
        attributes: [],
      };
      querySnapshot.forEach((doc) => {
        console.log(doc.id, "=>", doc.data());
        const dataFormat = JSON.parse(doc.data().data);
        data.name = dataFormat?.nameStudent;
        data.image_url = dataFormat.image;
      });
      res.send(data);
    })
    .catch((error) => {
      console.error("Error reading data:", error);
    });
});
app.get("/:chainId/:tokenId", (req, res) => {
  let query = collectionRef.where("tokenId", "==", req.params?.tokenId);
  query = query.where("chainId", "==", req.params?.chainId);
  query
    .get()
    .then((querySnapshot) => {
      let data = {
        name: "",
        description: "Basic blockchain Croostech",
        image_url: "",
        attributes: [],
      };
      querySnapshot.forEach((doc) => {
        console.log(doc.id, "=>", doc.data());
        const dataFormat = JSON.parse(doc.data().data);
        data.name = dataFormat?.nameStudent;
        data.image_url = dataFormat.image;
        data.data = dataFormat;
      });
      res.send(data);
    })
    .catch((error) => {
      console.error("Error reading data:", error);
    });
});
app.post("/auth/:address", (req, res) => {
  const address = req.params?.address;
  let datNow = new Date(Date.now());

  const expiredRefreshToken = datNow.setDate(datNow.getDate() + 15);
  const expiredAccessToken = datNow.setDate(datNow.getDate() + 1);
  let refreshToken = {
    address,
    dateTime: new Date(Date.now()),
    server: "mlemShop",
    expired: expiredRefreshToken,
  };
  let accessToken = {
    address,
    dateTime: new Date(Date.now()),
    server: "mlemShop",
    expired: expiredAccessToken,
  };

  refreshToken = jwt.sign(refreshToken, mySecret);
  accessToken = jwt.sign(refreshToken, mySecret);
  res.send({
    refreshToken,
    accessToken,
  });
});
app.post("/check-auth/:address", (req, res) => {
  const auth = req.headers?.authorization;
  if (!auth) {
    res.send({
      status: 500,
      data: null,
    });
  }else{
    const accessTokenVerify = jwt.verify(auth, mySecret);
    const accessTokenDecode = jwt.decode(accessTokenVerify, mySecret);
    const expired=accessTokenDecode.expired
    console.log(accessTokenDecode);
    if(calculateDayNow(expired)){
      res.send({
        status: 200,
        data: null,
      });
    }else{
      res.send({
        status: 500,
        data: null,
      });
    }
  }
 
});

app.listen( process.env.PORT ||3002 , () => {
// app.listen(3002, () => {
  console.log("listening on port", process.env.PORT || 3002);
});
