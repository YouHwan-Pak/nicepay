const express = require("express");
const got = require("got");
const uuid = require("uuid").v4;
const router = express.Router();

const clientId = '클라이언트키 입력';
const secretKey = '시크릿키 입력';

router.get("/", function (req, res) {
  res.render("index", {
    orderId: uuid(),
    clientId: clientId
  });
});


router.get("/cancel", function (req, res) {
  res.render("cancel");
});


router.post("/clientAuth", function (req, res) {
  console.log(req.body);
  // 결제 비즈니스 로직 구현

  res.render("response", {
    resultMsg: req.body.resultMsg
  });
});


router.post("/cancel", function (req, res) {
  got.post("https://api.nicepay.co.kr/v1/payments/"+ req.body.tid +"/cancel" , {
      headers: {
        Authorization: 
          "Basic " + Buffer.from(clientId + ":" + secretKey).toString("base64"), 
          "Content-Type": "application/json"
      },
      json: {
        amount: req.body.amount,
        reason : "test",
        orderId : uuid()    
      },
      responseType: "json",
    })
    .then(function (response) {
      console.log(response.body);
      // 결제 비즈니스 로직 구현

      res.render("response", {
        resultMsg: response.body.resultMsg
      });
    })
    .catch(function (error) {
      console.log(error);

    });

  console.log(req.body);
});


router.post("/hook", function (req, res) {
  console.log(req.body);
  if(req.body.resultCode == "0000"){
    res.status(200).send('ok');
  }
  res.status(500).send('fail');
});


module.exports = router;