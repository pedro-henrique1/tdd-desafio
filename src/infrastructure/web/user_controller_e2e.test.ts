import express from "express";
import request from "supertest";
import { DataSource } from "typeorm";
import { expect } from "@jest/globals";

import { UserEntity } from "../persistence/entities/user_entity";

import { UserService } from "../../application/services/user_service";
import { UserController } from "./user_controller";
import { TypeORMUserRepository } from "../repositories/typeorm_user_repository";

describe("User Controller E2E", () => {
  const app = express();

  app.use(express.json());

  let dataSource: DataSource;
  let userService: UserService;
  let userController: UserController;

  beforeAll(async () => {
    dataSource = new DataSource({
      type: "sqlite",
      database: ":memory:",
      dropSchema: true,
      entities: [UserEntity],
      synchronize: true,
      logging: false,
    });

    await dataSource.initialize();

    const userRepository = new TypeORMUserRepository(
      dataSource.getRepository(UserEntity),
    );

    userService = new UserService(userRepository);

    userController = new UserController(userService);

    app.post("/users", (req, res, next) => {
      userController.createUser(req, res).catch(next);
    });
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  it("deve criar um usuário", async () => {
    const response = await request(app).post("/users").send({
      name: "José Santos",
    });
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty(
      "createdUser.name",
      "José Santos",
    );
  });

  it("deve retornar erro com código 400 e mensagem 'O campo nome é obrigatório.' ao enviar um nome vazio", async () => {
    const response = await request(app).post("/users").send({
      name: "",
    });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "O nome é obrigatório.");
  });
});
