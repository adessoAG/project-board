package de.adesso.projectboard.core.base.updater;

import de.adesso.projectboard.core.base.updater.persistence.ProjectDatabaseUpdaterInfo;
import de.adesso.projectboard.core.base.updater.persistence.ProjectDatabaseUpdaterInfoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.HealthIndicator;
import org.springframework.stereotype.Component;

import java.util.Optional;

/**
 * A {@link HealthIndicator} implementation for the {@link ProjectDatabaseUpdater}.
 *
 * @see ProjectDatabaseUpdater
 */
@Component
public class UpdaterHealthIndicator implements HealthIndicator {

    private final ProjectDatabaseUpdaterInfoRepository updaterRepository;

    @Autowired
    public UpdaterHealthIndicator(ProjectDatabaseUpdaterInfoRepository repository) {
        this.updaterRepository = repository;
    }

    /**
     *
     * @return
     *          The {@link Health} of the {@link ProjectDatabaseUpdater}, gives additional
     *          details about the status.
     */
    @Override
    public Health health() {
        Optional<ProjectDatabaseUpdaterInfo> lastInfoOptional = updaterRepository.findLatest();

        if(lastInfoOptional.isPresent()) {
            ProjectDatabaseUpdaterInfo lastInfo = lastInfoOptional.get();

            if(ProjectDatabaseUpdaterInfo.Status.FAILURE.equals(lastInfo.getStatus())) {
                return Health.down()
                        .withDetail("reason", lastInfoOptional.get().getFailureReason())
                        .build();
            } else {
                return Health.up()
                        .withDetail("lastUpdate", lastInfo.getTime())
                        .withDetail("totalUpdates", updaterRepository.count())
                        .withDetail("successfulUpdates", updaterRepository.countByStatus(ProjectDatabaseUpdaterInfo.Status.SUCCESS))
                        .build();
            }

        }

        return Health.up().build();
    }

}