import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { XOauthUserProfile } from '../../types/x-oauth.types';
import CONFIG from 'config';
import {
  EXPIRES_IN_ACCESS_TOKEN,
  EXPIRES_IN_REFRESH_TOKEN,
} from '../../constants';

@Injectable()
export class JwtAuthService {
  constructor(private readonly jwtService: JwtService) {}

  generateTokens(user: XOauthUserProfile): {
    accessToken: string;
    refreshToken: string;
  } {
    const payload = {
      sub: user.id,
      username: user.username,
      name: user.name,
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: EXPIRES_IN_ACCESS_TOKEN,
      secret: CONFIG.JWT_ACCESS_SECRET,
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: EXPIRES_IN_REFRESH_TOKEN,
      secret: CONFIG.JWT_REFRESH_SECRET,
    });

    return { accessToken, refreshToken };
  }

  verifyAccessToken(token: string): XOauthUserProfile {
    try {
      const payload = this.jwtService.verify(token, {
        secret: CONFIG.JWT_ACCESS_SECRET,
      });
      return {
        id: payload.sub,
        name: payload.name,
        username: payload.username,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid access token');
    }
  }

  verifyRefreshToken(token: string): XOauthUserProfile {
    try {
      const payload = this.jwtService.verify(token, {
        secret: CONFIG.JWT_REFRESH_SECRET,
      });
      return {
        id: payload.sub,
        username: payload.username,
        name: payload.name,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
