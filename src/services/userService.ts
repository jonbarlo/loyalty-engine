import UserModel, { UserCreationAttributes } from '../models/UserModel';
import bcrypt from 'bcryptjs';

export type UserWithoutPassword = Omit<UserCreationAttributes, 'passwordHash'>;

export class UserService {
  /**
   * Get all users without passwords
   */
  static async getAllUsers(): Promise<UserWithoutPassword[]> {
    const users = await UserModel.findAll({
      attributes: { exclude: ['passwordHash'] },
      order: [['createdAt', 'DESC']],
    });
    return users.map((user: UserModel) => {
      const userData = user.toJSON();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { passwordHash, ...userWithoutPassword } = userData;
      return userWithoutPassword as UserWithoutPassword;
    });
  }

  /**
   * Get user by ID without password
   */
  static async getUserById(id: number): Promise<UserWithoutPassword | null> {
    const user = await UserModel.findByPk(id, {
      attributes: { exclude: ['passwordHash'] },
    });
    if (!user) return null;
    const userData = user.toJSON();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...userWithoutPassword } = userData;
    return userWithoutPassword as UserWithoutPassword;
  }

  /**
   * Get user by email (includes password for authentication)
   */
  static async getUserByEmail(email: string): Promise<UserModel | null> {
    return await UserModel.findOne({
      where: { email },
    });
  }

  /**
   * Create a new user
   */
  static async createUser(userData: UserCreationAttributes): Promise<UserWithoutPassword> {
    const user = await UserModel.create(userData);
    const userDataJson = user.toJSON();
    const { passwordHash, ...userWithoutPassword } = userDataJson;
    return userWithoutPassword as UserWithoutPassword;
  }

  /**
   * Update user by ID
   */
  static async updateUser(id: number, updateData: Partial<UserCreationAttributes>): Promise<UserWithoutPassword | null> {
    const user = await UserModel.findByPk(id);
    if (!user) {
      return null;
    }
    if (updateData.passwordHash) {
      updateData.passwordHash = await bcrypt.hash(updateData.passwordHash, 10);
    }
    await user.update(updateData);
    const userData = user.toJSON();
    const { passwordHash, ...userWithoutPassword } = userData;
    return userWithoutPassword as UserWithoutPassword;
  }

  /**
   * Delete user by ID
   */
  static async deleteUser(id: number): Promise<boolean> {
    const user = await UserModel.findByPk(id);
    if (!user) {
      return false;
    }

    await user.destroy();
    return true;
  }

  /**
   * Check if user exists by email
   */
  static async userExists(email: string): Promise<boolean> {
    const count = await UserModel.count({
      where: { email },
    });
    return count > 0;
  }
} 