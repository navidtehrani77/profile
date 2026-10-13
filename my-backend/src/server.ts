import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;

// تنظیمات میدل‌ورها (Middleware)
app.use(cors({
  origin: 'http://localhost:3000', // آدرس فرانت‌اند Next.js شما
  credentials: true
}));

app.use(express.json());

// تعریف تایپ بدنه درخواست فرم تماس
interface ContactRequestBody {
  name: string;
  email: string;
  phone: string;
  message: string;
}

// اندپوینت دریافت فرم تماس
app.post('/api/contact', (req: Request<{}, {}, ContactRequestBody>, res: Response) => {
  const { name, email, phone, message } = req.body;

  if (!name || !email || !phone || !message) {
    return res.status(400).json({
      success: false,
      message: 'لطفاً تمام فیلدها را پر کنید.'
    });
  }

  console.log('پیام دریافت شد:', { name, email, phone, message });

  return res.status(200).json({
    success: true,
    message: 'پیام شما با موفقیت دریافت شد.'
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
// روت تست برای مسیر اصلی
app.get('/', (req, res) => {
  res.send('API Server is running successfully!');
});