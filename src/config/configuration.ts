
// Writing the configuration file ....
export default ()=> ({
     PORT:process.env.PORT,
     MONGO_URI:process.env.MONGO_URI,
     JWT_SECRET:process.env.JWT_SECRET ,
     JWT_EXPIRES_IN:Number(process.env.JWT_EXPIRES_IN) || 3600
})


