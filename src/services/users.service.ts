import { db } from '../db/mysql';

class UsersService {

  getAll(): Promise<any> {
    return db.select('user', ['*']);
  }

}

export default new UsersService();
