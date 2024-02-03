import { Message } from './message.class';

export class Channel {
<<<<<<< HEAD
  id: string;
  name: string;
  description: string;
  creator: string;
  users: string[];
  messages: Message[];

  constructor(obj: any) {
    this.id = obj ? obj.id : '';
    this.name = obj ? obj.name : '';
    this.description = obj ? obj.description : '';
    this.creator = obj ? obj.creator : '';
    this.users = obj ? obj.users : '';
    this.messages = obj ? obj.messages : '';
  }

  public toJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      creator: this.creator,
      users: this.users,
      messages: this.messages,
    };
  }
}
=======
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
>>>>>>> c29f19ff392acbdc1f1a695c1010c9d9062452e5
