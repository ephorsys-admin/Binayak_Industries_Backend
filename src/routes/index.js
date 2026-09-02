import express from "express";
import adminRoutes from "./admin.routes.js";
import CategoryRouter from "./category.routes.js";
import ProductRouter from "./product.routes.js";
import ContactRouter from "./contact.routes.js";
import OrderRouter from "./order.routes.js";

const router = express.Router();

router.use("/admin", adminRoutes);
router.use("/categories", CategoryRouter);
router.use("/product", ProductRouter);
router.use("/contact", ContactRouter);
router.use("/orders", OrderRouter);

export default router;
