import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // Global is used so that for other modules do not need to import manually, it will be injected globally
@Module({
  providers: [PrismaService],
  exports: [PrismaService], // This is needed so that Other Modules can find it
})
export class PrismaModule {}
