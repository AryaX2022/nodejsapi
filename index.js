const express = require('express');
const app = express();
const https = require('https');

const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

require('dotenv').config()
//console.log(process.env.USRN);

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
    //origin: 'http://127.0.0.1:5173'
    origin: ['https://ai-lib.web.app','https://ai-bridge.web.app','https://model4ai.web.app','https://ai1001.web.app']
}));

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();
const tname = "models";

const { collection, addDoc, getDocs, setDoc, doc, updateDoc, increment, Timestamp, serverTimestamp  } = require('firebase-admin/firestore');

app.get('/', (req, res) => {
	res.json({"msg":"Alive"});
});

app.get('/transfer', (req, res) => {
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

app.get('/productsPaged/:pageIndex', async function(req, res) {

    let pageIndex = req.params.pageIndex;

    let ratingCountStart = 5000;
    let ratingCountEnd = 200;

    if(pageIndex == 2) {
        ratingCountStart = 200;
        ratingCountEnd = 100;
    }
    if(pageIndex == 3) {
        ratingCountStart = 100;
        ratingCountEnd = 80;
    }
    if(pageIndex == 4) {
        ratingCountStart = 80;
        ratingCountEnd = 60;
    }
    if(pageIndex == 5) {
        ratingCountStart = 60;
        ratingCountEnd = 50;
    }
    if(pageIndex == 6) {
        ratingCountStart = 50;
        ratingCountEnd = 45;
    }
    if(pageIndex == 7) {
        ratingCountStart = 45;
        ratingCountEnd = 40;
    }
    if(pageIndex == 8) {
        ratingCountStart = 40;
        ratingCountEnd = 35;
    }
    if(pageIndex == 9) {
        ratingCountStart = 35;
        ratingCountEnd = 30;
    }
    if(pageIndex == 10) {
        ratingCountStart = 30;
        ratingCountEnd = 25;
    }
    if(pageIndex == 11) {
        ratingCountStart = 25;
        ratingCountEnd = 22;
    }
    if(pageIndex == 12) {
        ratingCountStart = 22;
        ratingCountEnd = 20;
    }
    if(pageIndex == 13) {
        ratingCountStart = 20;
        ratingCountEnd = 10;
    }
    if(pageIndex == 14) {
        ratingCountStart = 10;
        ratingCountEnd = 0;
    }

    if(pageIndex > 14) {
        res.json({items:[]});
        return;
    }


    const models = await db.collection(tname)
        .orderBy('stats.ratingCount','desc')
        .startAt(ratingCountStart).endBefore(ratingCountEnd)
        .select('id','name','coverImgUrl','stats')
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

    let modelsRef = await db.collection(tname)
	const models = await modelsRef.select('id','name','coverImgUrl','stats').get();
	//console.log(models);
    var products = []
    models.forEach((doc) => {
        products.push(doc.data());
    });
	products.sort(compare);
    //return products;
    res.json({items:products});
  
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


app.listen(3001, () => console.log(('listening :)')))