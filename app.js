// With dotenv, you can define environment variables in a .env file, 
// and then use the process.env object in your nodejs code to access those values.
require('dotenv').config();
// a middleware for Express applications that simplifies error handling 
// for asynchronous routes and middleware functions, without needing to write try ... catch ...
require('express-async-errors');
const express = require('express');
const app = express();
// 用来验证用户来进一步access job routes的middleware:
const authenticateUser = require('./middleware/authentication')

// extra security packages
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const rateLimiter = require('express-rate-limit');





// connectDB
const connectDB = require('./db/connect')     // 连接数据库


// routers
const authRouter = require('./routes/auth')
const jobsRouter = require('./routes/jobs')



// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');



app.set('trust proxy', 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  })
);
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());





// routes
app.use('/api/v1/auth', authRouter)    // 完整路径是domain/api/v1/auth/login或register
app.use('/api/v1/jobs', authenticateUser, jobsRouter)    // 完整路径是domain/api/v1/jobs/...；加middleware来验证user



app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)        // 连接数据库
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
