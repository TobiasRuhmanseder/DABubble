export class User {
  id?: string;
  name: string;
  photoURL: string;
  email: string;
  status: boolean;

  constructor(obj: any, id?: string) {
    this.id = id ? id : '';
    this.name = obj ? obj.name : '';
    this.photoURL = obj ? obj.photoURL : '';
    this.email = obj ? obj.email : '';
    this.status = obj ? obj.status : false;
  }
  public toJSON() {
    return {
      id: this.id,
      name: this.name,
      photoURL: this.photoURL,
      email: this.email,
      status: this.status,
    };
  }
}
