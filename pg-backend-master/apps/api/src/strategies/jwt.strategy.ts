import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import CONFIG from 'config';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request) => {
          return request?.cookies?.['access_token'];
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: CONFIG.JWT_ACCESS_SECRET,
    });
  }

  async validate(payload: { sub: string; username?: string; name?: string }) {
    return {
      id: payload.sub,
      username: payload.username,
      name: payload.name,
    };
  }
}
