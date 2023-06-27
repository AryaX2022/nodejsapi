const express = require('express');
const app = express();
const https = require('https');

const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

const { S3Client, PutObjectCommand, GetObjectCommand, ListObjectsV2Command } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const s3Client = new S3Client({
    credentials: {
        accessKeyId: "jxxpimx7rapd6eg6rqgimfmvh6za",
        secretAccessKey: "j2ns2h5er2o5zj2y4mpxp4tn5ycvbx2dvlp67fubif4e6vnm2vxoc",
    },
    region: "us-1",
    endpoint: "https://gateway.storjshare.io",
});


var jwt = require("jsonwebtoken");
var bodyParser = require('body-parser')
// create application/json parser
var jsonParser = bodyParser.json()
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

require('dotenv').config()
//console.log(process.env.USRN);
const secret = "arya-secret"
const serviceAccount = {
    "type": "service_account",
    "project_id": process.env.PROJ_ID,
    "private_key_id": process.env.PRV_KEY_ID,
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDuxQLBmjF+QiBE\nDgmMgGCYuwe8hRpk2RMwkxRGgBv4igM4u2jzjrdMofvu8b1PG5c3slBo7PuzhbGw\nEkX6V7ertqmMlGaDk9+t0KB8vgADsNjcW6AZeb+3lYQn+TqWAgMyEysVyvv1nU5d\nPr6to13YtCGq3MNPD/Ck4xUVjrxhCo53IB7py7S3WuEC7q9HGJdhpdsGHQEQ74V7\nklL0LFKuxr9mySR1FvVqYruvBRuVxRBLVMqiJgeQOWpX2kfRdUVwI5Bxfm0T+O+q\nI/RkvdEedJFMr3VtMKE2J4khLps4Y1R9b5ZJtkBOsA5PAnDFOSUD8HVH2KOmsRYu\n+g5RAWWHAgMBAAECggEAFgomnfsYrg0QI2TUUGoAZwV+MLjS93oeGyUiAWJaTDYy\nsLrqQVXsHFPB1Vi7eIdIc9vh/KPbYlycStXBxdqKjRW4T5sNkQATICoAyZYhAQMC\n9+j+Cm8ov85tiEipT41yAN5KFm6wYTsBYvpwT8c9QDKOy2tc6Xn3ZMQqGKpRpl2z\nn+TbARNSlKn4eJ188z0yBb+/bwTI5LuvyNFDSD4Msbo500eyaLapdQJ4Fk8iN7K5\nRjfX1sjNDQIyfTbaDfp7Cf4QGUZGmEaAdQCP3PptghLPf84rO92CKgemOoT4yYK1\noH7uooKbisGikiqTdcHwaI0LdfM2UItpEEWPdM+KeQKBgQD+/u9Hrk2Lwowv5/83\ng6V4mma/gD5qDKtJ2bQwkg1rivqihDF3NgpBkiUWCyXd76y+H2XKQNhn/dOj/D7l\n/I8fKU6mfo2nYS2XLWsHYsaxJXr4I87WgJ1uluE4WZqZiV237uMMi34NAdkMMz5f\nmOJEcPK7987ZCJEWifMVe+/LWwKBgQDvtbfXG72EOGrF0P2AhJnWvPKQIMdlDyj7\nxQg8m5D+3Uo/pA7Q1eLCBthD7Z+WvF+yM+BBYTeF87Xnj2yGRDC2qdf3I1QKGovN\nrc+L33axnoTaEz/6pKuWt0S/TsbGhxpvTS1vWgIU5Ew/8Z6BGWxTWI5KfWZ7jVYW\n5jaXbxCiRQKBgQCDG1Cr6lK0qTKq7v2p7WYGvFxX2fg9ToZDUkvzLST5RlvXc2B7\niq17SUkILHMryS9oEXykoPKjhT5r8iXk2hY8T2DA+hCbHrvyHsgI5CCEtGCldMPE\nRhyr36es8WUrzBUDnS/gI1iMF4chXreTL2gnCGvFeYRA0sbGb+csBK0mQQKBgG9r\nKZ5kmHxitM5py8r214LGpIB1m/jPSR9tf9yb+pNcTGy0Vuae5B2HjPJV+v3XZSux\njSUWiPZMR1rwgWMPQw1EeMu4shFYMW9SwMuk/Mimg93RYMWh0NfnK584gJA6sADY\nAKxnS9xmGUMHjcM4C+/Zk5nwG7iGA2P1cZ6F01d5AoGASrU+cwBeNcTchhXwZaxo\nh0eRoaIcdTQMOczvjGmktcAejRtaxmQ+HfAN2/09RQ2qoS32KOQlQwT1NKI8+zN7\nC5+amR/qkNyA50i/7H4BI3alGzZLLFqhAsK+ssfSAAOXMRdI9mkl7VpwEpqcSCMA\nOeHjKYuiusZJEd6C4CLeNUE=\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-9aifp@aihub-992d3.iam.gserviceaccount.com",
    "client_id": "111853866755646184301",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-9aifp%40aihub-992d3.iam.gserviceaccount.com"
};

