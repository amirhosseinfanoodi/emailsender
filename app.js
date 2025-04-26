// const express = require('express');
// const bodyParser = require('body-parser');
// const nodemailer = require('nodemailer');
// const app = express();



// // فرم لاگین
// app.get('/', (req, res) => {
//   res.render('login');
// });

// app.post('/login', async (req, res) => {
//     const { email, name } = req.body;
  
//     const transporter = nodemailer.createTransport({
//       host: 'smtp.ethereal.email',
//       port: 587,
//       auth: {
//         user: 'rowena8@ethereal.email',
//         pass: 'u11SHB52pFr1t6ZvfQ'
//       }
//     });
  
//     const mailOptions = {
//       from: '"سایت ما" <rowena8@ethereal.email>',
//       to: email,
//       subject: 'خوش آمدید!',
//       html: `<h2>سلام ${name} عزیز!</h2><p>به سایت ما خوش اومدی! 🎉</p>`
//     };
  
//     try {
//       let info = await transporter.sendMail(mailOptions);
  
//       console.log('Message sent: %s', info.messageId);
//       console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  
//       res.send(`
//         <p>ایمیل خوش‌آمدگویی برای ${name} ارسال شد.</p>
//         <p><a href="${nodemailer.getTestMessageUrl(info)}" target="_blank">مشاهده ایمیل</a></p>
//       `);
//     } catch (err) {
//       console.error(err);
//       res.send('ارسال ایمیل با خطا مواجه شد.');
//     }
//   });
  

// const PORT = 3000;
// app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));


const express = require('express');
const multer = require('multer');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
// تنظیم محل ذخیره عکس‌ها
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // فولدر مقصد
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // اسم فایل با زمان
  }
});

const upload = multer({ storage: storage });



// صفحه اصلی با نمایش عکس‌ها
app.get('/', (req, res) => {
  fs.readdir(path.join(__dirname, 'uploads'), (err, files) => {
    if (err) files = [];
    res.render('login', { images: files });
  });
});



// مسیر دریافت عکس
app.post('/upload', upload.single('image'), (req, res) => {
  console.log('فایل آپلود شده:', req.file);
  res.send('عکس با موفقیت آپلود شد!');
});

app.post('/delete', (req, res) => {
  const filename = req.body.filename;
  const filePath = path.join(__dirname, 'uploads', filename);
  fs.unlink(filePath, (err) => {
    if (err) console.error('خطا در حذف فایل:', err);
    res.redirect('/');
  });
});

app.use('/uploads', express.static('uploads')); // نمایش عکس آپلود‌شده

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
