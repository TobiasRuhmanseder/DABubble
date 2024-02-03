import { Message } from "./message.class";

export class Channel {
    id?: string;
    name: string;
    description: string;
    creator: string;
    users: string[];
    messages: Message[];

    constructor(obj: any, id:string) {
        this.id = id? id:'';
        this.name = obj ? obj.name : '';
        this.description = obj ? obj.description : '';
        this.creator = obj ? obj.creator : '';
        this.users = obj ? obj.users : '';
        this.messages = obj ? obj.messages : '';
    }


    public toJSON() {
        return {
            id: '',
            name: this.name,
            description: this.description,
            creator: this.creator,
            users: this.users,
            messages: this.messages
        }
    }
}