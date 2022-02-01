const express = require('express');
const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(express.json());

const customers = [];

// Middleware
/*Middlewares é aquilo que está no meio
Uma função que fica entre a requisição (request) e entre nosso response*/

function verifyIfExistsAccountCPF(request, response, next) {
    const { cpf } = request.headers;

    const customer = customers.find((customer) => customer.cpf === cpf);

    if (!customer) {
        return response.status(400).json({ error: "Customer not found" });
    }

    request.customer = customer;

    return next();
}


/*Método POST: Criação de algum dados*/
app.post("/account", (request, response) => {
    const { cpf, name } = request.body;
    const id = uuidv4();

    customers.push({
        cpf,
        name,
        id: uuidv4(),
        statement: [],

    });

    return response.status(201).send();

});

//app.use(verifyIfExistsAccountCPF);

app.get("/statement", verifyIfExistsAccountCPF, (request, response) => {

    const { customer } = request;


    return response.json(customer.statement);

});

app.post("/deposit", verifyIfExistsAccountCPF, (request, response) => {
    const { description, amount } = request.body;

    /*Verifica se a conta é válida ou não.* */
    const { customer } = request;

    const statementOperation = {
        description,
        amount,
        created_at: new Date(),
        type: "credit",

    };

    customer.statement.push(statementOperation);

    return response.status(201).send();
});

app.listen(3333);

