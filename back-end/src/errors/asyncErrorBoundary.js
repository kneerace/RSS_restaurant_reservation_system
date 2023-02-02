function asyncErrorBoundary(delegate, defaultStatus){
    return ( request, response, next)=>{
        Promise.resolve()
        .then(()=> delegate(request, response, next))
        .catch((error={})=>{
            const{status=defaultStatus, message=error} = error;
            next({
                statis, 
                message, 
            });
        });
    };
}

module.exports = asyncErrorBoundary;