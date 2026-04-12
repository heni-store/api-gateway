import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@modules/prisma/prisma.service';
import { mapTranslationCreate, mapTranslationUpdate } from '@app/libs';
import {
  CreateProblemDto,
  UpdateProblemDto,
  ChangePublishedStatusDto,
  GetProblemsDto,
} from '@modules/dashboard/problems/dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProblemsService {
  constructor(private prisma: PrismaService) {}

  private async findBySlug(slug: string) {
    return this.prisma.problem.findUnique({
      where: { slug: slug },
    });
  }

  private baseInclude = {
    translations: {
      select: {
        locale: true,
        title: true,
      },
    },
  };

  async create(dto: CreateProblemDto) {
    const existing = await this.findBySlug(dto.slug);

    if (existing) {
      throw new ConflictException(
        `Задача с таким slug: ${dto.slug} уже существует`,
      );
    }

    return this.prisma.problem.create({
      data: {
        slug: dto.slug,
        difficulty: dto.difficulty,
        isPublished: dto.isPublished,
        translations: {
          create: dto.translations.map(mapTranslationCreate),
        },
      },
      include: this.baseInclude,
    });
  }

  async update(dto: UpdateProblemDto) {
    const existing = await this.findBySlug(dto.slug);

    if (!existing) {
      throw new NotFoundException(
        `Задачи с таким slug: ${dto.slug} не существует`,
      );
    }

    return this.prisma.problem.update({
      where: { id: existing.id },
      data: {
        slug: dto.slug,
        difficulty: dto.difficulty,
        isPublished: dto.isPublished,
        translations: {
          upsert: dto.translations.map((translation) => ({
            where: {
              problemId_locale: {
                problemId: existing.id,
                locale: translation.locale,
              },
            },
            update: mapTranslationUpdate(translation),
            create: mapTranslationCreate(translation),
          })),
        },
      },
      include: this.baseInclude,
    });
  }

  async changePublishedStatus(dto: ChangePublishedStatusDto) {
    const existing = await this.findBySlug(dto.slug);

    if (!existing) {
      throw new NotFoundException(
        `Задачи с таким slug: ${dto.slug} не существует`,
      );
    }

    return this.prisma.problem.update({
      where: { id: existing.id },
      data: {
        isPublished: dto.value,
      },
      include: this.baseInclude,
    });
  }

  async findAll(dto: GetProblemsDto) {
    const { page = 1, limit = 20, difficulty, isPublished, search } = dto;
    const where: Prisma.ProblemWhereInput = {};

    if (difficulty) where.difficulty = difficulty;
    if (typeof isPublished === 'boolean') where.isPublished = isPublished;
    if (search) where.slug = { contains: search, mode: 'insensitive' };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.problem.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: this.baseInclude,
      }),

      this.prisma.problem.count({ where }),
    ]);

    return { items, total, page, limit };
  }

  async findOne(slug: string) {
    const problem = await this.prisma.problem.findUnique({
      where: { slug },
      include: this.baseInclude,
    });

    if (!problem) {
      throw new NotFoundException(`Задачи со slug: "${slug}" не существует`);
    }

    return problem;
  }

  async remove(slug: string) {
    const existing = await this.prisma.problem.findUnique({
      where: { slug },
    });

    if (!existing) {
      throw new NotFoundException(`Задачи со slug: "${slug}" не существует`);
    }

    return this.prisma.problem.delete({
      where: { id: existing.id },
    });
  }
}
