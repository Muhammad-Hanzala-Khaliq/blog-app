import express from 'express';
import connectDB from './lib/connectDB.js';
import userRouter from './routes/user.route.js'
import postRouter from './routes/post.route.js'
import commentRouter from './routes/comment.route.js'
import webhookRouter from './routes/webhook.route.js'
import { clerkMiddleware } from '@clerk/express'
import cors from 'cors'
import dotenv from "dotenv";
dotenv.config();


const app = express();
app.use(cors(process.env.CLIENT_URL))

app.use('/webhooks',webhookRouter)

app.use(clerkMiddleware()); // Clerk middleware pehle hona chahiye
app.use(express.json());     // Express JSON parsing middleware baad mein

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  });


app.use('/users',userRouter);
app.use('/posts',postRouter)
app.use('/comments',commentRouter);

// error handlers
app.use((error,req,res,next)=>{
    res.status(error.status || 500);

    res.json({
        message:error.message || "Something went wrong",
        status:error.status,
        stack:error.stack
    })
})

app.listen(3000,() =>{
    connectDB();
    console.log('server is runnig');
})