const catchasnc = require('./../utils/catcherror');
const sharp = require('sharp');
const multer = require('multer')
const mytour = require('../models/makeuser.js');
const Apperror = require('../utils/apperror');
const user = require('../models/makeuser.js');
const factoryHandler = require('./handlefactory')
// const multerStorage = multer.diskStorage({
//     destination: (req, file, cp) => {
//         cp(null, 'public/img/users');
//     },
//     filename: (req, file, cb) => {
//         const ext = file.mimetype.split('/')[1];
//         cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
//     }
// })
const multerStorage = multer.memoryStorage();
const multerFilter = (req, file, cp) => {
    if (file.mimetype.startsWith('image'))
        cp(null, true)
    else
        cp(new Apperror('Not an image please upload an image', 400), false)
}
const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
})
exports.userPhoto = upload.single('photo');
exports.resizephoto = (req, res, next)=> {
    if (!req.file){
        console.log("there is no file present")
        return next();
    }
    req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;
    console.log("i am in resize photo")
     sharp(req.file.buffer)
        .resize(500, 500)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/users/${req.file.filename}`)
        next();
}
const filterobj = (obj, ...objdet) => {
    const resobj = {};
    Object.keys(obj).forEach(el => {
        if (objdet.includes(el))
            resobj[el] = obj[el];
    })
    return resobj;
}
exports.updateme = catchasnc(async (req, res, next) => {
    if (req.body.password || req.body.conformpass) {
        return next(new Apperror('you have a other route for changing this', 401));
    }
    const fillobj = filterobj(req.body, 'name', 'email');
    if (req.file) fillobj.photo = req.file.filename;

    const update = await mytour.findByIdAndUpdate(req.user._id, fillobj, {
        new: true,
        runValidators: true
    })
    res.status(200).json({
        status: 'success',
        data: {
            user: update
        }
    });
})
exports.deleteme = catchasnc(async (req, res, next) => {
    await mytour.findByIdAndDelete(req.body._id, { active: false });
    res.status(201).json({
        status: "deleted succesfully"
    })
})
exports.getme = (req, res, next) => {
    req.params.id = req.user.id;
    next();
}
exports.getuser = factoryHandler.getall(user);
exports.deleteuser = factoryHandler.deleteone(user);
exports.getoneuser = factoryHandler.getone(user);