const cors = require('cors');
app.use(cors({
    //origin: ['http://127.0.0.1:5174','http://127.0.0.1:5173']
    origin: ['http://localhost:3000','http://127.0.0.1:5174','http://127.0.0.1:5173', 'https://ai-lib.web.app','https://ai-bridge.web.app','https://model4ai.web.app','https://model4ai.netlify.app','https://ai1001.web.app']
}));

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();
// const tname = "models";
const tname = "modelsV2";

const { collection, DocumentData, addDoc, getDocs, setDoc, doc, updateDoc, increment, FieldValue, Timestamp, serverTimestamp  } = require('firebase-admin/firestore');

app.get('/', (req, res) => {
    console.log("Good");
	res.json({"msg":"Alive"});
});

app.get('/liverender', (req, res) => {

    https.get('https://caomeio.onrender.com/', res => {
        let data = [];
        const headerDate = res.headers && res.headers.date ? res.headers.date : 'no response date';
        console.log('Status Code:', res.statusCode);
        console.log('Date in Response header:', headerDate);

        res.on('data', chunk => {
            data.push(chunk);
        });

        res.on('end', () => {
            console.log('Response ended: ');
            const iamlive = JSON.parse(Buffer.concat(data).toString());
            console.log(iamlive);
            console.log();

        });
    }).on('error', err => {
        console.log('Error: ', err.message);
    });

    res.json({ret:1});
});

app.get('/transfer', async function(req, res){
    let id = req.query.id;
    const modelRef = db.collection(tname).doc(id.toString());
    const result = await modelRef.update({"stats.downloadCount": FieldValue.increment(1)});
    //res.json({ret:result});

  let url = req.query.url;
  console.log(url);
  //res.send(`<h1>${req.params.id}</h1>`);
  //res.end();
  
  https.get(url, (response) => {
    console.log(response);
    console.log("获取location:");
    console.log(response.headers["location"]);
    res.json({target:response.headers["location"]});
  }).on('error', (e) => {
    console.error(`Got error: ${e.message}`);
  });

});

function compare( a, b ) {
    if ( a.stats.ratingCount < b.stats.ratingCount ){
        return 1;
    }
    if ( a.stats.ratingCount > b.stats.ratingCount ){
        return -1;
    }
    return 0;
}

app.get('/productsPaged/:pageIndex/:tag', async function(req, res) {

    let pageIndex = req.params.pageIndex;
    let tag = req.params.tag;

    let ratingCountStart = 9999;
    let ratingCountEnd = 100;

    if(pageIndex >= 2) {
        ratingCountStart =  100 - (pageIndex-2)*10;
        ratingCountEnd = ratingCountStart-10;
    }

    if(ratingCountEnd <= 0) {
        res.json({items:[]});
        return;
    }


    let querySnapshot = db.collection(tname)

    if(tag != "all") {
        querySnapshot = querySnapshot.where('tags', 'array-contains', tag);
    }
    const models = await querySnapshot
        .orderBy('stats.ratingCount','desc')
        .startAt(ratingCountStart).endBefore(ratingCountEnd)
        .select('id','name','coverImg','stats','flag','type')
        .get();

    console.log(models.size);

    var products = []
    models.forEach((doc) => {
        products.push(doc.data());
    });
    products.sort(compare);
    //return products;
    res.json({items:products});

});

app.get('/productsHome', async function(req, res) {
    console.log("Query..");
    let modelsRef = await db.collection(tname)
	const models = await modelsRef.select('id','name','coverImg','stats').get();
	console.log("Done1");
    var products = []
    models.forEach((doc) => {
        products.push(doc.data());
        console.log(doc.data().name);
    });
    console.log(products.length);
	products.sort(compare);
    //return products;
    res.json({items:products});
  
});

const fs = require('fs')
let imglist = []
app.get('/check', async function(req, res) {
    const models = await db.collection(tname).get();
    //console.log(models);
    var file = fs.createWriteStream('array.txt');
    models.forEach((doc) => {
        let item = doc.data();

        //console.log(item.id);

        for (var j = 0, lenVer = item.modelVersions.length; j < lenVer; j++) {

            for (var k = 0, lenImgs = item.modelVersions[j].images.length; k < lenImgs; k++) {
                //console.log(item.modelVersions[j].images[k].url);
                let img = item.modelVersions[j].images[k];

                // const path = 'H:\\GitProject\\vue3\\model4ai\\src\\assets\\images\\' + img.url;
                //
                // try {
                //     if (!fs.existsSync(path)) {
                //         //imglist.push(img.url);
                //         file.write(`${img.url}\n`)
                //         //console.log(""+img.url+"',");
                //     }
                // } catch(err) {
                //     console.error(err)
                // }
            }
        }


    });
    file.end();
    //console.log(imglist);
});


