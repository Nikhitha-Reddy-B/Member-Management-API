import express from 'express';
import dotenv from 'dotenv';
import sequelize from './config/db';
import memberRoutes from './routes/member.routes';
import roleRoutes from './routes/role.routes';
import memberRoleRoutes from './routes/memberRole.routes';
import './models';

dotenv.config();

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Welcome to the Member Management API. Visit /members or /roles');
});

app.use('/members', memberRoutes);
app.use('/roles', roleRoutes);
app.use('/member_roles', memberRoleRoutes);

async function start() {
  try {
    await sequelize.sync({ alter: true });
    console.log('Database synced');

    app.listen(process.env.PORT || 3000, () => {
      console.log(`Server running on http://localhost:${process.env.PORT || 3000}`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
  }
}

start();
