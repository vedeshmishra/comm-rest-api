import cloudinary from 'cloudinary';

cloudinary.v2.config({
    basePath: "",
   /* cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    */
        cloud_name: "devdiggi",
        api_key: "895791127296488",
        api_secret: "NQg5Cuxi-wmmM91kdFrXPa9gHFA",
    secure: true
    } );

    const cloudinaryUpload = async (file) => {
        return new Promise((resolve, reject) => {
            cloudinary.v2.uploader.upload(file, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve({
                        url:result.secure_url,
                        public_id:result.public_id,
                        asset_type:result.asset_type,
                    }, { resource_type:result.resource_type });
                }
            });
        });

    }; 

    const cloudinaryDeleteImg = async (file) => {
        return new Promise((resolve, reject) => {
            cloudinary.v2.uploader.destroy(file, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve({
                        url:result.secure_url,
                        public_id:result.public_id,
                        asset_type:result.asset_type,
                    }, { resource_type:result.resource_type });
                }
            });
        });

    }; 
export { cloudinaryUpload, cloudinaryDeleteImg };