import express from 'express';

const app = express();

const PORT=3030;

app.get('/',(req,res)=>{
   res.send('hi')
})

app.listen(PORT,()=>{
   console.log(`Server Listening on : http://localhost:${PORT}`)
})