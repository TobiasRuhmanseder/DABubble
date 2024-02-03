export class Message {
    senderId: string;
    timestamp: string;
    content: string;
    answers: any[];
    reactions: any[];


    constructor(obj: any) {
        this.senderId = obj ? obj.senderId : '';
        this.timestamp = obj ? obj.timestamp : '';
        this.content = obj ? obj.content : '';
        this.answers = obj ? obj.answers : [];
        this.reactions = obj ? obj.reactions : [];
    }

    public toJSON() {
        return{
            senderId: this.senderId,
            timestamp: Date.now(),
            content: this.content,
            answers: this.answers,
            reactions: this.reactions
        }
    }
}