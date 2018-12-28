package de.adesso.projectboard.base.user.persistence.structure;

import de.adesso.projectboard.base.user.persistence.User;
import lombok.*;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "ORG_STRUCTURE")
@Getter
@Setter
@EqualsAndHashCode
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class OrganizationStructure {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @OneToOne
    @JoinColumn(
            name = "USER_ID",
            nullable = false
    )
    User user;

    @ManyToOne
    @JoinColumn(
            name = "USER_MANAGER_ID",
            nullable = false
    )
    User manager;

    // ManyToMany to allow inconsistencies
    @ManyToMany
    @JoinTable(
            name = "ORG_STRUCTURE_STAFF",
            joinColumns = @JoinColumn(name = "ORG_STRUCTURE_ID"),
            inverseJoinColumns = @JoinColumn(name = "STAFF_USER_ID")
    )
    Set<User> staffMembers = new HashSet<>();

    @Column(name = "MANAGING_USER")
    boolean managingUser;

    /**
     *
     * @param user
     *          The user this structure belongs to.
     *
     * @param manager
     *          The manager of the user.
     *
     * @param staffMembers
     *          The staff members of the user.
     *
     * @param managingUser
     *          Whether or not the user is a manager himself.
     */
    public OrganizationStructure(User user, User manager, Set<User> staffMembers, boolean managingUser) {
        this.user = user;
        this.manager = manager;
        this.staffMembers = staffMembers;
        this.managingUser = managingUser;
    }

}
