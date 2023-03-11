const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { mongoose } = require('./database');
const jwt = require('jsonwebtoken')
const moment = require('moment');
const Client = require('./models/ClientSchema');
const User = require('./models/UserSchema');

const port = 4200;
const app = express();
var jsonParser = bodyParser.json();
const corsOptions = {
    origin: '*', 
    credentials: true,
    optionSuccessStatus:200
}
const verifyJWT = (req, res, next)=>{
    const  token = req.headers['x-access-token'];
    console.log(token);
    if(!token){
        res.send("No token was given");
    } else{
        jwt.verify(token, 'jwtSecretKey', (err, decoded)=>{
            if(err){
                res.json({auth: false, message: 'Failed to auth'})
            }else{
                req.userId = decoded.id;
                next();
            }
        });
    }
}
/**
 * TODO
 * Conectarlos a la base de datos
 * Create
 * Read
 * Update
 * Delete
 */

const data = [
    { name: 'Saul', gender: 'Hombre', age: '19', email: 'saul@gmail.com' },
    { name: 'Manuelas', gender: 'Mujer', age: '21', email: 'solteron@gmail.com' },
    { name: 'Chuyito Chan', gender: 'Bicurioso', age: '15', email: 'chuyitopiola@gmail.com' },
]

app.use(cors(corsOptions));

app.get('/', async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
    const client = await Client.find();
    res.end(JSON.stringify({ name: "someName" }));
});
//Leer clientes
app.get('/client.api', async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')

    const clients = await Client.find();
    res.end(JSON.stringify(clients));
})
//Añadir Cliente Nuevo
app.post('/newClient', verifyJWT,jsonParser ,async (req, res) => {
    const { name, gender, age, email } = req.body;
    const client = new Client({ name, gender, age, email });
    await client.save();
    res.json({ status: 200 });

})
//Eliminar Cliente
app.delete('/deleteClient/:id', verifyJWT, jsonParser, async (req, res) => {
    await Client.deleteOne({ _id: req.params.id });
    console.log(`Client ${req.params.id} deleted`);
    res.json({ status: 200 });
});
//Actualizar informacion de cliente
app.put('/updateClient/:id', verifyJWT, jsonParser, async (req, res) => {
    const {name, gender, age, email} = req.body;
    await Client.updateOne({ _id: req.params.id },
         { $set: { name: name, gender: gender, age: age, email: email } });

    console.log(`Client ${req.params.id} updated`);
    res.json({ status: 200 });
})


//Autenticacion
app.post('/auth', jsonParser, async (req, res)=>{
    const {name, password} = req.body;
    console.log(`${name} ${password}`);

    //Aqui voy a crear la logica de la 
    //generacion del token
    const result = await User.find({name: name});
    
    if(result.length>0){
        console.log('User found');
        result[0].password;
        const id = result[0]._id;
        const token = jwt.sign({id}, "jwtSecretKey",{
            expiresIn : 3000,
        })
        console.log(token);
        res.send({
            status: 200, 
            auth: true,
            token: token,
            result: result
        });
    }
    else{
        console.log('No user was found')
        res.send({status:401});
        
    }

    //if(name==='Saul' && password==='123'){
        ////Usuario correcto
        //res.json({status: 200});
    //}
    //else{
        ////Error code para usuario no autenticado
        //res.json({status: 401})
    //}
})




//PORT = 4200
app.listen(port, (req, res) => {
    console.log(`Server on port ${port}`);
})