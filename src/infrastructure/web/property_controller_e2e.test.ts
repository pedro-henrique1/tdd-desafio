import express from "express";
import request from "supertest";
import { DataSource } from "typeorm";
import {
  afterAll,
  beforeAll,
  describe,
  expect,
  it,
} from "@jest/globals";

import { PropertyService } from "../../application/services/property_service";
import { PropertyController } from "./proprety_controller";
import { BookingEntity } from "../persistence/entities/booking_entity";
import { TypeORMPropertyRepository } from "../repositories/typeorm_property_repository";
import { PropertyEntity } from "../persistence/entities/property_entity";
import { UserEntity } from "../persistence/entities/user_entity";

describe("Property Controller E2E", () => {
  const app = express();
  app.use(express.json());

  let dataSource: DataSource;
  let propertyService: PropertyService;
  let propertyController: PropertyController;

  beforeAll(async () => {
    dataSource = new DataSource({
      type: "sqlite",
      database: ":memory:",
      dropSchema: true,
      entities: [PropertyEntity, BookingEntity, UserEntity],
      synchronize: true,
      logging: false,
    });

    await dataSource.initialize();

    const propertyRepository = new TypeORMPropertyRepository(
      dataSource.getRepository(PropertyEntity),
    );

    propertyService = new PropertyService(propertyRepository);
    propertyController = new PropertyController(propertyService);

    app.post("/properties", (req, res, next) => {
      propertyController.createProperty(req, res).catch(next);
    });
  });

  afterAll(async () => {
    if (dataSource?.isInitialized) {
      await dataSource.destroy();
    }
  });

  it("deve criar uma propriedade", async () => {
    const response = await request(app).post("/properties").send({
      name: "Casa de praia",
      description: "Uma casa com vista para o mar",
      maxGuests: 4,
      basePricePerNight: 200,
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("property.name", "Casa de praia");
    expect(response.body).toHaveProperty("property.description");
    expect(response.body).toHaveProperty("property.basePricePerNight", 200);
  });

  it("deve retornar erro com código 400 e mensagem 'O nome da propriedade é obrigatório.' ao enviar um nome vazio", async () => {
    const response = await request(app).post("/properties").send({
      name: "",
      description: "Uma casa com vista para o mar",
      maxGuests: 4,
      basePricePerNight: 200,
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      "message",
      "O nome da propriedade é obrigatório.",
    );
  });

  it("deve retornar erro com código 400 e mensagem 'A capacidade máxima deve ser maior que zero.' ao enviar maxGuests igual a zero ou negativo", async () => {
      const response = await request(app).post("/properties").send({
        name: "Casa de praia",
        description: "Uma casa com vista para o mar",
        maxGuests: 0,
        basePricePerNight: 200,
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty(
        "message",
        "A capacidade máxima deve ser maior que zero.",
      );
  });

  it("deve retornar erro com código 400 e mensagem 'O preço base por noite é obrigatório.' ao enviar basePricePerNight ausente", async () => {
    const response = await request(app).post("/properties").send({
      name: "Casa de praia",
      description: "Uma casa com vista para o mar",
      maxGuests: 4,
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      "message",
      "O preço base por noite é obrigatório.",
    );
  });
});
