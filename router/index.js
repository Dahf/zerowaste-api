import express from "express";
import { verifyToken, verifyTokenAdmin } from "../middleware/VerifyToken.js";
import { createMeal, getMeal } from "../controllers/Meals.js";
import { Login, Logout } from "../controllers/Users.js";
import { refreshToken } from "../controllers/RefreshToken.js";

const router = express.Router();

router.get("/status", (request, response) => {
    const status = {
       "Status": "Running"
    };
    response.send(status);
 });

router.post("/meal", verifyTokenAdmin, createMeal);
router.post('/login', Login);
router.get('/token', refreshToken);
router.delete('/logout', Logout);
router.get('/meals', getMeal);

export default router;