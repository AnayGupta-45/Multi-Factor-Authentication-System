import { connect } from "mongoose";
const dbConnect = async () => {
  try {
    const mongoDbConnection = await connect(process.env.MONGODB_URI);
    console.log(`Database Connected : ${mongoDbConnection.connection.host}`);
  } catch (error) {
    console.log(`Database Connection Failed ${error}`);
    process.exit(1);
  }
};
export default dbConnect;
