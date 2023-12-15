package com.flight.booking.config;

import java.io.IOException;
import java.util.Arrays;
import java.util.Objects;
import java.util.Optional;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.flight.booking.service.AuthService;
import com.flight.booking.util.JwtUtils;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.MalformedJwtException;

@Component
public class JwtRequestFilter extends OncePerRequestFilter {

	@Autowired
	private AuthService authService;
	@Value("${application.jwt.secret}")
	private String jwtSecret;
	@Value("${application.jwt.subject}")
	private String jwtSubject;

	@Override
	protected void doFilterInternal(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse,
			FilterChain filterChain) throws ServletException, IOException {
		String accessToken = httpServletRequest.getHeader("AccessToken");
		if (Objects.nonNull(accessToken) && accessToken.startsWith("Bearer ")) {
			String jwt = accessToken.substring(7);
			if (Objects.nonNull(jwt) && !authService.isLoggedoutToken(jwt)) {
				Claims claims = JwtUtils.parseToken(jwt, jwtSecret);
				if (!claims.getSubject().equals(jwtSubject)) {
					throw new MalformedJwtException("Subject not matched");
				}
				String email = (String) claims.get("email");
				Optional.ofNullable(authService.userDetails(email)).ifPresent(user -> {
					UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken = new UsernamePasswordAuthenticationToken(
							user, null, Arrays.asList(new SimpleGrantedAuthority("ROLE_" + user.getRole())));
					usernamePasswordAuthenticationToken
							.setDetails(new WebAuthenticationDetailsSource().buildDetails(httpServletRequest));
					SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);
				});
			}
		}
		filterChain.doFilter(httpServletRequest, httpServletResponse);
	}

}