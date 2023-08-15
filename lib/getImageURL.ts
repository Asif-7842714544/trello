import { storage } from "@/appWrite";

const getimageUrl = async (image: Image) => {
  const url = storage.getFilePreview(image.bucketId, image.fileId);
  return url;
};
export default getimageUrl;
