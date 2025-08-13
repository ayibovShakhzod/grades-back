import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class TokenAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers['authorization'];
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }
    try {
      const response = await axios.get(
        `${process.env.STRAPI_URL}/admin/users/me`,
        {
          headers: {
            Authorization: token,
          },
        },
      );
      if (response.status === 200 && response.data) {
        // Optionally attach user info to request
        request.user = response.data;
        return true;
      }
      throw new UnauthorizedException('Invalid token');
    } catch (error) {
      throw new UnauthorizedException('Token validation failed');
    }
  }
}
