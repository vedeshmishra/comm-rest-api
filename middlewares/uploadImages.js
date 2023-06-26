import multer from 'multer';
import sharp from 'sharp';
import path from "path"; 
import fs from "fs";  

const __dirname=fs.realpathSync('.'); 

const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        
        cb(null, path.join(__dirname, "/public/images/"));
        
        //console.log('hi', path.join(__dirname, "/public/images/"))
    
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = file.mimetype.split('/')[1]; 
       // console.log( file.fieldname + '-' + uniqueSuffix+"."+ext);
        cb(null, file.fieldname + '-' + uniqueSuffix+"."+ext); 
    }
});
const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) { 

        cb(null, file);
        return;
        // cb(null, false);
    }else{
        cb({
            message: 'Not an image! unsupported file format'
        }, false);
    }
}

const uploadImg = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
    limits: {
        fileSize: 1024 * 1024 * 5,
    }

});


const productImgResize = async (req, res, next) => {
    if (!req.file) return next();
   // req.file.filename = `product-${req.file.filename}`;
    await Promise.all(
        req.files.map( async (file) => {
            await sharp(req.file.path)
            .resize(500, 500)
            .toFormat('jpeg')
            .jpeg({ quality: 90 })
            .toFile(path.join(__dirname, '../public/images/product', file.filename)); 
            fs.unlinkSync(path.join(__dirname, '../public/images/product', file.filename));
        }) 
        
    ); 
    // console.log(req.file);
    next();
};


const blogImgResize = async (req, res, next) => {
    
    if (!req.file) return next();
    
    
   // req.file.filename = `product-${req.file.filename}`; 
    await Promise.all(
        req.files.map( async (file) => {
            await sharp(req.file.path)
            .resize(500, 500)
            .toFormat('jpeg')
            .jpeg({ quality: 90 })
            .toFile(path.join(__dirname, '../public/images/blog', file.filename)); 
            fs.unlinkSync(path.join(__dirname, '../public/images/blog', file.filename));
        }) 
        
    ); 
    next();
    // console.log(req.file);
};


export { uploadImg, productImgResize, blogImgResize };