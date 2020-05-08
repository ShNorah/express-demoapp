const express = require("express");
const Joi = require('joi');
const app = express();  

app.use(express.json());  //use json file

const customers =[
    {name: 'sharon', id: 1},
    {name: 'norah', id: 2},
    {name: 'aksharon', id: 3},
    {name: 'aknorah', id: 4 },
]

app.get('/', (req, res) =>{
    res.send('Welcome to Sharons RESTAPIS');
});

//display the list of all customers
app.get('/api/customers', (req, res)=>{
    res.send(customers);
});

//display information of a specific customer  26:42
app.get('/api/customers/:id', (req, res)=>{
    const customer = customers.find(c => c.id === parseInt(req.params.id)); 
//display error if no valid id 
if(!customer)res.status(404).send('INVALID ID');
res.send(customer);
});

//Create new customer
app.post('/api/customers', (req, res)=>{
    const {error} = validateCustomer(req.body);
    if(error){
        res.status(400).send(error.details[0].message)
        return;
    }
    //to increment the customer id by 1
    const customer = {
        id: customers.length + 1,
        name: req.body.name
    };
    customers.push(customer);
    res.send(customer);

})


//updating an existing customer

app.put('/api/customers/:id', (req, res)=>{
    const customer = customers.find(c => c.id === parseInt(req.params.id)); 

    //display error if no valid id 
if(!customer)res.status(404).send('CUSTOMER NOT FOUND');
res.send(customer);

const {error} = validateCustomer(req.body);
    if(error){
        res.status(400).send(error.details[0].message)
        return;
    }
    customer.name = req.body.name;
    res.send(customer);

});

//deleting a specific customer
app.delete('/api/customers/:id', (req, res)=>{
    const customer = customers.find(c => c.id === parseInt(req.params.id)); 

    if(!customer)res.status(404).send('CUSTOMER NOT FOUND');

    const index = customers.indexOf(customer);
    customers.splice(index, 1);
    res.send(customer);
})


//function to validate information about the customer using joi
function validateCustomer(customer){
    const schema = {
        name: Joi.string().min(3).required()
    };
    return Joi.validate(customer, schema);
}
//port environment variable
const port = process.env.PORT || 8080;  //no need to restart the server again and again
app.listen(port, ()=> console.log(`listening on port ${port}`));

