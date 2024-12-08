import mongoose, {Schema,Document} from "mongoose";

export interface IToken extends Document {
  userId : mongoose.Types.ObjectId;
  refreshToken : string;
  expiresAt : Date;
}

const tokenSchema = new Schema <IToken> ({
  userId : {type : mongoose.Schema.Types.ObjectId, required : true, ref : 'User'},
  refreshToken : {type : String, required : true},
  expiresAt : {type : Date, required : true}
},{
  timestamps : true
})

const Token = mongoose.model<IToken>('Token',tokenSchema);
export default Token;