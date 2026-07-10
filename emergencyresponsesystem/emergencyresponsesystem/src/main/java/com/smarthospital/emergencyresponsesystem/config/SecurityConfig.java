package com.smarthospital.emergencyresponsesystem.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    public SecurityConfig(JwtAuthFilter jwtAuthFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // Public endpoints - no login needed
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/ws/**").permitAll()
                        .requestMatchers("GET", "/api/hospitals/**").permitAll()
                        .requestMatchers("GET", "/api/ambulances/**").permitAll()
                        .requestMatchers("GET", "/api/patients/**").permitAll()
                        .requestMatchers("POST", "/api/emergency-requests/**").permitAll()
                        .requestMatchers("GET", "/api/emergency-requests/**").permitAll()

                        // Admin-only endpoints - write operations
                        .requestMatchers("POST", "/api/hospitals/**").hasRole("ADMIN")
                        .requestMatchers("PUT", "/api/hospitals/**").hasRole("ADMIN")
                        .requestMatchers("DELETE", "/api/hospitals/**").hasRole("ADMIN")
                        .requestMatchers("POST", "/api/patients/**").hasRole("ADMIN")
                        .requestMatchers("DELETE", "/api/patients/**").hasRole("ADMIN")
                        .requestMatchers("POST", "/api/ambulances/**").hasRole("ADMIN")
                        .requestMatchers("PUT", "/api/ambulances/**").hasRole("ADMIN")
                        .requestMatchers("DELETE", "/api/ambulances/**").hasRole("ADMIN")

                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(List.of("*"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}