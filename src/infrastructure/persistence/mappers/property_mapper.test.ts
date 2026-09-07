import { BookingEntity } from "../entities/booking_entity";
import { UserEntity } from "../entities/user_entity";
import { PropertyEntity } from "../entities/property_entity";
import { PropertyMapper } from "./property_mapper";

describe("Property Mapper", () => {
  let bookingEntity: BookingEntity;
  let checkIn: Date;
  let checkOut: Date;

  beforeEach(() => {
    bookingEntity = new BookingEntity();

    checkIn = new Date("2026-09-10");
    checkOut = new Date("2026-09-12");

    bookingEntity.id = "1";
    bookingEntity.startDate = checkIn;
    bookingEntity.endDate = checkOut;
    bookingEntity.guestCount = 2;
    bookingEntity.totalPrice = 100;
    bookingEntity.status = "CONFIRMED";

    bookingEntity.guest = new UserEntity();
    bookingEntity.guest.name = "José Santos";
    bookingEntity.guest.id = "1";

    bookingEntity.property = new PropertyEntity();
    bookingEntity.property.id = "1";
    bookingEntity.property.name = "Casa Teste";
    bookingEntity.property.description = "Descrição da Casa Teste";
    bookingEntity.property.maxGuests = 4;
  });

  it("deve converter PropertyEntity em Property corretamente", () => {
    const property = PropertyMapper.toDomain(bookingEntity.property);

    expect(property.getId()).toBe("1");
    expect(property.getName()).toBe("Casa Teste");
    expect(property.getDescription()).toBe("Descrição da Casa Teste");
    expect(property.getMaxGuests()).toBe(4);
  });

  it("deve lançar erro de validação ao faltar campos obrigatórios no PropertyEntity", () => {
    bookingEntity.property.name = "";

    expect(() => {
      PropertyMapper.toDomain(bookingEntity.property);
    }).toThrowError("O nome é obrigatório");
  });

  it("deve converter Property para PropertyEntity corretamente", () => {
    const property = PropertyMapper.toDomain(bookingEntity.property);
    const propertyEntityConverted = PropertyMapper.toPersistence(property);

    expect(propertyEntityConverted.id).toBe("1");
    expect(propertyEntityConverted.name).toBe("Casa Teste");
    expect(propertyEntityConverted.description).toBe("Descrição da Casa Teste");
    expect(propertyEntityConverted.maxGuests).toBe(4);
  });

});
