import { BookingMapper } from "./booking_mapper";
import { BookingEntity } from "../entities/booking_entity";
import { UserEntity } from "../entities/user_entity";
import { PropertyEntity } from "../entities/property_entity";

describe("BookingMapper", () => {
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

  it("deve converter BookingEntity em Booking corretamente", () => {
    const booking = BookingMapper.toDomain(bookingEntity);

    expect(booking.getId()).toBe("1");
    expect(booking.getGuestCount()).toBe(2);
    expect(booking.getTotalPrice()).toBe(100);
    expect(booking.getStatus()).toBe("CONFIRMED");

    expect(booking.getDateRange().getStartDate()).toEqual(checkIn);

    expect(booking.getDateRange().getEndDate()).toEqual(checkOut);
  });

  it("deve lançar erro de validação ao faltar campos obrigatórios no BookingEntity", () => {
      BookingMapper.toDomain(bookingEntity);
      bookingEntity.guestCount = 0; 

    expect(() => {
      BookingMapper.toDomain(bookingEntity);
    }).toThrowError("O número de hóspedes deve ser maior que zero.");
  });

  it("deve converter Booking para BookingEntity corretamente", () => {
    const booking = BookingMapper.toDomain(bookingEntity);
    const bookingEntityConverted = BookingMapper.toPersistence(booking);

    expect(bookingEntityConverted.id).toBe("1");
    expect(bookingEntityConverted.guestCount).toBe(2);
    expect(bookingEntityConverted.totalPrice).toBe(100);
    expect(bookingEntityConverted.status).toBe("CONFIRMED");
  })
});
