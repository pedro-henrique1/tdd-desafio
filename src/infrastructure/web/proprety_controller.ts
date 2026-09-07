import type { PropertyService } from "../../application/services/property_service";
import { Property } from "../../domain/entities/property";
import { v4 as uuidv4 } from "uuid";

export class PropertyController {
  private propertyService: PropertyService;

  constructor(propertyService: PropertyService) {
    this.propertyService = propertyService;
  }

  async createProperty(req: any, res: any): Promise<void> {
    try {
      const { name, description, maxGuests, basePricePerNight } = req.body;

      if (!name) {
        res
          .status(400)
          .json({ message: "O nome da propriedade é obrigatório." });
        return;
      }

      if (maxGuests <= 0) {
        res
          .status(400)
          .json({ message: "A capacidade máxima deve ser maior que zero." });
        return;
      }

      if (basePricePerNight === undefined || basePricePerNight === null) {
        res
          .status(400)
          .json({ message: "O preço base por noite é obrigatório." });
        return;
      }

      const property = await this.propertyService.createProperty(new Property(
        uuidv4(),
        name,
        description,
        maxGuests,
        basePricePerNight,
      ));

      res.status(201).json({
        message: "Propriedade criada com sucesso.",
        property: {
          id: property.getId(),
          name: property.getName(),
          description: property.getDescription(),
          basePricePerNight: property.getBasePricePerNight(),
        },
      });
    } catch (error: any) {
      res
        .status(400)
        .json({ message: error.message || "Ocorreu um erro inesperado." });
    }
  }

  async createdProperty(req: any, res: any): Promise<void> {
    return this.createProperty(req, res);
  }
}