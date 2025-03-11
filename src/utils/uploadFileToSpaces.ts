import {
    ObjectCannedACL,
    PutObjectCommand,
    S3Client,
  } from "@aws-sdk/client-s3";
  
  // TODO: create a new repo called codevideo-cloud and move this function there
  // Function to upload video to DigitalOcean Spaces
  export const uploadFileToSpaces = async (
    buffer: Buffer,
    filename: string
  ): Promise<string> => {
    const s3Client = new S3Client({
      endpoint: "https://sfo2.digitaloceanspaces.com",
      forcePathStyle: false,
      region: "sfo2",
      credentials: {
        accessKeyId: process.env.CODEVIDEO_SPACES_KEY_ID || "",
        secretAccessKey: process.env.CODEVIDEO_SPACES_SECRET || "",
      },
    });
  
    const params = {
      Bucket: "coffee-app",
      Key: `codevideo/audio/${filename}`,
      Body: buffer,
      ACL: ObjectCannedACL.public_read,
    };
  
    try {
      const data = await s3Client.send(new PutObjectCommand(params));
      console.log(
        "Successfully uploaded object: " + params.Bucket + "/" + params.Key
      );
      // return URL to the uploaded video
      return `https://${params.Bucket}.sfo2.cdn.digitaloceanspaces.com/${params.Key}`;
    } catch (err) {
      throw new Error(`Error uploading object: ${err}`);
    }
  };
  