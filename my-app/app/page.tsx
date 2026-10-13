'use client';

import React, { useState, useActionState, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import Image from 'next/image';
import { submitContactForm, FormState } from './actions';

const PROFILE_IMAGE_SRC = '/Rng.jpg';
const initialState: FormState = {
  success: false,
  message: '',
};

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } 
  },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

function LanguageBar({ label, percent, isDark = true }: { label: string; percent: string; isDark?: boolean }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm font-medium">
        <span className={isDark ? 'text-amber-100' : 'text-slate-700'}>{label}</span>
        <span className="text-amber-400 font-mono">{percent}</span>
      </div>
      <div className={`h-2 w-full rounded-full overflow-hidden ${isDark ? 'bg-zinc-800' : 'bg-slate-200'}`}>
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: percent }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full"
        />
      </div>
    </div>
  );
}

const translations = {
  fa: {
    nav: {
      about: 'درباره من',
      experience: 'سوابق شغلی',
      skills: 'مهارت‌ها',
      education: 'تحصیلات',
      contact: 'تماس با من',
      hireMe: 'دعوت به همکاری',
    },
    hero: {
      tag: 'نوید اوینی تهرانی | مهندس نرم‌افزار & توسعه‌‌دهنده فرانت‌اند',
      titleName: 'نوید اوینی طهرانی',
      titleRole: 'توسعه‌دهنده فرانت‌اند (Front-End Developer)',
      desc: 'برنامه‌نویس وب مسلط به فرانت‌اند (React, Next.js, TypeScript) و مفاهیم پایه‌ای بک‌اند (Node.js, PostgreSQL)، علاقه‌مند به چالش، کار تیمی و یادگیری مداوم.',
      btnExp: 'بررسی سوابق شغلی',
      btnContact: 'تماس و ارتباط',
    },
    aboutSection: {
      title: 'درباره من',
      subtitle: 'شناخت بیشتر از مسیر حرفه‌ای و دیدگاه من',
      desc1: 'من نوید اوینی تهرانی هستم، مهندس نرم‌افزار و توسعه‌دهنده فرانت‌اند با اشتیاق بالا برای خلق رابط‌های کاربری مدرن، سریع و کاربرپسند. همواره تلاش می‌کنم با استفاده از جدیدترین تکنولوژی‌های دنیای وب مانند React و Next.js ایده‌ها را به محصولات نرم‌افزاری باکیفیت تبدیل کنم.',
      desc2: 'علاوه بر برنامه‌نویسی، دارای پس‌زمینه قوی در شبکه و IT هستم که به من دید عمیق‌تری نسبت به زیرساخت‌ها، ارتباطات شبکه و حل مسائل فنی می‌دهد.'
    },
    experience: {
      title: 'سوابق شغلی (Work Experience)',
      subtitle: 'تجربیات حرفه‌ای و مسئولیت‌های اجرایی',
      job1: {
        role: 'Software Engineer / Front-End Developer',
        company: 'مرکز نوآوری دانشگاه آزاد اسلامی واحد پردیس | تهران، ایران',
        date: ' ۲۰۱۹ –  ۲۰۲۱',
        points: [
          'توسعه و بهینه‌سازی اپلیکیشن‌های وب با استفاده از فریم‌ورک‌های مدرن.',
          'طراحی و پیاده‌سازی RESTful APIها جهت ارتباط مطمئن بین کلاینت و سرور.',
          'تست، رفع خطا (Debugging) و ارتقای کیفیت و سرعت اجرا.',
          'همکاری با تیم‌های مختلف برای تحلیل نیازمندی‌ها و ارائه راهکارهای نرم‌افزاری.',
          'مستندسازی فرآیند توسعه جهت بهبود یادگیری و تسهیل همکاری تیمی.',
        ]
      },
      job2: {
        role: 'IT Help Desk / Hardware Specialist',
        company: 'مرکز کامپیوتر ولیعصر | تهران، ایران',
        date: '۲۰۲۱ – ۲۰۲۳',
        points: [
          'اسمبل، کانفیگ و عیب‌یابی تخصصی قطعات سخت‌افزاری.',
          'نصب و راه‌اندازی سیستم‌عامل‌ها، درایورها و نرم‌افزارهای تخصصی.',
        ]
      }
    },
    skills: {
      title: 'مهارت‌ها و سطح زبان انگلیسی',
      subtitle: 'دانش فنی و قابلیت‌های ارتباطی بین‌المللی',
      langTitle: 'مهارت‌های زبان انگلیسی (English Proficiency)',
      reading: 'Reading (خواندن)',
      speaking: 'Speaking (مکالمه)',
      listening: 'Listening (شنیداری)',
      writing: 'Writing (نوشتاری)',
    },
    education: {
      title: 'تحصیلات (Education)',
      degree: 'کارشناسی مهندسی نرم‌‌افزار (B.Sc. in Software Engineering)',
      university: 'دانشگاه آزاد اسلامی واحد پردیس | تهران',
      date: ' ۲۰۱۵ – ۲۰۲۱',
    },
    contact: {
      title: 'راه ارتباطی',
      subtitle: 'می‌توانید از طریق راه‌های زیر مستقیم با من در تماس باشید:',
      emailLabel: 'ایمیل مستقیم',
      phoneLabel: 'شماره همراه / واتساپ',
      githubLabel: 'گیت‌هاب (GitHub)',
      telegramLabel: 'تلگرام (Telegram)',
      instagramLabel: 'اینستاگرام (Instagram)',
      formTitle: 'ارسال پیام مستقیم',
      formSubtitle: 'پیام خود را ارسال کنید، در سریع‌ترین زمان پاسخگو خواهم بود.',
      nameLabel: 'نام شما',
      namePlaceholder: 'مثال: علی محمدی',
      emailInputLabel: 'آدرس ایمیل شما',
      phoneInputLabel: 'شماره تماس شما',
      messageLabel: 'متن پیام',
      messagePlaceholder: 'توضیحات مربوط به پروژه یا پیشنهاد شغلی...',
      submitBtn: 'ارسال پیام',
      submitting: 'در حال ارسال پیام...',
    },
    footer: 'طراحی و توسعه داده‌شده توسط نوید اِوینی تهرانی با Next.js & TypeScript © '
  },
  en: {
    nav: {
      about: 'About',
      experience: 'Experience',
      skills: 'Skills',
      education: 'Education',
      contact: 'Contact',
      hireMe: 'Hire Me',
    },
    hero: {
      tag: 'Navid Evini Tehrani | Software Engineer & Front-End Developer',
      titleName: 'Navid Evini Tehrani',
      titleRole: 'Front-End Developer',
      desc: 'Web developer proficient in Front-End (React, Next.js, TypeScript) and core Back-End concepts (Node.js, PostgreSQL), passionate about problem-solving, teamwork, and continuous learning.',
      btnExp: 'Explore Experience',
      btnContact: 'Get In Touch',
    },
    aboutSection: {
      title: 'About Me',
      subtitle: 'Learn more about my professional journey and mindset',
      desc1: 'I am Navid Evini Tehrani, a Software Engineer and Front-End Developer passionate about building modern, fast, and user-friendly web applications using React and Next.js.',
      desc2: 'With a solid background in IT and Networking, I have a deep understanding of infrastructure and technical problem-solving.'
    },
    experience: {
      title: 'Work Experience',
      subtitle: 'Professional background & key responsibilities',
      job1: {
        role: 'Software Engineer / Front-End Developer',
        company: 'Pardis Islamic Azad University Innovation Center | Tehran, Iran',
        date: 'Oct 2019 – May 2021',
        points: [
          'Developing and optimizing web applications using modern frameworks.',
          'Designing and implementing RESTful APIs for reliable client-server communication.',
          'Testing, debugging, and improving runtime performance and code quality.',
          'Collaborating with cross-functional teams to analyze requirements and deliver software solutions.',
          'Documenting development processes to enhance team collaboration and knowledge sharing.',
        ]
      },
      job2: {
        role: 'IT Help Desk / Hardware Specialist',
        company: 'Vali-asr Computer Center | Tehran, Iran',
        date: '2021 – 2023',
        points: [
          'Assembling, configuring, and troubleshooting hardware components.',
          'Installing operating systems, drivers, and specialized software.',
        ]
      }
    },
    skills: {
      title: 'Skills & Language Proficiency',
      subtitle: 'Technical expertise & international communication abilities',
      langTitle: 'English Language Proficiency',
      reading: 'Reading',
      speaking: 'Speaking',
      listening: 'Listening',
      writing: 'Writing',
    },
    education: {
      title: 'Education',
      degree: 'B.Sc. in Software Engineering',
      university: 'Islamic Azad University, Pardis Branch | Tehran, Iran',
      date: 'Oct 2015 – Jul 2021',
    },
    contact: {
      title: 'Contact Information',
      subtitle: 'Feel free to reach out to me directly through the following channels:',
      emailLabel: 'Direct Email',
      phoneLabel: 'Phone / WhatsApp',
      githubLabel: 'GitHub Profile',
      telegramLabel: 'Telegram Channel/Chat',
      instagramLabel: 'Instagram Profile',
      formTitle: 'Send a Message',
      formSubtitle: 'Send your message and I will get back to you as soon as possible.',
      nameLabel: 'Your Name',
      namePlaceholder: 'e.g., John Doe',
      emailInputLabel: 'Email Address',
      phoneInputLabel: 'Phone Number',
      messageLabel: 'Message',
      messagePlaceholder: 'Project details or job opportunity...',
      submitBtn: 'Send Message',
      submitting: 'Sending Message...',
    },
    footer: 'Designed & Developed by Navid Evini Tehrani with Next.js & TypeScript © '
  }
};

