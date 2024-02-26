import { CreateStaffDto } from './../auth/dto/users.dto';
import { JwtUser } from '@/common/decorators';
import { AuthGuard, OwnerGuard } from '@/common/guards';
import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { MinioService } from '@/minio/minio.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly minioService: MinioService,
  ) {}

  @UseGuards(OwnerGuard)
  @Get()
  async getUser(@JwtUser('company_id') company: string) {
    return await this.userService.getUser(company);
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
