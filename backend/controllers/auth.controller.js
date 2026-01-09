export function loginSuccess(req, res) {
  res.redirect("http://localhost:5173/dashboard");
}

export function getUser(req, res) {
  if (!req.user) {
    return res.status(401).json({ user: null });
  }

  res.json({
    id: req.user._id,
    email: req.user.email,
    name: req.user.name,
    avatar: req.user.avatar,
  });
}

export function logout(req, res) {
  req.logout(()=>{
    return res.status(200).json({ success: true });
  });
}