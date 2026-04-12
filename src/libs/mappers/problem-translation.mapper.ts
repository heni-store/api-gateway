import { Prisma } from '@prisma/client';
import { toJson } from '@app/libs/toJson.lib';
import { TranslationDto } from '@modules/dashboard/problems/dto/translation.dto';

export const mapTranslationCreate = (
  translation: TranslationDto,
): Prisma.ProblemTranslationCreateWithoutProblemInput => ({
  locale: translation.locale,
  title: translation.title,
  description: translation.description,
  examples: toJson(translation.examples ?? {}),
  constraints: toJson(translation.constraints ?? []),
  starterCode: toJson(translation.starterCode ?? {}),
  tags: translation.tags ?? [],
});

export const mapTranslationUpdate = (
  translation: TranslationDto,
): Prisma.ProblemTranslationUpdateWithoutProblemInput => ({
  title: translation.title,
  description: translation.description,
  examples: toJson(translation.examples ?? {}),
  constraints: toJson(translation.constraints ?? []),
  starterCode: toJson(translation.starterCode ?? {}),
  tags: translation.tags ?? [],
});
