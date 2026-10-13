'use server';

import { PrismaClient } from '@prisma/client';

// تعریف الگو Singleton برای مدیریت اتصالات دیتابیس در محیط توسعه Next.js
const globalForPrisma = global as unknown as { prisma: PrismaClient };

const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export type FormState = {
  success: boolean;
  message: string;
};

export async function submitContactForm(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const phone = formData.get('phone') as string;
  const message = formData.get('message') as string;

  // اعتبارسنجی خالی نبودن فیلدها
  if (!name || !email || !phone || !message) {
    return {
      success: false,
      message: 'لطفاً تمامی فیلدها را پر کنید.',
    };
  }

  // اعتبارسنجی فرمت ایمیل
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {
      success: false,
      message: 'لطفاً یک آدرس ایمیل معتبر وارد کنید (مثال: example@gmail.com).',
    };
  }

  // اعتبارسنجی شماره موبایل
  const phoneRegex = /^(?:(?:\+?98)|0)?9\d{9}$/;
  if (!phoneRegex.test(phone.trim())) {
    return {
      success: false,
      message: 'لطفاً یک شماره موبایل معتبر ۱۱ رقمی وارد کنید (مثال: 09123456789).',
    };
  }

  try {
    // ذخیره مستقیم داده‌ها در پایگاه داده MySQL با Prisma
    await prisma.contactMessage.create({
      data: {
        name,
        email,
        phone,
        message,
      },
    });

    return {
      success: true,
      message: 'پیام شما با موفقیت دریافت شد! به‌زودی پاسخ خواهم داد.',
    };
  } catch (error) {
    console.error('خطا در ذخیره دیتابیس:', error);
    return {
      success: false,
      message: 'خطایی در ثبت اطلاعات در دیتابیس رخ داد. لطفاً مجدداً تلاش کنید.',
    };
  }
}