app.get('/products', async function(req, res) {

    const models = await db.collection(tname).get();
    console.log(models);
    var products = []
    models.forEach((doc) => {
        products.push(doc.data());
    });
    products.sort(compare);
    //return products;
    res.json({items:products});
  
});

app.get('/product/:id', async function(req, res) {
	console.log(req.params.id);
	const model = await db.collection(tname).doc(req.params.id.toString()).get();
	res.json({item:model.data()});  
});

app.get('/urlCopied/:id', async function(req, res) {
    console.log(req.params.id);
    const modelRef = db.collection(tname).doc(req.params.id.toString());
    const result = await modelRef.update({"stats.urlcopied": FieldValue.increment(1)});
    res.json({ret:result});
});

app.get('/favorite/:id', async function(req, res) {
    console.log(req.params.id);
    const modelRef = db.collection(tname).doc(req.params.id.toString());
    const result = await modelRef.update({"stats.favoriteCount": FieldValue.increment(1)});
    res.json({ret:result});
});

app.get('/rating/:id', async function(req, res) {
    console.log(req.params.id);
    let rating = req.query.rating;
    //console.log(rating);
    const modelRef = db.collection(tname).doc(req.params.id.toString());
    const model = await modelRef.get();
    //console.log(model.data().stats.rating);
    let newrating = (model.data().stats.rating * model.data().stats.ratingCount + parseFloat(rating))/(model.data().stats.ratingCount+1);
    //console.log(newrating);
    const result = await modelRef.update({"stats.ratingCount": FieldValue.increment(1), "stats.rating":newrating});

    res.json({ret:newrating});
});

app.post('/auth/signin', jsonParser, async function (request, response) {

    console.log(request.body);
    const userRef = db.collection('musers');
    const snapshot = await userRef.where('username', '==', request.body.username).where('password', '==', request.body.password).get();
    if (snapshot.empty) {
        console.log('No user match.');
        response.json({ret:1, message:'用户名或密码不正确'});
    } else {

        var token = jwt.sign({ id: request.body.username }, secret);

        snapshot.forEach(doc => {
            let user = doc.data();
            user.accessToken = token;
            response.json({ret:0, user: user});
        });
    }
});

app.post('/auth/signup', jsonParser, async function (request, response) {
    console.log(request.body);
    request.body.createtime = new Date();
    // Add a new document in collection "cities" with ID 'LA'
    const res = await db.collection('musers').doc(request.body.username).set(request.body);
    response.json({data:{message:'注册成功'}});
});

app.get('/user', async function (request, response) {
    let token = request.headers["x-access-token"];

    if (!token) {
        return response.status(403).send({
            message: "No token provided!"
        });
    }

    jwt.verify(token, secret, (err, decoded) => {
        if (err) {
            return response.status(401).send({
                message: "Unauthorized!"
            });
        }
        request.userId = decoded.id;
    });

    console.log(request.userId);
    response.json({ret:0});

});

app.post('/user/profile',jsonParser, async function(request,response) {
    let token = request.headers["x-access-token"];

    if (!token) {
        return response.status(403).send({
            message: "No token provided!"
        });
    }

    jwt.verify(token, secret, (err, decoded) => {
        if (err) {
            return response.status(401).send({
                message: "Unauthorized!"
            });
        }
        //request.userId = decoded.id;
    });
    console.log(request.body);
    const userRef = db.collection('musers').doc(request.body.username);
    const result = await userRef.set({"customizedAvatar": request.body.customizedAvatar},{merge:true}); //将新数据与现有文档合并，以避免覆盖整个文档
    response.json({ret:0});
});

// const multer = require("multer");
// const dest = multer({ dest: "files/" });
// function uploadFiles(req, res) {
//     console.log(req);
//     console.log(req.files);
//     console.log(req.body);
//     res.json({ret: req.files});
// }
//
// app.post("/upload", dest.array("image"), uploadFiles);

app.post('/post/new', jsonParser,async function (request, response) {
    let token = request.headers["x-access-token"];

    if (!token) {
        return response.status(403).send({
            message: "No token provided!"
        });
    }

    jwt.verify(token, secret, (err, decoded) => {
        if (err) {
            return response.status(401).send({
                message: "Unauthorized!"
            });
        }
        //request.userId = decoded.id;
    });

    //console.log(request.userId);
    //console.log(request.body);
    request.body.createtime = new Date();
    const res = await db.collection('mposts').add(request.body);

    response.json({ret:res.id});

});

