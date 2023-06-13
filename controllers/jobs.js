const { BadRequestError, NotFoundError } = require('../errors')
const Job = require('../models/Job')
const {StatusCodes} = require('http-status-codes')


// get method
const getAllJobs = async (req, res) => {   // 后端的逻辑其实不是all the jobs，而是某user下的jobs
  const jobs = await Job.find({ createdBy: req.user.userId }).sort('createdAt')
  res.status(StatusCodes.OK).json({ jobs, count: jobs.length })
}


// get method
const getJob = async (req, res) => {
  const {user: { userId }, params: { id: jobId },} = req   // req.user.userId里是用户id, req.params.id是job id
  const job = await Job.findOne({                         // job id在params里因为routes是/jobs/:id
    _id: jobId,
    createdBy: userId,
  })
  if (!job) {
    throw new NotFoundError(`No job with id ${jobId}`)
  }
  res.status(StatusCodes.OK).json({ job })
}


// post method
const createJob = async (req, res) => {
  req.body.createdBy = req.user.userId    // 从req.user中取出userid, 变成req.body里的新attribute
  const job = await Job.create(req.body)   // 把数据放进schema
  res.status(StatusCodes.CREATED).json({job})
}


// patch method
const updateJob = async (req, res) => {
  const {
    body: { company, position },    // 还要从req.body中获取user input的要修改成的信息
    user: { userId },
    params: { id: jobId },
  } = req

  if (company === '' || position === '') {
    throw new BadRequestError('Company or Position fields cannot be empty')
  }
  const job = await Job.findByIdAndUpdate(
    { _id: jobId, createdBy: userId },     // find by id
    req.body,     // update into these values
    { new: true, runValidators: true }
  )
  if (!job) {
    throw new NotFoundError(`No job with id ${jobId}`)
  }
  res.status(StatusCodes.OK).json({ job })  
}
  


// delete method
const deleteJob = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId },
  } = req

  const job = await Job.findByIdAndRemove({
    _id: jobId,
    createdBy: userId,
  })
  if (!job) {
    throw new NotFoundError(`No job with id ${jobId}`)
  }
  res.status(StatusCodes.OK).send()
}
  




module.exports = {
    createJob,
    deleteJob,
    getAllJobs,
    updateJob,
    getJob,
  }