const techStack = [
  { name: 'HTML & CSS', level: 'Semantic & Responsive UI', icon: '🌐' },
  { name: 'TypeScript', level: 'Strict Type System', icon: '📘' },
  { name: 'React', level: 'Hooks & Modern Web Apps', icon: '⚛️' },
  { name: 'Next.js', level: 'App Router & SSR', icon: '⚡' },
  { name: 'JavaScript', level: 'ES6+ & DOM Manipulation', icon: '🟨' },
  { name: 'Node.js & REST API', level: 'Backend Fundamentals', icon: '🟢' },
  { name: 'PostgreSQL & Git', level: 'Database & Version Control', icon: '🐘' },
  { name: 'Network+ & MCSA & A+', level: 'IT & Infrastructure Foundation', icon: '🖥' },
];

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [lang, setLang] = useState<'fa' | 'en'>('fa');
  const [mounted, setMounted] = useState(false);

  const [state, formAction, isPending] = useActionState(submitContactForm, initialState);

  useEffect(() => {
    setMounted(true);
    const savedLang = localStorage.getItem('lang') as 'fa' | 'en';
    if (savedLang) setLang(savedLang);
  }, []);

  const toggleLang = () => {
    const newLang = lang === 'fa' ? 'en' : 'fa';
    setLang(newLang);
    localStorage.setItem('lang', newLang);
  };

  const t = translations[lang];

  if (!mounted) {
    return <div className="min-h-screen bg-black" />;
  }

  return (
    <div dir={lang === 'fa' ? 'rtl' : 'ltr'} className="min-h-screen font-sans selection:bg-amber-400 selection:text-black bg-black text-white">
      
      {/* هدر مشکی با گزینه‌های طلایی */}
      <motion.header 
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-black/90 border-b border-amber-500/20 shadow-lg"
      >
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="text-xl font-black text-amber-400 dir-ltr tracking-wider">
            Navid Tehrani 
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-bold text-amber-400">
            <a href="#about" className="hover:text-amber-200 transition-colors">{t.nav.about}</a>
            <a href="#experience" className="hover:text-amber-200 transition-colors">{t.nav.experience}</a>
            <a href="#skills" className="hover:text-amber-200 transition-colors">{t.nav.skills}</a>
            <a href="#education" className="hover:text-amber-200 transition-colors">{t.nav.education}</a>
            <a href="#contact" className="hover:text-amber-200 transition-colors">{t.nav.contact}</a>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={toggleLang}
              className="px-3 py-1.5 rounded-full text-xs font-bold transition-all border flex items-center justify-center gap-1 bg-zinc-900 border-amber-500/40 text-amber-400 hover:bg-amber-400 hover:text-black"
              title={lang === 'fa' ? 'Switch to English' : 'تغییر به فارسی'}
            >
              <span>🌐</span>
              <span>{lang === 'fa' ? 'EN' : 'فا'}</span>
            </button>

            <a
              href="#contact"
              className="hidden md:inline-flex items-center gap-2 px-5 py-2 rounded-full bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs transition-all shadow-md hover:scale-105"
            >
              {t.nav.hireMe}
            </a>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-xl border bg-zinc-900 border-amber-500/40 text-amber-400"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-b px-6 py-6 space-y-4 bg-black border-amber-500/20 text-amber-400"
            >
              <a href="#about" onClick={() => setIsOpen(false)} className="block font-bold">{t.nav.about}</a>
              <a href="#experience" onClick={() => setIsOpen(false)} className="block font-bold">{t.nav.experience}</a>
              <a href="#skills" onClick={() => setIsOpen(false)} className="block font-bold">{t.nav.skills}</a>
              <a href="#education" onClick={() => setIsOpen(false)} className="block font-bold">{t.nav.education}</a>
              <a href="#contact" onClick={() => setIsOpen(false)} className="block font-bold">{t.nav.contact}</a>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* بخش اول: پس‌زمینه مشکی، عکس با قاب مینیمال طلایی، متون طلایی و سفید */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 px-6 bg-black text-white overflow-hidden border-b border-zinc-800">
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
          >
            <div className="lg:col-span-7 text-center lg:text-right space-y-8">
              <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-semibold bg-zinc-900 border-amber-500/30 text-amber-400">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                {t.hero.tag}
              </motion.div>

              <motion.div variants={fadeInUp} className="space-y-3">
                <h1 className="text-4xl sm:text-6xl md:text-7xl font-black leading-tight text-amber-400 tracking-wide">
                  {t.hero.titleName}
                </h1>
                <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-amber-300">
                  {t.hero.titleRole}
                </h2>
              </motion.div>

              <motion.p 
                variants={fadeInUp}
                className="text-sm md:text-base leading-relaxed text-slate-300 max-w-2xl mx-auto lg:mx-0 text-justify md:text-right"
              >
                {t.hero.desc}
              </motion.p>

              <motion.div 
                variants={fadeInUp}
                className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2"
              >
                <a
                  href="#experience"
                  className="w-full sm:w-auto px-8 py-4 rounded-full bg-amber-400 hover:bg-amber-300 text-black font-bold transition-all shadow-lg shadow-amber-400/10 hover:scale-105 text-center"
                >
                  {t.hero.btnExp}
                </a>
                <a
                  href="#contact"
                  className="w-full sm:w-auto px-8 py-4 rounded-full border border-amber-400/40 text-amber-400 font-bold transition-all hover:scale-105 bg-zinc-900 hover:bg-zinc-800 text-center"
                >
                  {t.hero.btnContact}
                </a>
              </motion.div>
            </div>

            {/* عکس با قاب مینیمال طلایی */}
            <motion.div 
              variants={fadeInUp}
              className="lg:col-span-5 flex justify-center items-center relative"
            >
              <div className="relative w-full max-w-xs sm:max-w-md aspect-[3/4] rounded-2xl p-1 bg-amber-400 border border-amber-300 shadow-2xl shadow-amber-500/10 overflow-hidden">
                <div className="w-full h-full rounded-xl overflow-hidden relative bg-zinc-900">
                  <Image 
                    src={PROFILE_IMAGE_SRC}
                    alt="Navid Evini Tehrani"
                    fill
                    className="object-cover object-center"
                    priority
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* بخش دوم: بک‌گراند لیمویی، متن مشکی (درباره من) */}
      <section id="about" className="py-24 px-6 bg-[#ffffff] text-black border-b border-amber-200">
        <div className="max-w-5xl mx-auto space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center space-y-4"
          >
            <h2 className="text-4xl font-black text-black">{t.aboutSection.title}</h2>
            <p className="text-zinc-700 font-medium">{t.aboutSection.subtitle}</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6 text-base md:text-lg leading-relaxed text-zinc-900 text-justify md:text-right max-w-3xl mx-auto font-medium"
          >
            <p>{t.aboutSection.desc1}</p>
            <p>{t.aboutSection.desc2}</p>
          </motion.div>
        </div>
      </section>

      {/* بخش سوم: بک‌گراند مشکی، بولدترین سوابق شغلی، متن بولد طلایی و قاب طلایی، توضیحات سفید */}
      <section id="experience" className="py-24 px-6 bg-black text-white border-b border-zinc-800">
        <div className="max-w-5xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center space-y-4 mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-black text-amber-400 tracking-tight">{t.experience.title}</h2>
            <p className="text-slate-400">{t.experience.subtitle}</p>
          </motion.div>

          <div className="space-y-8">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-8 rounded-3xl border-2 border-amber-400 bg-zinc-950 hover:shadow-lg hover:shadow-amber-400/5 transition-all"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4">
                <div>
                  <h3 className="text-2xl font-black text-amber-400">{t.experience.job1.role}</h3>
                  <p className="text-amber-300 font-bold text-base">{t.experience.job1.company}</p>
                </div>
                <span className="px-4 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-400 text-xs font-bold w-fit">
                  {t.experience.job1.date}
                </span>
              </div>
              <ul className="list-disc list-inside space-y-2 text-sm leading-relaxed text-slate-200">
                {t.experience.job1.points.map((point, i) => (
                  <li key={i}>{point}</li>
                ))}
              </ul>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-8 rounded-3xl border-2 border-amber-400 bg-zinc-950 hover:shadow-lg hover:shadow-amber-400/5 transition-all"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4">
                <div>
                  <h3 className="text-2xl font-black text-amber-400">{t.experience.job2.role}</h3>
                  <p className="text-amber-300 font-bold text-base">{t.experience.job2.company}</p>
                </div>
                <span className="px-4 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-400 text-xs font-bold w-fit">
                  {t.experience.job2.date}
                </span>
              </div>
              <ul className="list-disc list-inside space-y-2 text-sm leading-relaxed text-slate-200">
                {t.experience.job2.points.map((point, i) => (
                  <li key={i}>{point}</li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* بخش مهارت‌ها */}
      <section id="skills" className="py-24 px-6 bg-zinc-950 text-white border-b border-zinc-800">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center space-y-4 mb-16"
          >
            <h2 className="text-3xl font-extrabold text-amber-400">{t.skills.title}</h2>
            <p className="text-slate-400">{t.skills.subtitle}</p>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
          >
            {techStack.map((tech, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="p-6 rounded-2xl bg-zinc-900 border border-amber-500/20 shadow-sm transition-all hover:border-amber-400"
              >
                <div className="text-3xl mb-4">{tech.icon}</div>
                <h3 className="text-xl font-bold mb-1 text-amber-400">{tech.name}</h3>
                <p className="text-xs text-slate-300">{tech.level}</p>
              </motion.div>
            ))}
          </motion.div>

          <div className="max-w-3xl mx-auto p-8 rounded-3xl border border-amber-500/20 bg-zinc-900">
            <h3 className="text-xl font-bold mb-6 text-center text-amber-400">{t.skills.langTitle}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <LanguageBar label={t.skills.reading} percent="100%" isDark={true} />
              <LanguageBar label={t.skills.speaking} percent="100%" isDark={true} />
              <LanguageBar label={t.skills.listening} percent="100%" isDark={true} />
              <LanguageBar label={t.skills.writing} percent="75%" isDark={true} />
            </div>
          </div>
        </div>
      </section>

      {/* بخش تحصیلات */}
      <section id="education" className="py-24 px-6 bg-black text-white border-b border-zinc-800">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-3xl font-extrabold text-amber-400">{t.education.title}</h2>
          <div className="p-8 rounded-3xl border border-amber-500/20 bg-zinc-950">
            <h3 className="text-2xl font-bold mb-2 text-white">{t.education.degree}</h3>
            <p className="text-amber-400 font-medium text-sm mb-2">{t.education.university}</p>
            <p className="text-xs text-slate-400">{t.education.date}</p>
          </div>
        </div>
      </section>

      {/* بخش ششم (آخر صفحه): راه ارتباطی با آیکون‌های شبکه اجتماعی، شماره تماس، گیت‌هاب، تلگرام، اینستاگرام، ایمیل و... */}
      <section id="contact" className="py-24 px-6 bg-black text-white">
        <div className="max-w-5xl mx-auto space-y-12">
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center space-y-6"
          >
            <h2 className="text-4xl font-extrabold text-white">{t.contact.title}</h2>
            <p className="text-slate-400">{t.contact.subtitle}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto pt-4">
              
              {/* شماره همراه */}
              <div className="p-6 rounded-2xl border border-amber-500/20 bg-zinc-950 flex flex-col items-center gap-3 hover:border-amber-400 transition-colors">
                <span className="text-3xl">📱</span>
                <span className="text-xs font-medium text-slate-400">{t.contact.phoneLabel}</span>
                <a 
                  href="tel:09033877515" 
                  className="text-amber-400 hover:text-amber-300 font-mono text-sm transition-colors"
                >
                  <bdi dir="ltr">09033877515</bdi>
                </a>
              </div>

              {/* ایمیل */}
              <div className="p-6 rounded-2xl border border-amber-500/20 bg-zinc-950 flex flex-col items-center gap-3 hover:border-amber-400 transition-colors">
                <span className="text-3xl">✉️</span>
                <span className="text-xs font-medium text-slate-400">{t.contact.emailLabel}</span>
                <a 
                  href="mailto:navidtehrani77@gmail.com" 
                  className="text-amber-400 hover:text-amber-300 font-mono text-sm transition-colors"
                >
                  navidtehrani77@gmail.com
                </a>
              </div>

              {/* گیت‌هاب */}
              <div className="p-6 rounded-2xl border border-amber-500/20 bg-zinc-950 flex flex-col items-center gap-3 hover:border-amber-400 transition-colors">
                <span className="text-3xl">💻</span>
                <span className="text-xs font-medium text-slate-400">{t.contact.githubLabel}</span>
                <a 
                  href="https://github.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-amber-400 hover:text-amber-300 font-mono text-sm transition-colors"
                >
                github.com/navidtehrani77
                </a>
              </div>

              {/* تلگرام */}
              <div className="p-6 rounded-2xl border border-amber-500/20 bg-zinc-950 flex flex-col items-center gap-3 hover:border-amber-400 transition-colors">
                <span className="text-3xl">✈️️</span>
                <span className="text-xs font-medium text-slate-400">{t.contact.telegramLabel}</span>
                <a 
                  href="https://t.me" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-amber-400 hover:text-amber-300 font-mono text-sm transition-colors"
                >
                  
                </a>
              </div>

              {/* اینستاگرام */}
              <div className="p-6 rounded-2xl border border-amber-500/20 bg-zinc-950 flex flex-col items-center gap-3 hover:border-amber-400 transition-colors">
                <span className="text-3xl">📸</span>
                <span className="text-xs font-medium text-slate-400">{t.contact.instagramLabel}</span>
                <a 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-amber-400 hover:text-amber-300 font-mono text-sm transition-colors"
                >
                  
                </a>
              </div>

            </div>
          </motion.div>

          {/* فرم تماس */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto p-8 md:p-12 rounded-3xl border border-amber-500/20 bg-zinc-950 shadow-2xl"
          >
            <div className="text-center space-y-3 mb-8">
              <h3 className="text-2xl font-bold text-white">{t.contact.formTitle}</h3>
              <p className="text-sm text-slate-400">{t.contact.formSubtitle}</p>
            </div>

            <AnimatePresence mode="wait">
              {state.message && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`p-4 mb-6 rounded-xl text-sm text-center font-medium ${
                    state.success
                      ? 'bg-emerald-950 border border-emerald-500/30 text-emerald-300'
                      : 'bg-rose-950 border border-rose-500/30 text-rose-300'
                  }`}
                >
                  {state.message}
                </motion.div>
              )}
            </AnimatePresence>

            <form action={formAction} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-300">{t.contact.nameLabel}</label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder={t.contact.namePlaceholder}
                  className="w-full px-4 py-3.5 rounded-xl border border-zinc-800 bg-zinc-900 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-300">{t.contact.emailInputLabel}</label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="example@gmail.com"
                    className="w-full px-4 py-3.5 rounded-xl border border-zinc-800 bg-zinc-900 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 transition-colors text-left"
                    dir="ltr"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-300">{t.contact.phoneInputLabel}</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder="09123456789"
                    className="w-full px-4 py-3.5 rounded-xl border border-zinc-800 bg-zinc-900 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 transition-colors text-left"
                    dir="ltr"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-slate-300">{t.contact.messageLabel}</label>
                <textarea
                  name="message"
                  rows={4}
                  required
                  placeholder={t.contact.messagePlaceholder}
                  className="w-full px-4 py-3.5 rounded-xl border border-zinc-800 bg-zinc-900 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 transition-colors"
                />
              </div>

              <motion.button
                whileHover={{ scale: isPending ? 1 : 1.02 }}
                whileTap={{ scale: isPending ? 1 : 0.98 }}
                type="submit"
                disabled={isPending}
                className="w-full py-4 rounded-xl bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-black font-bold transition-all shadow-lg shadow-amber-400/10"
              >
                {isPending ? t.contact.submitting : t.contact.submitBtn}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* فوتر */}
      <footer className="py-8 text-center text-xs border-t border-zinc-800 bg-black text-slate-500">
        <p>{t.footer}{new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}