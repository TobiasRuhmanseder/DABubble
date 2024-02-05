export class Message {
  senderId: string;
  timestamp: string;
  content: string;
  answers: any[];
  reactionNerd: any[];
  reactionCheck: any[];
  reactionRaising: any[];
  reactionRocket: any[];

  constructor(obj: any) {
    this.senderId = obj ? obj.senderId : '';
    this.timestamp = obj ? obj.timestamp : '';
    this.content = obj ? obj.content : '';
    this.answers = obj ? obj.answers : [];
    this.reactionNerd = obj ? obj.reactionNerd : [];
    this.reactionCheck = obj ? obj.reactionCheck : [];
    this.reactionRaising = obj ? obj.reactionRaising : [];
    this.reactionRocket = obj ? obj.reactionRocket : [];
  }

  public toJSON() {
    return {
      senderId: this.senderId,
      timestamp: Date.now(),
      content: this.content,
      answers: this.answers,
      reactionNerd: this.reactionNerd,
      reactionCheck: this.reactionCheck,
      reactionRaising: this.reactionRaising,
      reactionRocket: this.reactionRocket,
    };
  }
}
