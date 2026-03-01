import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'supersecretkey', // same secret as in JwtModule
    });
  }

  async validate(payload: any) {
    // This gets attached to req.user
    return { userId: payload.sub, role: payload.role };
  }
}
