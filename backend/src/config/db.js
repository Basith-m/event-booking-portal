import mongoose from 'mongoose';
import dns from 'node:dns';

// Force DNS resolution using Google & Cloudflare DNS to bypass local ISP SRV blocks
dns.setServers(['8.8.8.8', '1.1.1.1']);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[Database Error] Connection failed: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;