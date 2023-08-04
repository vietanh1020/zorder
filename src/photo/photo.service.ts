import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { Photo } from './entity/photos.entity';

@Injectable()
export class PhotoService {
  constructor(
    @InjectRepository(Photo)
    private readonly photoRepository: EntityRepository<Photo>,
    private entityManager: EntityManager,
  ) {}

  //   cacheKey = crypto.createHash('md5').update(idList.join('+')).digest('hex');

  async getPhotos() {
    const repository = this.entityManager.fork().getRepository(Photo);
    // const labels = await repository.find({ id: { $in: idList } });
    // this.cacheManager.set(cacheKey, JSON.stringify(labels), { ttl: 3000 });

    return true;
  }
}
