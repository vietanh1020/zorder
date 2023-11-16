import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateCardDto } from './dto/card.dto';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Card } from '@/database/entities';
import { EntityRepository } from '@mikro-orm/postgresql';
import { StripeService } from './stripe.service';

@Injectable()
export class CardService {
  thisMonth = new Date().getMonth() + 1;
  thisYear = new Date().getFullYear();

  constructor(
    @InjectRepository(Card)
    private readonly cardRepo: EntityRepository<Card>,

    private config: ConfigService,
    private stripeService: StripeService,
  ) {}

  async create(body: CreateCardDto) {
    const { method, email, companyId: companyId, cardName, isDefault } = body;

    try {
      const stripeCard = await this.stripeService.addMetadata(method, email);

      const card = this.cardRepo.create({
        isDefault,
        cardName,
        companyId,
        email,
        metadata: stripeCard,
      });

      await this.cardRepo.persistAndFlush(card);

      delete card.metadata.id;
      delete card.metadata.customer;

      return card;
    } catch (error) {
      throw new BadRequestException('Add card Error');
    }
  }

  async getListCard(companyId: string) {
    return await this.cardRepo.find({ companyId });
  }

  async getCardDefault(companyId: string) {
    return await this.cardRepo.findOne({ companyId, isDefault: true });
  }

  async getCard(id: string) {
    return await this.cardRepo.findOne({ id });
  }
}
