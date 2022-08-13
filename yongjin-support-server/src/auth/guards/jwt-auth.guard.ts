import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * JwtAuthGuard
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
