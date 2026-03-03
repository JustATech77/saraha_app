import mongoose from "mongoose";

const connect = async () => {
  try {
    const uri = process.env.DB_URL;
    const result = await mongoose.connect(uri);
    console.log("mongoose Connected");
    // console.log(result.models);
    return result;
  } catch (error) {
    console.log("Fail to connect to mongoose", error);
  }
};
export default connect;
