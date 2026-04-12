import { Controller } from '@nestjs/common';
import { ProblemsService } from '@modules/dashboard/problems/problems.service';

@Controller('problems')
export class ProblemsController {
  constructor(private  problemService: ProblemsService) {}
}