import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UsersService } from '../users/users.service';
import { Role } from '../common/enums';

async function bootstrap() {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin_tuvision@tuvision.cl';
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    console.error('Error: ADMIN_PASSWORD environment variable is required');
    console.log('Usage: ADMIN_PASSWORD=your_password npm run seed:admin');
    process.exit(1);
  }

  const app = await NestFactory.createApplicationContext(AppModule);
  const usersService = app.get(UsersService);

  try {
    const existingAdmin = await usersService.findByEmail(adminEmail);
    if (existingAdmin) {
      console.log('El usuario administrador ya existe');
      await app.close();
      return;
    }

    await usersService.create({
      email: adminEmail,
      password: adminPassword,
      nombre: 'Administrador Tu Visión',
      rut: '00.000.000-0',
      role: Role.ADMIN,
    });

    console.log('Usuario administrador creado exitosamente');
    console.log('Email:', adminEmail);
    console.log('\nIMPORTANTE: Cambia la contraseña después del primer login');
  } catch (error) {
    console.error('Error al crear usuario administrador:', error);
  }

  await app.close();
}

void bootstrap();
