export class Message {
  id: string;
  senderId: string;
  timestamp: number;
  content: string;
  reactionNerd: any[];
  reactionCheck: any[];
  reactionRaising: any[];
  reactionRocket: any[];

  constructor(obj: any) {
    this.id = obj ? obj.id : '';
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
      id: this.id,
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
