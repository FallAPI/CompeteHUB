    import express from 'express';
    import cors from 'cors';
    import cookieParser from 'cookie-parser'; 
    import adminRoutes from './src/routes/adminRoutes';
    import competitionsRoutes from "./src/routes/competitionsRoutes";
    import participantRoutes from "./src/routes/participantRoutes";

    const corsOptions = {
      origin: ['http://localhost:5501', 'http://localhost:5500'],
      credentials: true,  
    };

    const app = express();


    app.use(cors(corsOptions));
    app.use(express.json());
    app.use(cookieParser());


    app.use('/admin', adminRoutes);
    app.use("/admin/api", competitionsRoutes);
    app.use("/admin/api", participantRoutes)

    const PORT: number = parseInt(process.env.PORT as string, 10) || 4000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
