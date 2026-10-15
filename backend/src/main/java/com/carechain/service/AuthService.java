package com.carechain.service;

import com.carechain.config.JwtTokenProvider;
import com.carechain.dto.AuthResponse;
import com.carechain.dto.LoginRequest;
import com.carechain.dto.RegisterRequest;
import com.carechain.dto.UserDto;
import com.carechain.entity.*;
import com.carechain.exception.BadRequestException;
import com.carechain.exception.UnauthorizedException;
import com.carechain.repository.DoctorProfileRepository;
import com.carechain.repository.PatientProfileRepository;
import com.carechain.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PatientProfileRepository patientProfileRepository;

    @Autowired
    private DoctorProfileRepository doctorProfileRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private AuditService auditService;

    @Autowired
    private UserService userService;

    @Transactional
    public AuthResponse login(LoginRequest request, String ipAddress) {
        Optional<User> userOpt = userRepository.findByEmail(request.getEmail().trim().toLowerCase());

        if (userOpt.isEmpty() || !passwordEncoder.matches(request.getPassword(), userOpt.get().getPassword())) {
            auditService.logEvent(
                    AuditEventType.LOGIN_FAILURE,
                    userOpt.orElse(null),
                    null,
                    AuditOutcome.FAILURE,
                    ipAddress,
                    "Failed login attempt for email: " + request.getEmail()
            );
            throw new UnauthorizedException("Invalid email or password");
        }

        User user = userOpt.get();
        if (!user.isActive()) {
            throw new UnauthorizedException("This user account has been deactivated");
        }

        String token = jwtTokenProvider.generateToken(user.getEmail(), user.getRole().name(), user.getId());
        UserDto userDto = userService.mapToDto(user);

        auditService.logEvent(
                AuditEventType.LOGIN_SUCCESS,
                user,
                null,
                AuditOutcome.SUCCESS,
                ipAddress,
                "User successfully authenticated with role: " + user.getRole()
        );

        return new AuthResponse(token, userDto);
    }

    @Transactional
    public AuthResponse register(RegisterRequest request, String ipAddress) {
        String email = request.getEmail().trim().toLowerCase();

        if (userRepository.existsByEmail(email)) {
            throw new BadRequestException("An account with email " + email + " already exists");
        }

        if (request.getRole() == Role.ADMIN) {
            throw new BadRequestException("Direct public registration for ADMIN role is not permitted.");
        }

        User user = new User(
                email,
                passwordEncoder.encode(request.getPassword()),
                request.getFullName().trim(),
                request.getRole()
        );
        User savedUser = userRepository.save(user);

        if (request.getRole() == Role.PATIENT) {
            PatientProfile patientProfile = new PatientProfile(savedUser);
            patientProfile.setBloodGroup(request.getBloodGroup());
            patientProfile.setGender(request.getGender());
            patientProfile.setEmergencyContact(request.getEmergencyContact());
            patientProfileRepository.save(patientProfile);
        } else if (request.getRole() == Role.DOCTOR) {
            DoctorProfile doctorProfile = new DoctorProfile(
                    savedUser,
                    request.getSpecialization() != null ? request.getSpecialization() : "General Practice",
                    request.getLicenseNumber() != null ? request.getLicenseNumber() : "MED-" + System.currentTimeMillis() % 100000,
                    request.getHospitalAffiliation() != null ? request.getHospitalAffiliation() : "Community Medical Center"
            );
            doctorProfileRepository.save(doctorProfile);
        }

        String token = jwtTokenProvider.generateToken(savedUser.getEmail(), savedUser.getRole().name(), savedUser.getId());
        UserDto userDto = userService.mapToDto(savedUser);

        auditService.logEvent(
                AuditEventType.LOGIN_SUCCESS,
                savedUser,
                null,
                AuditOutcome.SUCCESS,
                ipAddress,
                "New account registered with role: " + savedUser.getRole()
        );

        return new AuthResponse(token, userDto);
    }
}
