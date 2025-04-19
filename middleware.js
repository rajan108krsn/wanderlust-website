module.exports .isLoggedIn = (req,res,next)=>{
    console.log(req.path,"..", req.originalUrl);
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","You must be logged in");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req, res, next) => {
    if (!req.isAuthenticated() && req.originalUrl) {
        req.session.returnTo = req.originalUrl; // Save the original URL in the session
    }
    next();
};