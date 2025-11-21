import { GlobalDAO } from "./GlobalDAO";
import { User, IUser } from "../models/User";

export class UserDAO extends GlobalDAO<User, IUser> {
  constructor() {
    super("users", (data: IUser) => new User(data));
  }
}
