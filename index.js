const express = require('express');
const app = express();
const https = require('https');

const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

const serviceAccount = require('./aihub-992d3-4384543c202c.json');

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

const { collection, addDoc, getDocs, setDoc, doc, updateDoc, increment, Timestamp, serverTimestamp  } = require('firebase-admin/firestore');


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

app.get('/productsPart', async function(req, res) {

    let modelsRef = await db.collection('AIModels')
	const models = await modelsRef.select('id','name').get();
	console.log(models);
    var products = []
    models.forEach((doc) => {
        products.push(doc.data());
		//如果nsfw，则不返回图片地址
    });
    //return products;
    res.json({items:products});
  
});

app.get('/products', async function(req, res) {

    const models = await db.collection('AIModels').get(); //getDocs(collection(db, "AIModels"));
    console.log(models);
    var products = []
    models.forEach((doc) => {
        products.push(doc.data());
		//如果nsfw，则不返回图片地址
    });
    products.sort(compare);
    //return products;
    res.json({items:products});
  
});

app.get('/product/:id', async function(req, res) {
	console.log(req.params.id);
	const model = await db.collection('AIModels').doc(req.params.id.toString()).get();
	//如果nsfw，则不返回图片地址
	res.json({item:model.data()});  
});



app.listen(3001, () => console.log(('listening :)')))