export class WhatsappIncomingMessage {
  id: string;
  business: {
    phoneNumber: string;
    phoneNumberId: string;
  };
  message: {
    text?: any;
    type: string;
    from: string;
    id: string;
    timestamp: string;
  };
  customer: {
    phoneNumber: string;
    profile: { name: string };
  };
}

export class WhatsappResponse {
  data: object;
  recipient_type: string;
  phoneNumberId: string;
  constructor(params: any) {
    const { data, phoneNumberId } = params;
    this.data = data;
    this.phoneNumberId = phoneNumberId;
    this.recipient_type = 'individual';
  }
}
