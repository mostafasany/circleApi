const express = require('express');
const graphqlHTTP = require('express-graphql')
const schema = require('./schema/schema')
const mongoose = require('mongoose')

const app = express();

const CONN = 'mongodb://mostafasany:most123@ds247852.mlab.com:47852/circles_db'

const option = {
    useNewUrlParser: true,
};

mongoose.connect(CONN, option, (error) => {
    if (error) {
        console.log("Error: " + JSON.stringify(error));
        //throw error;
    }
})
mongoose.connection.once('open', () => {
    console.log("Connected to Mlab Database");
})

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}));
app.listen(process.env.port || 4000, () => {
    console.log("Server listening to port 4000");
});