import express from "express";
import adminRoutes from "./admin.routes.js";
import CategoryRouter from "./category.routes.js";


const router = express.Router();

router.use("/admin", adminRoutes);
router.use("/categories", CategoryRouter);


export default router;
