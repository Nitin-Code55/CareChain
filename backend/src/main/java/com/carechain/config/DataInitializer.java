package com.carechain.config;

import com.carechain.entity.*;
import com.carechain.repository.*;
import com.carechain.service.BlockchainService;
import com.carechain.service.FileStorageService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import java.time.LocalDate;
import java.util.UUID;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PatientProfileRepository patientProfileRepository;

    @Autowired
    private DoctorProfileRepository doctorProfileRepository;

    @Autowired
    private MedicalRecordRepository medicalRecordRepository;

    @Autowired
    private RecordPermissionRepository permissionRepository;

    @Autowired
    private AuditEventRepository auditEventRepository;

    @Autowired
    private BlockchainService blockchainService;

    @Autowired
    private FileStorageService fileStorageService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Value("${carechain.storage.upload-dir:./uploads/medical-records}")
    private String uploadDir;

    @Override
    public void run(String... args) {
        try {
            if (userRepository.count() > 0) {
                logger.info("Database already initialized. Skipping sample seed.");
                return;
            }

            logger.info("Initializing CareChain prototype database with test accounts and sample records...");

            // 1. Genesis block
            blockchainService.createGenesisBlock();

            // 2. Admin User
            User admin = new User("admin@carechain.test", passwordEncoder.encode("Admin123!"), "Dr. Arthur Vance (Administrator)", Role.ADMIN);
            userRepository.save(admin);

            // 3. Doctors
            User doctor1 = new User("doctor@carechain.test", passwordEncoder.encode("Doctor123!"), "Dr. Sarah Mitchell", Role.DOCTOR);
            userRepository.save(doctor1);
            DoctorProfile docProfile1 = new DoctorProfile(doctor1, "Cardiology & Internal Medicine", "MD-NY-84920", "Metropolitan Health System");
            docProfile1.setBio("Board-certified cardiologist with 14 years of clinical experience in interventional cardiology and preventative cardiovascular wellness.");
            doctorProfileRepository.save(docProfile1);

            User doctor2 = new User("doctor2@carechain.test", passwordEncoder.encode("Doctor123!"), "Dr. Robert Chen", Role.DOCTOR);
            userRepository.save(doctor2);
            DoctorProfile docProfile2 = new DoctorProfile(doctor2, "Neurology & Sleep Medicine", "MD-CA-91823", "Pacific Neurological Institute");
            docProfile2.setBio("Specialist in clinical neurology, cognitive disorders, and digital EEG diagnostics.");
            doctorProfileRepository.save(docProfile2);

            // 4. Patients
            User patient1 = new User("patient@carechain.test", passwordEncoder.encode("Patient123!"), "Alex Johnson", Role.PATIENT);
            userRepository.save(patient1);
            PatientProfile patProfile1 = new PatientProfile(patient1);
            patProfile1.setDateOfBirth(LocalDate.of(1994, 6, 15));
            patProfile1.setGender("Male");
            patProfile1.setBloodGroup("O+");
            patProfile1.setEmergencyContact("+1 (555) 234-5678 (Spouse)");
            patProfile1.setAddress("742 Evergreen Terrace, Springfield");
            patProfile1.setAllergyNotes("Severe allergy to Penicillin and Amoxicillin. Mild seasonal pollen rhinitis.");
            patientProfileRepository.save(patProfile1);

            User patient2 = new User("patient2@carechain.test", passwordEncoder.encode("Patient123!"), "Emily Davis", Role.PATIENT);
            userRepository.save(patient2);
            PatientProfile patProfile2 = new PatientProfile(patient2);
            patProfile2.setDateOfBirth(LocalDate.of(1989, 11, 23));
            patProfile2.setGender("Female");
            patProfile2.setBloodGroup("A-");
            patProfile2.setEmergencyContact("+1 (555) 876-5432 (Mother)");
            patProfile2.setAddress("10880 Wilshire Blvd, Los Angeles");
            patProfile2.setAllergyNotes("No known drug allergies (NKDA).");
            patientProfileRepository.save(patProfile2);

            // 5. Seed Fictional Medical Records with physical sample files on disk
            Path storageDir = Paths.get(uploadDir).toAbsolutePath().normalize();
            Files.createDirectories(storageDir);

            // Record 1: Comprehensive Metabolic Panel
            String sampleContent1 = "%PDF-1.4\n1 0 obj\n<< /Title (CareChain Fictional Lab Report: Comprehensive Metabolic Panel - Alex Johnson) >>\nendobj\ntrailer\n<< /Root 1 0 R >>\n%%EOF";
            byte[] bytes1 = sampleContent1.getBytes();
            String hash1 = fileStorageService.calculateSha256(bytes1);
            String storageName1 = UUID.randomUUID().toString() + ".pdf";
            Files.write(storageDir.resolve(storageName1), bytes1, StandardOpenOption.CREATE, StandardOpenOption.TRUNCATE_EXISTING);

            MedicalRecord rec1 = new MedicalRecord();
            rec1.setPatient(patient1);
            rec1.setTitle("Comprehensive Metabolic Panel (CMP-14)");
            rec1.setRecordType(RecordType.LAB_REPORT);
            rec1.setFileOriginalName("CMP_Lab_Results_Oct2026.pdf");
            rec1.setFileStorageName(storageName1);
            rec1.setFileContentType("application/pdf");
            rec1.setFileSize((long) bytes1.length);
            rec1.setSha256Hash(hash1);
            rec1.setDescription("Annual fasting blood glucose, electrolyte balance, kidney, and liver function assays. All parameters within normal reference ranges.");
            medicalRecordRepository.save(rec1);

            String payload1 = String.format("{\"action\":\"RECORD_REGISTERED\",\"recordId\":%d,\"patientId\":%d,\"filename\":\"%s\",\"sha256\":\"%s\"}",
                    rec1.getId(), patient1.getId(), rec1.getFileOriginalName(), hash1);
            BlockchainBlock block1 = blockchainService.addBlock("RECORD_HASH", payload1);
            rec1.setBlockchainBlockIndex(block1.getBlockIndex());
            medicalRecordRepository.save(rec1);

            // Record 2: Echocardiogram
            String sampleContent2 = "%PDF-1.4\n1 0 obj\n<< /Title (CareChain Cardiology Diagnostic: 2D Transthoracic Echocardiogram - Alex Johnson) >>\nendobj\ntrailer\n<< /Root 1 0 R >>\n%%EOF";
            byte[] bytes2 = sampleContent2.getBytes();
            String hash2 = fileStorageService.calculateSha256(bytes2);
            String storageName2 = UUID.randomUUID().toString() + ".pdf";
            Files.write(storageDir.resolve(storageName2), bytes2, StandardOpenOption.CREATE, StandardOpenOption.TRUNCATE_EXISTING);

            MedicalRecord rec2 = new MedicalRecord();
            rec2.setPatient(patient1);
            rec2.setTitle("Transthoracic Echocardiogram (Echo)");
            rec2.setRecordType(RecordType.IMAGING_SCAN);
            rec2.setFileOriginalName("Echo_Cardio_Scan_2026.pdf");
            rec2.setFileStorageName(storageName2);
            rec2.setFileContentType("application/pdf");
            rec2.setFileSize((long) bytes2.length);
            rec2.setSha256Hash(hash2);
            rec2.setDescription("Normal left ventricular size and systolic performance. Ejection fraction estimated at 62%. No significant valvular regurgitation.");
            medicalRecordRepository.save(rec2);

            String payload2 = String.format("{\"action\":\"RECORD_REGISTERED\",\"recordId\":%d,\"patientId\":%d,\"filename\":\"%s\",\"sha256\":\"%s\"}",
                    rec2.getId(), patient1.getId(), rec2.getFileOriginalName(), hash2);
            BlockchainBlock block2 = blockchainService.addBlock("RECORD_HASH", payload2);
            rec2.setBlockchainBlockIndex(block2.getBlockIndex());
            medicalRecordRepository.save(rec2);

            // 6. Seed Patient Permission: Alex Johnson grants access to Dr. Sarah Mitchell
            RecordPermission permission = new RecordPermission(patient1, doctor1, "Consultation for annual cardiovascular assessment.");
            permissionRepository.save(permission);

            String permPayload = String.format(
                    "{\"action\":\"PERMISSION_GRANTED\",\"permissionId\":%d,\"patientId\":%d,\"doctorId\":%d,\"patientName\":\"Alex Johnson\",\"doctorName\":\"Dr. Sarah Mitchell\"}",
                    permission.getId(), patient1.getId(), doctor1.getId()
            );
            blockchainService.addBlock("PERMISSION_GRANT", permPayload);

            // 7. Seed Sample Audit Events
            auditEventRepository.save(new AuditEvent(
                    AuditEventType.LOGIN_SUCCESS, admin, null, AuditOutcome.SUCCESS, "127.0.0.1", "Administrator console initial session"
            ));
            auditEventRepository.save(new AuditEvent(
                    AuditEventType.RECORD_UPLOAD, patient1, rec1, AuditOutcome.SUCCESS, "127.0.0.1", "Initial lab report registered"
            ));
            auditEventRepository.save(new AuditEvent(
                    AuditEventType.RECORD_UPLOAD, patient1, rec2, AuditOutcome.SUCCESS, "127.0.0.1", "Echocardiogram scan registered"
            ));
            auditEventRepository.save(new AuditEvent(
                    AuditEventType.PERMISSION_GRANT, patient1, null, AuditOutcome.SUCCESS, "127.0.0.1", "Granted record access to Dr. Sarah Mitchell"
            ));

            logger.info("CareChain database successfully initialized with demo accounts and blockchain records!");
        } catch (Exception e) {
            logger.error("Error during initial sample data seeding: ", e);
        }
    }
}
