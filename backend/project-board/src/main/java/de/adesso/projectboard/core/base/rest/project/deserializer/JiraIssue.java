package de.adesso.projectboard.core.base.rest.project.deserializer;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import de.adesso.projectboard.core.base.rest.project.persistence.Project;
import de.adesso.projectboard.core.base.rest.project.persistence.ProjectOrigin;
import de.adesso.projectboard.core.reader.JiraProjectReader;
import lombok.Getter;
import lombok.Setter;

/**
 * Object used by the {@link JiraProjectReader} to deserialize {@link Project}s.
 *
 * @see JiraProjectReader
 */
@JsonIgnoreProperties(ignoreUnknown = true)
@Getter
@Setter
public class JiraIssue {

    @JsonAlias("key")
    private String id;

    @JsonAlias("fields")
    private Project project;

    public Project getProjectWithId() {
        project.setId(id)
                .setOrigin(ProjectOrigin.JIRA);

        return project;
    }

}