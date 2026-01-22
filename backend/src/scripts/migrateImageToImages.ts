import { connectDB } from '../db2';
import { Product } from '../models/Product';

const migrate = async () => {
  await connectDB();
  const products = await Product.find();
  for (const p of products) {
    // If document already has images array, skip
    if ((p as any).images && Array.isArray((p as any).images) && (p as any).images.length > 0) continue;
    // If legacy `image` field exists, migrate it to images
    const legacyImage = (p as any).image;
    if (legacyImage) {
      (p as any).images = [legacyImage];
      delete (p as any).image;
      await p.save();
      console.log(`Migrated product ${p.id} to images array`);
    }
  }
  console.log('Image -> images migration complete');
  process.exit(0);
};

migrate().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
