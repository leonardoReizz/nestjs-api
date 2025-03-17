import { Global, Module } from '@nestjs/common';

import { PrismaService } from './infra/prisma.service';
import { UserModule } from './modules/user/user.module';
import { AuthenticateModule } from './modules/authenticate/authenticate.module';

@Global()
@Module({
  imports: [UserModule, AuthenticateModule],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class AppModule {}
