import { Injectable } from '@nestjs/common';

const db = [
  {
    id: 11557,
    activeStepId: null,
    output: {},
    phone: '14375333235',
  },
];

@Injectable()
export class UserService {
  async getUserById(userId: number) {
    return db.find((user) => user.id === userId);
  }

  async getUserByPhone(phone: string) {
    return db.find((user) => user.phone === phone);
  }

  async resetUserOutput(userId: number) {
    const user = await this.getUserById(userId);
    user.output = {};
  }

  async updateActiveIntentFor(
    userId: number,
    { stepId = undefined, changes = undefined },
  ) {
    const user = await this.getUserById(userId);
    if (stepId) user.activeStepId = stepId;
    if (changes) user.output = { ...user.output, ...changes };
    return user;
  }

  async getUserActiveIntentInfo(userId: number) {
    const user = await this.getUserById(userId);
    return {
      stepId: user.activeStepId,
      output: user.output,
    };
  }
}
