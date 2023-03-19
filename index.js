const admin = require( 'firebase-admin' );
const express = require( 'express' );
const serviceAccount = require( './bth4-d5049-firebase-adminsdk-5z1j5-71aaa39e73.json' );

const app = express();
app.use( express.json() );
// const tokenUser = 'eoyTP57MQduljXccW6jw4Z:APA91bGEH54E3NJvZEzct3ksOBDHQ9SXFlYbpeRxXDsA8oYWR40ae-ka0Jz4SDYg_vHYElx70aq4owP-oMeRpo2clFu8P1xvA8YamvLfhD7X1wgeed-8U_OlUZUW7Xw5OXwcppmgjH2J';

admin.initializeApp( {
  credential: admin.credential.cert( serviceAccount )
} );
const db = admin.firestore();
const collectionRef = db.collection('Cross-Tech');

app.get('/api',(req,res)=>{

  res.send('hello')
})
app.post( '/api/send', ( req, res ) => {
  console.log( '== req.body==============================' );
  console.log( req.body );
  console.log( '== req.date==============================' );
  console.log( req.data );
  const tokenUser = req.body.tokens;
  console.log( '====================================' );
  const message = {
    notification: {
      title: 'Hello World',
      body: ' req.body'
    },
    token: tokenUser,
    data: {
      id: '1',
      name: 'test'
    }

  };
  admin.messaging().send( message ).then( ( result ) => {
    console.log( '====================================' );
    console.log( { result } );
    console.log( '====================================' );
  } ).catch( ( err ) => {

  } );
} );
app.get( '/api/:tokenId', ( req, res ) => {
  const query = collectionRef.where('tokenId', '==', req.params?.tokenId );
  query.get()
  .then((querySnapshot) => {
    let data= {
      "name": "",
      "description": "Basic blockchain Croostech",
      "image_url": "",
      "attributes": []
  }
    querySnapshot.forEach((doc) => {
      console.log(doc.id, '=>', doc.data());
      const dataFormat=JSON.parse(doc.data().data)
      data.name=dataFormat?.nameStudent
      data.image_url=dataFormat.image
    });
    res.send(data)
  })
  .catch((error) => {
    console.error('Error reading data:', error);
  });
} );
app.get( '/:chainId/:tokenId', ( req, res ) => {
  let query = collectionRef.where('tokenId', '==', req.params?.tokenId );
  query=query.where('chainId', '==', req.params?.chainId );
  query.get()
  .then((querySnapshot) => {
    let data= {
      "name": "",
      "description": "Basic blockchain Croostech",
      "image_url": "",
      "attributes": []
  }
    querySnapshot.forEach((doc) => {
      console.log(doc.id, '=>', doc.data());
      const dataFormat=JSON.parse(doc.data().data)
      data.name=dataFormat?.nameStudent
      data.image_url=dataFormat.image
    });
    res.send(data)
  })
  .catch((error) => {
    console.error('Error reading data:', error);
  });
} );
app.listen( process.env.PORT || 3000, () => {
  console.log( 'listening on port 3000' );
} );
