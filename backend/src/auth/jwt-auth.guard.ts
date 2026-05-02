import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    // ✅ Allow Stripe webhook (NO JWT REQUIRED)
    if (request.originalUrl.includes('/payment/webhook')) {
      return true;
    }

    return super.canActivate(context);
  }
}
