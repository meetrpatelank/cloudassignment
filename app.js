const fetch = require('node-fetch');
const AWS = require("aws-sdk");
const AWS_ACCESS_KEY_ID = "ASIAYOD3PC6PA3DR5LXI";

const AWS_SECRET_ACCESS_KEY= "84uaCGX+fKVZ8pxAEpmj1MKc3+3Omc4gu3GwJgyG";
const AWS_BUCKET_NAME = "myapp-b00899517";
const AWS_SESSION = "FwoGZXIvYXdzED0aDOCiqdInvoFdG0deIiLAAVAqi2Xq+IqilyvSeEjLcmNaMOwzD3HCGKw0s40aSB56g8NxieeQRWwgay636DyrXOITkugCWdZtP/e4XJL1wYaTT1trmZSAZm5bDKYLXFGIIFdkF21p1YG7PoZq1/DUJhIedf92XtgwTT3tAljNQfsx5hZfZTUm1+5DmaJzEhgaeiGt+d6ARGeHNroKoT8/G2/c+CoF1u8vsyguh+OnhgzPyQop1Jq3uR1k2TvDWH+lzdkMMcDRQcbPx3SfSPO+KCiikZSRBjItNtK6/3C/J55MCasljxeYQePkWsrcxKac+UVImGHmH6mY2CLVU3zhDcTg5gXU";

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
var fs = require("fs");

var bucketname = "b00897765-data";

app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

const s3 = new AWS.S3({
    accessKeyId: "ASIASAMRWUJ4SZEC5KFY",
    secretAccessKey: "B6nYeTiaC9h/r678Ew+/z49fI9Fm9x3IKHu7RCS9",
    sessionToken:
      "FwoGZXIvYXdzECAaDJRSopz2XAUG646HMCLAAW0mxW6gvdQO3SdVhJ5cmN+sxUpsvbAR3pclH1pCA70giJOMD0ZVw0TicvO1T2BqRzPXmP9kPfgs2dTWl+RHqUb/rSDAjlvBLVHx+D5x3gZ/X+bHKbehuywO4bOaHLITJLogn3oeF5fB0Jv6TnYyv/ZGsl1hl6OkJ9dR/1CaQkIBuC1QN6F/49sa0LVsynon7LzUw/EEsWmzcF+VUo0CZ4cP41Byt4zl/yX+ii1id/nonYQYNaoWmrkga3BLfbbsFSil1/iVBjItl6Z5ii10Q7t+FCUQ9/I25G62OV/aDyCSo4Z/UE1sPAIRFpoBZUZ2Dbv32Oso",
  });

app.get('/begin', async function(req,res){
    console.log("start point");
    const response = await fetch('http://52.23.207.11:8081/start', {
            method: 'post',
            body: JSON.stringify({
                "banner": "B00897765",
                "ip": "3.88.42.13:3000"
                }),
            headers: {'Content-Type': 'application/json'}

        });
        console.log("This is response: ",response);
        
        return response;
});


app.post("/storedata", function (req, res) {
    var body = req.body;
    console.log(body);
    const fileName = "summerdevil.txt";
  
    fs.writeFile(fileName, body.data.toString(), function (err) {
      if (err) throw err;
      console.log("Saved!");
    });
  
    if (!body.data) {
      res.send(
        JSON.stringify({
          file: null,
          error: "Invalid JSON input.",
        })
      );
    } else {
      const params = {
        Bucket: "b00897765-data",
        Key: `${fileName}`,
        Body: body.data,
      };
      s3.upload(params, (err, data) => {
        if (err) {
          console.log(err);
        }
        console.log(`Successfully uploaded package.${data.Location}`);
        res.setHeader("Content-Type", "application/json");
        return res.status(200).send(
          JSON.stringify({
            file: fileName,
            s3uri: `https://${bucketname}.s3.amazonaws.com/${fileName}`,
            Success: "Data written on s3 successfully uploaded.",
            statusCode: 200,
          })
        );
      });
    }
  });
  
  app.post("/appenddata", function (req, res) {
    var body = req.body.data;
    const fileName = "summerdevil.txt";
    const Bucketname = "b00897765-data";
    console.log(body);
    const getParams = {
      Bucket: Bucketname,
      Key: `${fileName}`
  }
  
  s3.getObject(getParams, function (err, reqdata) {
          if (err) {
              console.log(err);
          } else {
              data = reqdata.Body.toString().concat(" ",body);
              const params2 = {
                  Bucket: Bucketname,
                  Key: `${fileName}`,
                  Body: data
              }
  
              s3.upload(params2, function (err, data){
                  res.setHeader("Content-type","application/JSON");
                  res.status(200).send;
                  res.send(JSON.stringify({
                      s3uri : data.Location
                  }));
              });
          }
  });
  });
  
  app.post("/deletefile", function (req, res) {
    var body = req.body;
    const fileName = "jenishsas.txt";
    var params = {
      Bucket: bucketname,
      Key: fileName,
    };
    s3.deleteObject(params, function (err, data) {
      if (err) {
        console.log(err, err.stack); // an error occurred
      } else {
        console.log(`Successfully deleted file from s3`);
        console.log("File not found...");
        res.setHeader("Content-Type", "application/json");
        return res.status(200).send(
          JSON.stringify({
            file: fileName,
            s3uri: `https://${bucketname}.s3.amazonaws.com/${fileName}`,
            Success: `${fileName} successfully deleted on s3 `,
            statusCode: 200,
          })
        );
      }
    });
  });
  app.listen(port, () => console.log(`Hello world app listening on port ${port}!`))

/* References of code 
1. https://www.youtube.com/watch?v=_DRklnnJbig&t=353s&ab_channel=WebDevJunkie
2. https://www.zeolearn.com/magazine/uploading-files-to-aws-s3-using-nodejs
3. https://flaviocopes.com/node-upload-files-s3/
4. https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/s3-example-creating-buckets.html */

  


  