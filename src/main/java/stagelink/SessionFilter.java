package stagelink;

import java.io.IOException;
import java.util.Set;
import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

@WebFilter("*.jsp")
public class SessionFilter implements Filter {
    private static final Set<String> ACCOUNT_PAGES = Set.of(
            "/dashboard.jsp", "/profile.jsp", "/portfolio.jsp", "/notifications.jsp", "/reset-password.jsp");
    private static final Set<String> PRODUCER_PAGES = Set.of(
            "/create-audition.jsp", "/edit-audition.jsp", "/subscription.jsp");

    @Override
    public void doFilter(ServletRequest rawRequest, ServletResponse rawResponse, FilterChain chain)
            throws IOException, ServletException {
        HttpServletRequest request = (HttpServletRequest) rawRequest;
        HttpServletResponse response = (HttpServletResponse) rawResponse;
        request.setCharacterEncoding("UTF-8");
        response.setHeader("Cache-Control", "no-store");

        HttpSession session = request.getSession();
        boolean post = "POST".equals(request.getMethod());
        String path = request.getServletPath();
        if (Web.userId(session) == 0 && (ACCOUNT_PAGES.contains(path) || PRODUCER_PAGES.contains(path))) {
            if (post) {
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED);
            } else {
                response.sendRedirect(request.getContextPath() + "/auth.jsp");
            }
            return;
        }
        if (PRODUCER_PAGES.contains(path) && !Web.producer(session)) {
            response.sendError(HttpServletResponse.SC_FORBIDDEN);
            return;
        }
        if (post && !Web.validCsrf(session, request.getParameter("csrf"))) {
            response.sendError(HttpServletResponse.SC_FORBIDDEN, "Vuelve a abrir el formulario antes de enviarlo.");
            return;
        }
        chain.doFilter(request, response);
    }
}