app.get('/posts', async function(req, res) {

    const postsShot = await db.collection('mposts').get();
    var posts = []
    postsShot.forEach((doc) => {
        let data = doc.data();
        data.id = doc.id;
        posts.push(data);
    });
    //return products;
    res.json({items:posts});

});

app.get('/post/:id', async function(req, res) {
    console.log(req.params.id);
    const model = await db.collection('mposts').doc(req.params.id.toString()).get();
    res.json({item:model.data()});
});

app.post('/post/reply/:id', jsonParser, async function(req, res) {
    console.log(req.params.id);
    const modelRef = db.collection('mposts').doc(req.params.id.toString());
    const model = await modelRef.get();
    let replies = []
    if(model.data().replies != null) {
        replies = model.data().replies;
    }
    req.body.createtime = new Date();
    replies.push(req.body);
    const result = await modelRef.set({"replies": replies},{merge:true});
    res.json({ret:result});
});

app.post('/post/review/:id', async  function(req,res) {
    const modelRef = db.collection('mposts').doc(req.params.id);
    const result = await modelRef.update({"review": FieldValue.increment(1)});
    res.json({ret:result});
});

app.post('/model/comments/:id', jsonParser, async function(req, res) {
    console.log(req.params.id);
    const modelRef = db.collection('mcomments').doc(req.params.id.toString());
    const model = await modelRef.get();
    let comments = []
    if(model != null && model.data() != null && model.data().comments != null) {
        comments = model.data().comments;
    }
    console.log(req.body);
    req.body.createtime = new Date();
    comments.push(req.body);
    const result = await modelRef.set({"comments": comments});
    res.json({ret:result});
});
app.get('/model/comments/:id', async function(req, res) {
    console.log(req.params.id);
    const model = await db.collection('mcomments').doc(req.params.id.toString()).get();
    res.json({item:model.data()});
});


app.post("/v/presign", jsonParser,async function (req, res) {
    try {
        console.log(req.body);
        let params = {
            Bucket: "demo-bucket",
            Key: req.body.key,
        };

        let command = new PutObjectCommand(params);
        const signedUrl = await getSignedUrl(s3Client, command, {
            expiresIn: 600,
        });
        console.log(signedUrl);
        res.json({ url: signedUrl });
    } catch (err) {
        console.error(err);
    }
});


app.put('/v/add', jsonParser,async function (request, response) {
    // let token = request.headers["x-access-token"];
    //
    // if (!token) {
    //     return response.status(403).send({
    //         message: "No token provided!"
    //     });
    // }
    //
    // jwt.verify(token, secret, (err, decoded) => {
    //     if (err) {
    //         return response.status(401).send({
    //             message: "Unauthorized!"
    //         });
    //     }
    //     //request.userId = decoded.id;
    // });

    const params = {
        Bucket: 'demo-bucket',
        Key: request.body.filename
    }

    let command = new GetObjectCommand(params);
    const url = await getSignedUrl(s3Client, command);
    console.log(url);
    request.body.defaultVideoUrl = url;

    request.body.createtime = new Date();
    const res = await db.collection('vitems').add(request.body);

    response.json({ret:res.id});

});

async function getMediaUrlAndSave2Db(bucket, key) {
    const params = {
        Bucket: bucket,
        Key: key
    }

    let command = new GetObjectCommand(params);
    const url = await getSignedUrl(s3Client, command);
    console.log(url);

    //Now save this url into db
}

app.post('/v/list', jsonParser, async function (request, response)  {
    let bucket = 'media2023'

    const command = new ListObjectsV2Command({
        Bucket: bucket,
        // The default and maximum number of keys returned is 1000. This limits it to
        // one for demonstration purposes.
        MaxKeys: 100,
    });

    try {
        let isTruncated = true;

        //console.log("Your bucket contains the following objects:\n")
        //let contents = "";

        //返回所有的，每次返回最多100
        while (isTruncated) {
            const { Contents, IsTruncated, NextContinuationToken } = await s3Client.send(command);

            for (const item of Contents) {
                await getMediaUrlAndSave2Db(bucket, item.Key);
            }

            // const contentsList = Contents.map((c) => ` • ${c.Key}`).join("\n");
            // contents += contentsList + "\n";
            isTruncated = IsTruncated;
            command.input.ContinuationToken = NextContinuationToken;
        }
        //console.log(contents);

    } catch (err) {
        console.error(err);
    }

    response.json({ret:1});
})

app.listen(3001, () => console.log(('listening :)')))