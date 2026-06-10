import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import {corsOptions} from "./config/corsOptions.js";
import errorHandler from "./middlewares/errorHandler.middleware.js";
import candidateProfileRoutes from "./routes/candidateProfile.routes.js";
import testRoutes from "./routes/test.routes.js";
import testEnrollmentRoutes from "./routes/TestEnrollment.routes.js";
import testAttemptRoutes from "./routes/testAttempts.routes.js";
import awsRouter from './routes/aws.route.js'
import resendMailRoutes from "./routes/resendMail.routes.js";
// import { sendWelcomeEmail } from "./services/sendMail.js";
import productRoute from "./routes/product.routes.js";

const app = express();
app.set("trust proxy", 1);  
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));
app.use("/api/tests", testRoutes);
app.use("/api/enrollments", testEnrollmentRoutes);
app.use("/api/test-attempts", testAttemptRoutes);
app.use("/api/candidate-profile", candidateProfileRoutes);
app.use("/api/aws", awsRouter);
app.use("/api/auth", resendMailRoutes);
app.use("/api/products", productRoute);
// await sendWelcomeEmail({
//   to: "agr.rbih@gmail.com",
//   name: "Rohan",

app.use(errorHandler);
export default app;