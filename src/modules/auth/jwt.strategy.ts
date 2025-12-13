import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

// Working of this is below
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private config:ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get<string>('JWT_SECRET') ,
    });
  }
  // push inside req.user automatically by nest.js
  async validate(payload: any) {
    return { userId: payload.sub };
  }
}

/*
* How it is being instantiated ....
      App starts
        ↓
      AuthModule loads
        ↓
      JwtStrategy instantiated
        ↓
      Strategy auto-registered with Passport as 'jwt'
        ↓
      Request comes in
        ↓
      @UseGuards(JwtAuthGuard)
        ↓
      AuthGuard('jwt') asks Passport
        ↓
      Passport runs JwtStrategy
        ↓
      JWT verified
        ↓
      validate(payload) runs
        ↓
      req.user set
        ↓
      Controller executes
*/