import mongoose, {Schema,Document} from "mongoose";

export interface IUser extends Document {
  name : string;
  email : string;
  password : string;
  role : 'User' | 'Admin';
  budget : number;
}

const userSchema = new Schema<IUser>({
  name : {type : String, required : true},
  email : {type : String, required : true, unique : true},
  password : {type : String, required : true},
  role : {type : String, enum : ['User','Admin'], default : 'User'},
  budget : {type : Number, default : 0},
},
{
  timestamps : true
}
)

const User = mongoose.model<IUser>('User',userSchema);
export default User;