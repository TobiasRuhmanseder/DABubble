export class User {
  name: string;
  photoURL: string;
  email: string;
  status: boolean;
  directmsg: any[];

  constructor(obj: any) {
    this.name = obj ? obj.name : '';
    this.photoURL = obj ? obj.photoURL : '';
    this.email = obj ? obj.email : '';
    this.status = obj ? obj.status : false;
    this.directmsg = obj ? obj.directmsg : [];
  }
  public toJSON() {
    return {
      name: this.name,
      photoURL: this.photoURL,
      email: this.email,
      status: this.status,
      directmsg: this.directmsg,
    };
  }
}
