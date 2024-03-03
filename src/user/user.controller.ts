import { JwtUser } from '@/common/decorators';
import { AuthGuard, OwnerGuard } from '@/common/guards';
import { MinioService } from '@/minio/minio.service';
import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly minioService: MinioService,
  ) {}

  @UseGuards(OwnerGuard)
  @Get('/profile')
  async getProfile(@JwtUser('id') userId: string) {
    return await this.userService.getProfile(userId);
  }

  @UseGuards(OwnerGuard)
  @Get()
  async getUser(@JwtUser('company_id') company: string) {
    return await this.userService.getUser(company);
  }

  @UseGuards(OwnerGuard)
  @Delete(':id')
  async removeStaff(
    @Param('id') id: string,
    @JwtUser('company_id') company: string,
  ) {
    return await this.userService.removeStaff(id, company);
  }

  @UseGuards(AuthGuard)
  @Post('/avatar')
  @UseInterceptors(FileInterceptor('file'))
  async uploadBookCover(
    @UploadedFile() file: Express.Multer.File,
    @JwtUser('id') userId: string,
  ) {
    await this.minioService.createBucketIfNotExists();
    const fileName = await this.minioService.uploadFile(
      file,
      'users/' + userId,
    );
    return fileName;
  }
}
