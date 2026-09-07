import type { UserService } from "../../application/services/user_service";
import type { Request, Response } from "express";
import { User } from "../../domain/entities/user";
import { v4 as uuidv4 } from "uuid";

export class UserController {
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  async createUser(req: Request, res: Response): Promise<Response> {
    try {
      const name = req.body?.name;

      if (name.trim() === "") {
        return res.status(400).json({ message: "O nome é obrigatório." });
      }

      const user = new User(uuidv4(), name);

      const createdUser = await this.userService.createUser(user);

      return res.status(201).json({
        message: "User created successfully",
        createdUser: {
          id: createdUser.getId(),
          name: createdUser.getName(),
        },
      });
    } catch (error: any) {
      return res
        .status(400)
        .json({ message: error.message || "An unexpected error occurred" });
    }
  }
}


