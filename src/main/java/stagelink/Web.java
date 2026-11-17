package stagelink;

import java.net.URI;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.util.Base64;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

public final class Web {
    private static final SecureRandom RANDOM = new SecureRandom();

    private Web() {}

    public static String html(Object value) {
        return value == null ? "" : value.toString().replace("&", "&amp;").replace("<", "&lt;")
                .replace(">", "&gt;").replace("\"", "&quot;").replace("'", "&#39;");
    }

    public static String field(HttpServletRequest request, String name) {
        String value = request.getParameter(name);
        return value == null ? "" : value.trim();
    }

    public static boolean httpLink(String value) {
        try {
            URI uri = URI.create(value);
            return uri.getHost() != null
                    && ("http".equalsIgnoreCase(uri.getScheme()) || "https".equalsIgnoreCase(uri.getScheme()));
        } catch (IllegalArgumentException error) {
            return false;
        }
    }

    public static int userId(HttpSession session) {
        Object id = session.getAttribute("userId");
        return id instanceof Integer ? (Integer) id : 0;
    }

    public static boolean producer(HttpSession session) {
        return "producer".equals(session.getAttribute("userRole"));
    }

    public static String csrfInput(HttpSession session) {
        return "<input type=\"hidden\" name=\"csrf\" value=\"" + csrf(session) + "\">";
    }

    public static String shellAttributes(HttpSession session) {
        return "data-session-user=\"" + userId(session) + "\" data-session-role=\""
                + (producer(session) ? "producer" : "actor") + "\" data-session-name=\""
                + html(session.getAttribute("userName")) + "\" data-csrf=\"" + csrf(session) + "\"";
    }

    static boolean validCsrf(HttpSession session, String supplied) {
        String expected = (String) session.getAttribute("csrf");
        return expected != null && supplied != null
                && MessageDigest.isEqual(expected.getBytes(StandardCharsets.UTF_8), supplied.getBytes(StandardCharsets.UTF_8));
    }

    private static String csrf(HttpSession session) {
        synchronized (session) {
            String token = (String) session.getAttribute("csrf");
            if (token == null) {
                byte[] random = new byte[24];
                RANDOM.nextBytes(random);
                token = Base64.getUrlEncoder().withoutPadding().encodeToString(random);
                session.setAttribute("csrf", token);
            }
            return token;
        }
    }
}
