import express from "express";
import cors from "cors";
import userRoutes from "./routes/user.routes.js";
import authRoutes from "./routes/auth.routes.js";
import roleRoutes from "./routes/role.routes.js";
import skillRoutes from "./routes/skill.routes.js";
import permissionRoutes from "./routes/permission.routes.js";
import jobRoleRoutes from "./routes/jobRole.routes.js";
import candidateProfileRoutes from "./routes/candidateProfile.routes.js";
import errorHandler from './middlewares/errorHandler.middleware.js';
import cookieParser from "cookie-parser";
import jobCategoryRoutes from "./routes/jobCategory.routes.js";
import expereniceRoutes from "./routes/experience.routes.js";
import aiRoutes from './routes/ai.routes.js'
import { corsOptions } from "./config/corsOptions.js";
import jobapply from "./routes/jobApplication.routes.js";
import jobApplicationModel from "./models/jobApplication.model.js";
import { authenticateJWT } from "./middlewares/auth.middleware.js";
import awsRouter from './routes/aws.route.js'
import resendMailRoutes from "./routes/resendMail.routes.js";

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/permissions", permissionRoutes);
app.use("/api/jobs", jobRoleRoutes);
app.use("/api/job-categories", jobCategoryRoutes);
app.use("/api/job-apply",   jobapply);
app.use("/api/skills", skillRoutes);
app.use("/api/ai", aiRoutes)
app.use("/api/experience", expereniceRoutes);
app.use('/api/candidate-profile', candidateProfileRoutes);
app.use('/api/aws' , awsRouter)
app.use("/api/auth", resendMailRoutes);

app.use(errorHandler);
export default app;


