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

app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

app.get('/begin', async function(req,res){
    console.log("start point");
    const response = await fetch('http://52.23.207.11:8081/start', {
            method: 'post',
            body: JSON.stringify({
                "banner": "B00897765",
                "ip": "3.88.42.13"
                }),
            headers: {'Content-Type': 'application/json'}

        });
        console.log("This is response: ",response);
        
        return response;
});


app.post('/storedata',async function(req,res){
    console.log("Start point");
    const data = req.body.data;
    const awsResponse = await putInAWSS3(data);
    console.log(awsResponse.Location);
    res.json({ "s3uri": awsResponse.Location});
});

const s3 = new AWS.S3({
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
    sessionToken: AWS_SESSION
  });
  const putInAWSS3 = async (data) => {
    return s3
    .upload({
        Body: data,
        Bucket: AWS_BUCKET_NAME,
        Key: "test.txt",
        ACL:'public-read'
    })
    .promise();    
};

  app.listen(port, () => console.log(`Hello world app listening on port ${port}!`))

/* References of code 
1. https://www.youtube.com/watch?v=_DRklnnJbig&t=353s&ab_channel=WebDevJunkie
2. https://www.zeolearn.com/magazine/uploading-files-to-aws-s3-using-nodejs
3. https://flaviocopes.com/node-upload-files-s3/
4. https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/s3-example-creating-buckets.html */

  


  