package de.adesso.projectboard.rest.handler.mail.persistence;

import org.springframework.data.repository.CrudRepository;

/**
 * {@link CrudRepository} to persist {@link TemplateMessage}s.
 */
public interface MessageRepository extends CrudRepository<TemplateMessage, Long> {

}