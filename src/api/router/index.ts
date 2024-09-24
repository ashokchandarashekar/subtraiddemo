import express from "express";
import { authorize } from "../middleware/auth";
import quickbookRoutes from "./QuickBookRoutes/quickbook.routes";
import userAuthRoutes from "./AuthRoutes/auth.routes";
import usersRoutes from "./User/user.routes";

let router = express.Router();

router.use("/auth", userAuthRoutes);

// authorize api
// router.use(authorize);

router.use("/user", usersRoutes);
router.use("/quickbook", quickbookRoutes);

export { router as apiRouter };
