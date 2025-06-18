import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { ManagersService } from './managers.service';

@Controller('managers')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ManagersController {
  constructor(private readonly managersService: ManagersService) {}

  @Get('region-users')
  async getUsers(@Req() req) {
    const region = req.user.region;
    return this.managersService.getUsersByRegion(region);
  }
}
