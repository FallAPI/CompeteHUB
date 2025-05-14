    import express from 'express';
    import cors from 'cors';
    import cookieParser from 'cookie-parser'; 
    import adminRoutes from './src/routes/adminRoutes';
    import competitionsRoutes from "./src/routes/competitionsRoutes";
    import participantRoutes from "./src/routes/participantRoutes";

    const corsOptions = {
      origin: ['http://localhost:5501', 'http://127.0.0.1:5501'],
      credentials: true,  
    };

    const app = express();
    const PORT: number = 4000;

    app.use(cors(corsOptions));
    app.use(express.json());
    app.use(cookieParser());


    app.use('/admin', adminRoutes);
    app.use("/admin/api", competitionsRoutes);
    app.use("/admin/api", participantRoutes)

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
