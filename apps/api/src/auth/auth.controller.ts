import { Body, Controller, Get, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { RefreshDto } from "./dto/refresh.dto";
import { Public } from "../common/decorators/public.decorator";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import type { RequestUser } from "../common/types/request-user";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post("login")
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Public()
  @Post("refresh")
  refresh(@Body() dto: RefreshDto) {
    return this.authService.refresh(dto.refreshToken);
  }

  @Post("logout")
  logout(
    @CurrentUser() user: RequestUser,
    @Body() body: { refreshToken?: string },
  ) {
    return this.authService.logout(body.refreshToken, user.id);
  }

  @Get("me")
  me(@CurrentUser() user: RequestUser) {
    return this.authService.me(user.id);
  }
}
