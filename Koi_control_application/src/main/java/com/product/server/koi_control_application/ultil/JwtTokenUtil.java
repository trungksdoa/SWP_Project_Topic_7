package com.product.server.koi_control_application.ultil;

import com.product.server.koi_control_application.model.Users;
import io.jsonwebtoken.*;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.util.Date;

@Component
public class JwtTokenUtil {
    private static final long EXPIRE_DURATION = 24 * 60 * 60 * 1000; // 24 hour

    @Value("${app.jwt.secret}")
    private String SECRET_KEY;

    public String generateAccessToken(Users user) {
        return Jwts.builder()
                .setSubject(String.format("%s,%s", user.getId(), user.getEmail()))
                .setIssuer("FPT University")
                .claim("roles", user.getRoles().toString())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRE_DURATION))
                .signWith(SignatureAlgorithm.HS512, SECRET_KEY)
                .compact();
    }


    public boolean validateAccessToken(String token) {
        try {
            Jwts.parser().setSigningKey(SECRET_KEY).parseClaimsJws(token);
            return true;
        } catch (ExpiredJwtException ex) {
            throw new ExpiredJwtException(null, null, "Token is expired");
        } catch (IllegalArgumentException ex) {
            throw new IllegalArgumentException("Token is null, empty or only whitespace");
        } catch (MalformedJwtException ex) {
            throw new MalformedJwtException("Token is invalid");
        } catch (UnsupportedJwtException ex) {
            throw new UnsupportedJwtException("JWT is not supported");
        } catch (SignatureException ex) {
            throw new SignatureException("Signature validation failed");
        }
    }
    public String getSubject(String token) {
        return parseClaims(token).getSubject();
    }

    public int getUserIdFromToken(HttpServletRequest request) {
        String token = getTokenFromRequest(request);
        if (token != null) {
            Claims claims = parseClaims(token);

            String subject = claims.getSubject();
            String[] parts = subject.split(",");
            return Integer.parseInt(parts[0]);
        }
       throw new IllegalArgumentException("Token is null, empty or only whitespace");
    }

    private String getTokenFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }

    protected Claims parseClaims(String token) {
        return Jwts.parser()
                .setSigningKey(SECRET_KEY)
                .parseClaimsJws(token)
                .getBody();
    }
}
