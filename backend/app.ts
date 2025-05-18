    import express from 'express';
    import cors from 'cors';
    import  SwaggerUi  from 'swagger-ui-express';
    import { setupSwagger } from './src/swagger';
    import cookieParser from 'cookie-parser'; 


    //admin routes
    import adminRoutes from './src/routes/adminRoutes';
    import competitionsRoutes from "./src/routes/admin/competitionsRoutes";
    import participantRoutes from "./src/routes/admin/participantRoutes";

    //public routes
    import pubclicCompetitionRoutes from "./src/routes/public/publicCompetitionRoutes";
    import publicParticipantRoutes from "./src/routes/public/publicParticipantRoutes";

    const corsOptions = {
      origin: ['http://localhost:5501', 'http://localhost:5500'],
      credentials: true,  
    };

    const app = express();


    app.use(cors(corsOptions));
    app.use(express.json());
    app.use(cookieParser());

    setupSwagger(app);

    //public routes
    app.use('/public/api', pubclicCompetitionRoutes);
    app.use('/public/api', publicParticipantRoutes);

    
    //admin routes
    app.use('/admin', adminRoutes);
    app.use("/admin/api", competitionsRoutes);
    app.use("/admin/api", participantRoutes)

    const PORT: number = parseInt(process.env.PORT as string, 10) || 4000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
