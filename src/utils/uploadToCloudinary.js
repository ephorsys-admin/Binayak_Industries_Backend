import { Readable } from "stream";
import cloudinary from "../config/cloudinary.js";

const uploadToCloudinary = (buffer, folder, options = {}) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder,
                resource_type: "auto",
                ...options,
            },
            (error, result) => {
                if (error) return reject(error);

                resolve(result);
            },
        );

        Readable.from(buffer).pipe(stream);
    });
};

export default uploadToCloudinary;
