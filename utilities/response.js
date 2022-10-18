module.exports.errorResponse = (res, error,code) => {
    res.statusCode = code;
      res.send({
         success: false,
         error: error,
         data:[]
      });
       return;
   };


module.exports.successResponse = (res, data) => {
 res.statusCode = 200;   
 res.send({
       success: true,
     
       data: data
 });
 return;
};