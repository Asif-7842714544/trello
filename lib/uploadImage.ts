import { ID, storage } from "@/appWrite";

const uploadImage = async (file: File) => {
  if (!file) return;

  const fileuploaded = await storage.createFile(
    process.env.NEXT_PUBLIC_STORAGE_BUCKET_ID,
    ID.unique(),
    file
  );

  return fileuploaded;
};

export default uploadImage;
