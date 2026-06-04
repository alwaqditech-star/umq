import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class ContactsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
  }) {
    await this.prisma.contact.create({
      data: {
        name: data.name,
        email: data.email.toLowerCase(),
        phone: data.phone,
        subject: data.subject,
        message: data.message,
      },
    });
    return { message: "Message sent successfully" };
  }
}
