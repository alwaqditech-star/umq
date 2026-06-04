import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { createHash, randomBytes } from "node:crypto";
import { verifyPassword } from "@umq/shared";
import { PrismaService } from "../prisma/prisma.service";
import type { AuthTokensResponse, AuthUserResponse, JwtPayload } from "./auth.types";
import { LoginDto } from "./dto/login.dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  private hashRefreshToken(token: string): string {
    return createHash("sha256").update(token).digest("hex");
  }

  private async buildUserResponse(userId: string): Promise<AuthUserResponse> {
    const user = await this.prisma.user.findFirst({
      where: { id: userId, deletedAt: null },
      include: {
        role: {
          include: {
            rolePermissions: {
              include: { permission: true },
            },
          },
        },
      },
    });
    if (!user) throw new UnauthorizedException("User not found");

    const permissions = user.role.rolePermissions.map((rp) => rp.permission.slug);
    const isSuperAdmin = user.role.slug === "super-admin";

    return {
      id: user.id,
      email: user.email,
      name: `${user.firstName} ${user.lastName}`.trim(),
      role: user.role.name,
      roleSlug: user.role.slug,
      permissions: isSuperAdmin ? ["*"] : permissions,
    };
  }

  private async issueTokens(user: AuthUserResponse): Promise<AuthTokensResponse> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      roleSlug: user.roleSlug,
      permissions: user.permissions,
    };

    const accessExpires = this.config.get<string>("JWT_ACCESS_EXPIRES") ?? "15m";
    const refreshExpires = this.config.get<string>("JWT_REFRESH_EXPIRES") ?? "7d";
    const accessSeconds = Math.floor(this.parseDurationMs(accessExpires) / 1000);

    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: accessSeconds,
    });

    const refreshToken = randomBytes(48).toString("base64url");
    const refreshMs = this.parseDurationMs(refreshExpires);

    await this.prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash: this.hashRefreshToken(refreshToken),
        expiresAt: new Date(Date.now() + refreshMs),
      },
    });

    return {
      accessToken,
      refreshToken,
      expiresIn: this.parseDurationMs(accessExpires) / 1000,
    };
  }

  private parseDurationMs(value: string): number {
    const match = /^(\d+)([smhd])$/.exec(value.trim());
    if (!match) return 15 * 60 * 1000;
    const amount = Number(match[1]);
    const unit = match[2] as "s" | "m" | "h" | "d";
    const multipliers = {
      s: 1000,
      m: 60_000,
      h: 3_600_000,
      d: 86_400_000,
    } as const;
    return amount * multipliers[unit];
  }

  async login(dto: LoginDto): Promise<AuthTokensResponse & { user: AuthUserResponse }> {
    const user = await this.prisma.user.findFirst({
      where: { email: dto.email.toLowerCase(), deletedAt: null },
      include: {
        role: {
          include: {
            rolePermissions: { include: { permission: true } },
          },
        },
      },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException("Invalid credentials");
    }

    if (user.lockedUntil && user.lockedUntil > new Date()) {
      throw new ForbiddenException("Account is temporarily locked");
    }

    if (!verifyPassword(dto.password, user.passwordHash)) {
      await this.prisma.user.update({
        where: { id: user.id },
        data: { failedLoginCount: { increment: 1 } },
      });
      throw new UnauthorizedException("Invalid credentials");
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        lastLoginAt: new Date(),
        failedLoginCount: 0,
        lockedUntil: null,
      },
    });

    const authUser = await this.buildUserResponse(user.id);
    const tokens = await this.issueTokens(authUser);
    return { ...tokens, user: authUser };
  }

  async refresh(refreshToken: string): Promise<AuthTokensResponse & { user: AuthUserResponse }> {
    const tokenHash = this.hashRefreshToken(refreshToken);
    const stored = await this.prisma.refreshToken.findFirst({
      where: {
        tokenHash,
        revokedAt: null,
        expiresAt: { gt: new Date() },
      },
    });

    if (!stored) {
      throw new UnauthorizedException("Invalid refresh token");
    }

    await this.prisma.refreshToken.update({
      where: { id: stored.id },
      data: { revokedAt: new Date() },
    });

    const authUser = await this.buildUserResponse(stored.userId);
    const tokens = await this.issueTokens(authUser);
    return { ...tokens, user: authUser };
  }

  async logout(refreshToken: string | undefined, userId?: string): Promise<void> {
    if (refreshToken) {
      const tokenHash = this.hashRefreshToken(refreshToken);
      await this.prisma.refreshToken.updateMany({
        where: { tokenHash, revokedAt: null },
        data: { revokedAt: new Date() },
      });
    } else if (userId) {
      await this.prisma.refreshToken.updateMany({
        where: { userId, revokedAt: null },
        data: { revokedAt: new Date() },
      });
    }
  }

  async me(userId: string): Promise<AuthUserResponse> {
    return this.buildUserResponse(userId);
  }
}
