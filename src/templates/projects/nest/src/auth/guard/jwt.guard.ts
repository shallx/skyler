import { AuthGuard } from '@nestjs/passport';

// This class is made because it pretty boring to write AuthGuard('jwt') everywhere
// use can use JwtGuard instead, just for simplicity
export class JwtGuard extends AuthGuard('jwt') {
  constructor() {
    super();
  }
}
