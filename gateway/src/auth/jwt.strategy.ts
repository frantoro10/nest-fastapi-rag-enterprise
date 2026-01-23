import { Injectable } from "@nestjs/common";
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { passportJwtSecret } from "jwks-rsa";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private configService: ConfigService) {
        // Configuración que necesita la clase de la que "heredamos" PassportStrategy, se llama a super para pasarlas. | Configuration Super.
        const supabaseUrl = configService.get<string>('SUPABASE_URL');
        super({
            // Donde buscar el token (Header: Authorization Bearer ...)
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            // No ignorar tokens expirados por seguridad - No ignore expirated tokens for security
            ignoreExpiration: false,
            // En lugar de usar una contraseña fija del .env, le decimos a Passport: "Vete a esta URL de Supabase, descárgate las llaves públicas y verifica la firma".
            secretOrKeyProvider: passportJwtSecret({
                cache: true,
                rateLimit: true, // Evitar saturar
                jwksRequestsPerMinute: 5,
                jwksUri: `${supabaseUrl}/auth/v1/.well-known/jwks.json`,
             }),
             algorithms: ['ES256'],
        });
    }

    // Función que se ejecuta si ell token es válido, el return se inyecta en req.user en mis controladores - If the token is valid:
    async validate(payload: any) {
        // payload es el contenido decodificado del JWT
        return {
            userId: payload.sub, // 'sub' es el estándar de ID de usuario en JWT
            email: payload.email
        };
    }
}
