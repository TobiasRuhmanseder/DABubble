export class Message {
  senderId: string;
  timestamp: number;
  content: string;
  reactionNerd: any[];
  reactionCheck: any[];
  reactionRaising: any[];
  reactionRocket: any[];

  constructor(obj: any) {
    this.senderId = obj ? obj.senderId : '';
    this.timestamp = obj ? obj.timestamp : 0;
    this.content = obj ? obj.content : '';
    this.reactionNerd = obj ? obj.reactionNerd : [];
    this.reactionCheck = obj ? obj.reactionCheck : [];
    this.reactionRaising = obj ? obj.reactionRaising : [];
    this.reactionRocket = obj ? obj.reactionRocket : [];
  }

  public toJSON() {
    return {
      senderId: this.senderId,
      timestamp: this.timestamp,
      content: this.content,
      reactionNerd: this.reactionNerd,
      reactionCheck: this.reactionCheck,
      reactionRaising: this.reactionRaising,
      reactionRocket: this.reactionRocket,
    };
  }
}
