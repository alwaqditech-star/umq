import { Body, Controller, Post } from "@nestjs/common";
import { ContactsService } from "./contacts.service";
import { Public } from "../common/decorators/public.decorator";

@Controller("contacts")
@Public()
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Post()
  create(
    @Body()
    body: {
      name: string;
      email: string;
      phone?: string;
      subject: string;
      message: string;
    },
  ) {
    return this.contactsService.create(body);
  }
}
