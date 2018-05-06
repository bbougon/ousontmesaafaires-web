export class Signature {

  public apiKey: string;
  public signature: string;

  constructor(private body: any) {
    this.apiKey = body.apiKey;
    this.signature = body.signature;
  }
}
