
exports.auth = (req, res, next)=>{
  if(!req.user){
    req.flash('error_msg', "Not Authorized")
    return res.redirect('/auth/login')
  }
  next()
}

exports.noAccess = (req, res, next)=>{
  if(req.user) return res.redirect('/')
  next()
}