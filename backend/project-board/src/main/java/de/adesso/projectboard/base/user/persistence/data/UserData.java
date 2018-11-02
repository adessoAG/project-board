package de.adesso.projectboard.base.user.persistence.data;

import de.adesso.projectboard.base.user.persistence.User;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.NotEmpty;

@Entity
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class UserData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @OneToOne(optional = false)
    private User user;

    @Column(nullable = false)
    @NotEmpty
    private String firstName;

    @Column(nullable = false)
    @NotEmpty
    private String lastName;

    @Column(unique = true)
    @NotEmpty
    private String email;

    @Column(nullable = false)
    @NotEmpty
    private String lob;

    /**
     *
     * @param user
     *          The {@link User} this instance belongs to.
     *
     * @param firstName
     *          The first name of the user.
     *
     * @param lastName
     *          The last name of the user.
     *
     * @param email
     *          The email of the user.
     *
     * @param lob
     *          The LoB of the user.
     */
    public UserData(User user, String firstName, String lastName, String email, String lob) {
        this.user = user;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.lob = lob;
    }

}
