export class Channel {
    name: string;
    description: string;
    creator: string;
    users: string[];


    constructor(obj: any) {
        this.name = obj ? obj.name : '';
        this.description = obj ? obj.description : '';
        this.creator = obj ? obj.creator : '';
        this.users = obj ? obj.users : '';
    }


    public toJSON() {
        return{
            name: this.name,
            description: this.description,
            creator: this.creator,
            users: this.users
        }
    }
}