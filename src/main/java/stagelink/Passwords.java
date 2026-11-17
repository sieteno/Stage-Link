package stagelink;

import java.nio.charset.StandardCharsets;
import java.security.GeneralSecurityException;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.util.Base64;
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;

public final class Passwords {
    private static final String PREFIX = "pbkdf2-sha256$";
    private static final int ITERATIONS = 600_000;
    private static final SecureRandom RANDOM = new SecureRandom();

    private Passwords() {}

    public static boolean validNewPassword(String password) {
        return password != null && password.length() >= 8 && password.length() <= 128;
    }

    public static boolean isLegacy(String stored) {
        return stored != null && !stored.startsWith(PREFIX);
    }

    public static String hash(String password) throws GeneralSecurityException {
        byte[] salt = new byte[16];
        RANDOM.nextBytes(salt);
        Base64.Encoder encoder = Base64.getUrlEncoder().withoutPadding();
        return PREFIX + encoder.encodeToString(salt) + "$" + encoder.encodeToString(derive(password, salt));
    }

    public static boolean matches(String supplied, String stored) throws GeneralSecurityException {
        if (supplied == null || supplied.isEmpty() || stored == null) {
            return false;
        }
        if (isLegacy(stored)) {
            return MessageDigest.isEqual(supplied.getBytes(StandardCharsets.UTF_8), stored.getBytes(StandardCharsets.UTF_8));
        }
        String[] parts = stored.substring(PREFIX.length()).split("\\$", -1);
        if (parts.length != 2) {
            return false;
        }
        try {
            Base64.Decoder decoder = Base64.getUrlDecoder();
            return MessageDigest.isEqual(derive(supplied, decoder.decode(parts[0])), decoder.decode(parts[1]));
        } catch (IllegalArgumentException error) {
            return false;
        }
    }

    private static byte[] derive(String password, byte[] salt) throws GeneralSecurityException {
        PBEKeySpec spec = new PBEKeySpec(password.toCharArray(), salt, ITERATIONS, 256);
        try {
            return SecretKeyFactory.getInstance("PBKDF2WithHmacSHA256").generateSecret(spec).getEncoded();
        } finally {
            spec.clearPassword();
        }
    }
}
