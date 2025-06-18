import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

import { AdminsService } from './admins.service';

@Controller('admins')
@UseGuards(JwtAuthGuard)
export class AdminsController {
  constructor(private readonly adminsService: AdminsService) {}


    @Get('region-users-managers')
  async getUsersAndManagers(@Req() req) {
    const region = req.user.region;
    return this.adminsService.getUsersAndManagersByRegion(region);
  }
}



//   @Get('region-users')
//   async getUsersInRegion(@Req() req) {
//     return this.adminsService.getUsersByRegion(req.user.region);
//   }

//   @Get('region-managers')
//   async getManagersInRegion(@Req() req) {
//     return this.adminsService.getManagersByRegion(req.user.region);
//   }
