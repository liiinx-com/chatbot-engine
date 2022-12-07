import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';

@Processor('11557*intent')
export class IntentConsumer {
  @Process()
  async process(job: Job<any>) {
    console.log('nnnnnnnn=>', JSON.stringify(job.data, null, 1));
    return {};
  }
}
