import User from "../models/User.js";
import jwt from "jsonwebtoken"

export function loginSuccess(req, res) {
  const user = req.user;
    const token = jwt.sign(
      { id: user._id, email: user.email }, // Payload
      process.env.JWT_SECRET,             // Secret Key (Add this to Render Env Vars!)
      { expiresIn: "24h" }
    );

    // 3. Redirect to Frontend with Token in URL
    // We send them to the dashboard and attach the token as a query param
    res.redirect(`${process.env.FRONTEND_URL}/dashboard?token=${token}`);
}

export async function getUser(req, res) {
// Get token from "Authorization: Bearer <token>"
  const authHeader = req.headers.authorization;
  
  if (!authHeader) return res.status(401).json({ user: null });

  const token = authHeader.split(" ")[1]; // Remove "Bearer "

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Find user in DB based on decoded.id
    const user = await User.findById(decoded.id); 
    res.json(user);
  } catch (err) {
    res.status(401).json({ user: null });
  }
}