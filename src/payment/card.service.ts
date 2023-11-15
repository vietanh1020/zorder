import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { StripeService } from './stripe.service';
import { CreateCardDto } from './dtos/card.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Card } from 'src/schemas/Card.schema';
import { Model, isValidObjectId } from 'mongoose';
import { BadRequestException } from 'src/share/exceptions/badrequest.exception';

@Injectable()
export class CardService {
  thisMonth = new Date().getMonth() + 1;
  thisYear = new Date().getFullYear();

  constructor(
    // @InjectRedis()
    // private redis: Redis,
    @InjectModel(Card.name)
    private cardModel: Model<Card>,

    private config: ConfigService,
    private stripeService: StripeService,
  ) {}

  async create(body: CreateCardDto) {
    const { method, email, company, cardName, isDefault } = body;

    try {
      const stripeCard = await this.stripeService.addMetadata(method, email);

      const card = new this.cardModel({
        isDefault,
        cardName,
        company,
        email,
        metadata: stripeCard,
      });

      await card.save();

      delete card.metadata.id;
      delete card.metadata.customer;

      return card;
    } catch (error) {
      throw new BadRequestException('Add card Error');
    }

    // this.firstCreateHandle(companyId)
    // this.natsService.emitUserAddCard({ companyId, userId })
  }

  async getListCard(company: string) {
    return await this.cardModel
      .find({ company }, { 'metadata.id': 0, 'metadata.customer': 0 })
      .exec();
  }

  async getCardCompany(company: string) {
    return await this.cardModel
      .findOne({ company }, { 'metadata.id': 0, 'metadata.customer': 0 })
      .exec();
  }

  async getCard(id: string) {
    if (!isValidObjectId(id)) throw new BadRequestException('Card invalid!');
    return await this.cardModel
      .findOne({ _id: id }, { 'metadata.id': 0, 'metadata.customer': 0 })
      .exec();
  }
}
