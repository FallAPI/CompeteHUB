import express from 'express';
import cors from 'cors';
import adminRoutes from './src/routes/adminRoutes';

const app = express();
const PORT: number = 4000;

app.use(cors());
app.use(express.json());


app.use('/api/admin', adminRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
