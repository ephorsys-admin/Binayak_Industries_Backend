import express from "express";
import adminRoutes from "./admin.routes.js";
import CategoryRouter from "./category.routes.js";
import ProductRouter from "./product.routes.js";
import ContactRouter from "./contact.routes.js";


const router = express.Router();

router.use("/admin", adminRoutes);
router.use("/categories", CategoryRouter);
router.use("/product", ProductRouter);
router.use("/contact", ContactRouter);




export default router;
