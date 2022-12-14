import { Job } from 'bull';
import { Logger } from '@nestjs/common';
import { Processor, Process } from '@nestjs/bull';

@Processor('intent*11557')
export class IntentProcessor {
  private logger = new Logger(IntentProcessor.name);

  @Process('complete')
  async process(job: Job<any>) {
    this.logger.log('2nnnnnnnn=>', JSON.stringify(job.data, null, 1));
    return {};
  }
}
