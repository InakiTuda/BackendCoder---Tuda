export default class UsersDto {
    constructor(user) {
      this.name = `${user.first_name} ${user.last_name}`;
      this.email = user.email;
      this.age = user.age;
      this.username = user.username;
      this.role = user.role;
      this.fromGithub = user.fromGithub;
    };
}