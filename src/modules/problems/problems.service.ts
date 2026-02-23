import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Locale } from '@prisma/client';

@Injectable()
export class ProblemsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(locale: Locale = Locale.RU) {
    const problems = await this.prisma.problem.findMany({
      where: { isPublished: true },
      include: {
        translations: {
          where: { locale },
          select: { title: true, locale: true },
        },
      },
    });

    return problems.map((p) => ({
      id: p.id,
      slug: p.slug,
      difficulty: p.difficulty,
      title: p.translations[0]?.title || p.slug,
      locale: p.translations[0]?.locale || locale,
    }));
  }

  async findBySlug(slug: string, locale: Locale = Locale.RU) {
    const problem = await this.prisma.problem.findUnique({
      where: { slug, isPublished: true },
      include: {
        translations: {
          where: { locale },
        },
        testCases: {
          where: { isHidden: true },
        },
      },
    });

    if (!problem || problem.translations.length === 0) {
      throw new NotFoundException(`Problem ${slug} not found`);
    }

    const translation = problem.translations[0];

    return {
      id: problem.id,
      slug: problem.slug,
      difficulty: problem.difficulty,
      isPublished: problem.isPublished,
      title: translation.title,
      description: translation.description,
      examples: translation.examples,
      constraints: translation.constraints,
      starterCode: translation.starterCode,
      tags: translation.tags,
      testCases: problem.testCases,
    };
  }
}
