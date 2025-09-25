import express from 'express';
import loginRouter from './routes/login.js';
import { MongoConnect } from './db/mongo.js';
const app  = express();
app.use(express.json());

app.use(loginRouter)

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send('Something broke!');
});

// app.listen(3000, () => {
//     console.log('Server is running on port 3000');
// });
MongoConnect(() => {
    app.listen(3000, () => console.log(`Example app listening on port 3000, version 2`));
  });