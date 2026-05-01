import express from 'express';
import session from 'express-session';
import methodOverride from 'method-override';
import 'dotenv/config';
import path from 'path';

import authRoutes from './routers/authRoutes';
import userRoutes from './routers/userRoutes';

const app = express();

// ✅ View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ✅ Middleware dasar
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// 🔥 1. SESSION (HARUS DI ATAS)
app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: false
}));

// 🔥 2. Inject user dari session
app.use((req: any, res, next) => {
  req.user = req.session?.user;
  next();
});

// 🔥 3. Method override (DELETE, PUT)
app.use(methodOverride('_method'));

// 🔥 4. Routes
app.use('/', authRoutes);
app.use('/users', userRoutes);

// ✅ Default route
app.get('/', (req, res) => {
  res.redirect('/login');
});

// 🚀 Start server
app.listen(process.env.PORT, () => {
  console.log(`Server running on http://localhost:${process.env.PORT}`);
});