require('dotenv').config();

const express = require('express');
const globalRoutes = require('./Routes/global');
const connectDB = require('./Utils/dbConfig');

const app = express();


app.get('/', (req, res) => {
    res.send({
        status: 200,
        message: "Successfully live"
    })
})


app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(express.json())
app.use('/api', globalRoutes);


const PORT = process.env.PORT || 8000;
try {
    connectDB().then(() => {
        app.listen(PORT,"0.0.0.0", () => {
            console.log(`Server is live at ${PORT}`);
        })
    });
} catch (error) {
    console.log(error);
}
