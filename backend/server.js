const express=require('express')
const app=express()
const mongoose=require('mongoose')
const userRoutes=require('./routes/userRoutes')
const layoutRoutes=require('./routes/layoutRoutes')
const cors=require('cors')

app.get('/', (req, res) => {
    res.send("Hello World");
});

require('dotenv').config();

app.use(express.json());
app.use(cors())
app.use('/api/user', userRoutes);
app.use('/api/', layoutRoutes)

mongoose.connect('mongodb+srv://MERN:OabOhihuXOjL2fRB@cluster0.tiglnj5.mongodb.net/blaash?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("MongoDB Connected");
}).catch((error) => {
    console.log(error);
});

app.listen(process.env.PORT, () => {
    console.log("Server is running on port 5000");
});