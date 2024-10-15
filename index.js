const express = require('express')
const bodyParser = require('body-parser')
const { application } = require('express')
const { v4: uuidv4 } = require('uuid')
var mysql = require('mysql')

const app = express();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extends:false}))

app.use((req,res,next)=>{
  res.setHeader("Access-Control-Allow-Origin","*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization",
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE",
  );
  next();
});
app.use(express.json())

var con = mysql.createConnection({
  host:'korawit.ddns.net',
  user:'webapp',
  password:'secret2024',
  port:3307,
  database:'shop'
});
con.connect(function(err){
  if (err) throw err;
});

app.get('/', (req, res) => {
  res.send('Hello World from mysql!!!')
})

app.get('/api/products',(req,res) => {
    con.query("SELECT * FROM products",function(err, result, fields){
      if(err) throw res.status(400).send('Not found any products');
      res.send(result);
    });
});

app.get('/api/products/:id',(req,res) => {
  const id =req.params.id;
  con.query("SELECT * FROM products where id="+id,function(err, result, fields){
    if(err) throw err;
    let product=result;
    if(product.length>0){
      res.send(result);
    }else{
      res.status(400).send('Not found any products');
    }
    console.log(result);
  });
});

const port = process.env.port || 3001;
app.listen(port, function(){
  console.log(`Example app listening on port ${port}`)
})