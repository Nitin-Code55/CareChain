package com.carechain.service;

import com.carechain.exception.BadRequestException;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.*;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Service
public class FileStorageService {

    @Value("${carechain.storage.upload-dir:./uploads/medical-records}")
    private String uploadDir;

    private Path fileStorageLocation;

    private static final List<String> ALLOWED_EXTENSIONS = Arrays.asList("pdf", "jpg", "jpeg", "png");
    private static final List<String> ALLOWED_CONTENT_TYPES = Arrays.asList(
            "application/pdf",
            "image/jpeg",
            "image/jpg",
            "image/png"
    );

    @PostConstruct
    public void init() {
        this.fileStorageLocation = Paths.get(uploadDir).toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (IOException ex) {
            throw new RuntimeException("Could not create the upload directory at " + this.fileStorageLocation, ex);
        }
    }

    public StoredFileResult storeFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("Uploaded file cannot be empty");
        }

        String originalFilename = StringUtils.cleanPath(file.getOriginalFilename() != null ? file.getOriginalFilename() : "document");

        // Prevent path traversal
        if (originalFilename.contains("..") || originalFilename.contains("/") || originalFilename.contains("\\")) {
            throw new BadRequestException("Invalid filename with path traversal sequence: " + originalFilename);
        }

        // Validate content type & extension
        String fileExt = getFileExtension(originalFilename).toLowerCase();
        if (!ALLOWED_EXTENSIONS.contains(fileExt)) {
            throw new BadRequestException("Unsupported file extension ." + fileExt + ". Allowed formats: PDF, JPG, JPEG, PNG");
        }

        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_CONTENT_TYPES.contains(contentType.toLowerCase())) {
            if (fileExt.equals("pdf")) contentType = "application/pdf";
            else if (fileExt.equals("jpg") || fileExt.equals("jpeg")) contentType = "image/jpeg";
            else if (fileExt.equals("png")) contentType = "image/png";
            else {
                throw new BadRequestException("Unsupported file MIME type: " + contentType);
            }
        }

        // Unique server-side filename
        String storageFilename = UUID.randomUUID().toString() + "." + fileExt;

        try {
            byte[] fileBytes = file.getBytes();
            String sha256Hash = calculateSha256(fileBytes);

            Path targetLocation = this.fileStorageLocation.resolve(storageFilename).normalize();
            if (!targetLocation.startsWith(this.fileStorageLocation)) {
                throw new BadRequestException("Cannot store file outside current storage directory");
            }

            Files.write(targetLocation, fileBytes, StandardOpenOption.CREATE, StandardOpenOption.TRUNCATE_EXISTING);

            return new StoredFileResult(
                    storageFilename,
                    originalFilename,
                    contentType,
                    file.getSize(),
                    sha256Hash
            );
        } catch (IOException ex) {
            throw new RuntimeException("Failed to store file " + originalFilename, ex);
        }
    }

    public byte[] loadFileBytes(String storageFilename) throws IOException {
        Path filePath = this.fileStorageLocation.resolve(storageFilename).normalize();
        if (!filePath.startsWith(this.fileStorageLocation)) {
            throw new BadRequestException("Access denied: Invalid file path");
        }
        if (!Files.exists(filePath)) {
            return null;
        }
        return Files.readAllBytes(filePath);
    }

    public Resource loadFileAsResource(String storageFilename) {
        try {
            Path filePath = this.fileStorageLocation.resolve(storageFilename).normalize();
            if (!filePath.startsWith(this.fileStorageLocation)) {
                throw new BadRequestException("Access denied: Invalid file path");
            }
            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists() && resource.isReadable()) {
                return resource;
            } else {
                throw new BadRequestException("File not found or unreadable: " + storageFilename);
            }
        } catch (MalformedURLException ex) {
            throw new BadRequestException("Malformed file URL: " + storageFilename);
        }
    }

    public boolean fileExists(String storageFilename) {
        Path filePath = this.fileStorageLocation.resolve(storageFilename).normalize();
        return Files.exists(filePath);
    }

    public String calculateSha256(byte[] data) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hashBytes = digest.digest(data);
            StringBuilder sb = new StringBuilder();
            for (byte b : hashBytes) {
                sb.append(String.format("%02x", b));
            }
            return sb.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-256 algorithm not available", e);
        }
    }

    private String getFileExtension(String filename) {
        int dotIndex = filename.lastIndexOf('.');
        if (dotIndex > 0 && dotIndex < filename.length() - 1) {
            return filename.substring(dotIndex + 1);
        }
        return "";
    }

    public record StoredFileResult(
            String storageFilename,
            String originalFilename,
            String contentType,
            long fileSize,
            String sha256Hash
    ) {}
}
