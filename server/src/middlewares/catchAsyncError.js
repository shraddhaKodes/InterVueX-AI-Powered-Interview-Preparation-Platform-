export const catchAsyncErrors = (theFunction)=>{
    return(req,res,next)=>{
        Promise.resolve(theFunction(req,res,next)).catch(next) ;
    }
}
//higer order function that takes a function as an argument and returns a new
//  function that wraps the original function in a try-catch block. This allows
//  us to catch any errors that occur in the original function and pass them to 
// the next middleware (error handler) without having to write try-catch blocks 
// in every async route handler.