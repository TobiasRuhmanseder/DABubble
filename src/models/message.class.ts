export class Message {
    senderId: string;
    timestamp: string;
    content: string;
    answers: any[];


    constructor(obj: any) {
        this.senderId = obj ? obj.senderId : '';
        this.timestamp = obj ? obj.timestamp : '';
        this.content = obj ? obj.content : '';
        this.answers = obj ? obj.answers : [];
    }

    public toJSON() {
        return{
            senderId: this.senderId,
            timestamp: Date.now(),
            content: this.content,
            answers: this.answers
        }
    }
}