export class UserProps {
    id: string;
    avatar: string;
    firstName: string;
    lastName: string;
}

export class User {
    private constructor(
        readonly id: string,
        readonly avatar: string,
        readonly firstName: string,
        readonly lastName: string
    ) {}

    static create(props: UserProps): User {
        const video = new User(
            props.id,
            props.avatar,
            props.firstName,
            props.lastName
        );

        return video;
    }
}
