package de.adesso.projectboard.core.rest.security;

import de.adesso.projectboard.core.base.rest.security.ExpressionEvaluator;
import de.adesso.projectboard.core.base.rest.user.UserService;
import de.adesso.projectboard.core.base.rest.user.persistence.User;
import de.adesso.projectboard.core.rest.useraccess.persistence.UserAccessInfo;
import de.adesso.projectboard.core.rest.useraccess.persistence.UserAccessInfoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Set;

/**
 * A {@link ExpressionEvaluator} implementation that is used to authorize access
 * to the REST interface.
 *
 * <p>
 *     Activated via the <i>adesso-keycloak</i> profile.
 * </p>
 *
 * @see ExpressionEvaluator
 * @see UserAccessInfoRepository
 * @see UserService
 * @see KeycloakAuthenticationInfo
 */
@Profile("adesso-keycloak")
@Service
public class UserAccessExpressionEvaluator implements ExpressionEvaluator {

    private final UserAccessInfoRepository userAccessInfoRepo;

    private final UserService userService;

    private final KeycloakAuthenticationInfo authInfo;

    @Autowired
    public UserAccessExpressionEvaluator(UserAccessInfoRepository userAccessInfoRepo,
                                         UserService userService,
                                         KeycloakAuthenticationInfo authInfo) {
        this.userAccessInfoRepo = userAccessInfoRepo;
        this.userService = userService;
        this.authInfo = authInfo;
    }

    /**
     * Gets the currently authenticated user from the {@link UserService}
     * and retrieves the latest {@link UserAccessInfo} object for that user.
     * When the {@link UserAccessInfo#getAccessEnd() access end date} is
     * <b>after</b> the {@link LocalDateTime#now() current} date the user has access.
     *
     * @param authentication
     *          The {@link Authentication} object.
     *
     * @return
     *          <i>true</i>, if the the currently authenticated user's
     *          latest {@link UserAccessInfo} object's {@link UserAccessInfo#accessEnd access end date}
     *          is after the {@link LocalDateTime#now() current} date time, <i>false</i> otherwise.
     *
     * @see UserAccessInfoRepository#getLatestAccessInfo(User)
     * @see UserService#getCurrentUser()
     */
    @Override
    public boolean hasAccessToProjects(Authentication authentication) {
        Optional<UserAccessInfo> accessInfo
                = userAccessInfoRepo.getLatestAccessInfo(userService.getCurrentUser());

        if(accessInfo.isPresent()) {
            LocalDateTime accessEnd = accessInfo.get().getAccessEnd();

            return accessEnd.isAfter(LocalDateTime.now());
        }

        return false;
    }

    /**
     *
     * @param authentication
     *          The {@link Authentication} object.
     *
     * @param projectId
     *          The id of the {@link de.adesso.projectboard.core.base.project.persistence.AbstractProject}
     *          the user wants to access.
     *
     * @return
     *          The result of {@link #hasAccessToProjects(Authentication)}.
     *
     * @see #hasAccessToProjects(Authentication)
     */
    @Override
    public boolean hasAccessToProject(Authentication authentication, long projectId) {
        return hasAccessToProjects(authentication);
    }

    /**
     *
     * @param authentication
     *          The {@link Authentication} object.
     *
     * @return
     *          The result of {@link #hasAccessToProjects(Authentication)}
     *
     * @see #hasAccessToProjects(Authentication)
     */
    @Override
    public boolean hasPermissionToApply(Authentication authentication) {
        return hasAccessToProjects(authentication);
    }

    /**
     *
     * @param authentication
     *          The {@link Authentication} object.
     *
     * @param userId
     *          The id of the {@link de.adesso.projectboard.core.base.rest.user.persistence.User}
     *          the current user wants to access.
     *
     * @return
     *          <i>true</i>, when the given {@code userId} is included in the
     *          {@link Set} of the current users employees, <i>false</i> otherwise.
     *
     * @see KeycloakAuthenticationInfo#getEmployeeSet()
     * @see Set#contains(Object)
     */
    @Override
    public boolean hasPermissionToAccessUser(Authentication authentication, String userId) {
        return authInfo.getEmployeeSet().contains(userId);
    }

    /**
     *
     * @param authentication
     *          The {@link Authentication} object.
     *
     * @param bookmarkId
     *          The id of the {@link de.adesso.projectboard.core.base.rest.bookmark.persistence.ProjectBookmark}
     *          the user wants to access.
     *
     * @return
     *          The result of {@link UserService#userHasBookmark(String, long)} with the
     *          {@link UserService#getCurrentUserId() current user's user ID} as the first param.
     */
    @Override
    public boolean hasPermissionToAccessBookmark(Authentication authentication, long bookmarkId) {
        return userService.userHasBookmark(userService.getCurrentUserId(), bookmarkId);
    }

}
