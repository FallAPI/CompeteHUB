import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();
const PORT: number = 3000;

app.use(cors());
app.use(express.json());

app.get('/api/hello', (req: Request, res: Response) => {
  res.json({
    message: "Hello from the backend!",
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
