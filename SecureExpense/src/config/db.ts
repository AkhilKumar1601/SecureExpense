import mongoose from "mongoose";

const connectDB = async () => {
  try {
     const conn = await mongoose.connect('mongodb+srv://akhilchaudhary1601:Chaudhary1234@cluster0.oend6ww.mongodb.net/SecureExpense?retryWrites=true&w=majority');
     console.log(`MongoDB connected ${conn.connection.host}`);
  } catch (e) {
     if(e instanceof Error) {
      console.error(`Error : ${e.message}`);
     }
     else {
      console.error(`An unknown error is found`);
     }

     process.exit(1);
  }
}

export default connectDB;