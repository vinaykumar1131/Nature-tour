const catchasnc = require('../utils/catcherror')
const Apperror = require('../utils/apperror');
const apis = require('../utils/fill');
exports.getone = (model, popOptions) =>
    catchasnc(async (req, res, next) => {
        const val = await model.findById(req.params.id).populate(popOptions);
        if (!val) {
            return next(new Apperror('no id is find ', 404));
        }
        res.status(200).json({
            status: 'success',
            data: {
                data: val
            }
        });
    })
exports.getall = model =>
    catchasnc(async (req, res, next) => {
        let filter = {};
        if (req.params.tourId) filter = { tour: req.params.tourId };
        const feature = new apis(model.find(filter), req.query).fillter().pagination();//making the object of apis class
        if (req.query.sort) {
            feature.sort();
        }
        if (req.query.feilds) {
            feature.select();
        }
        let re = await feature.query;
        res.status(200).json({
            status: "Success",
            length: re.length,
            data: {
                mytour: re
            }
        });
        next();
    })
exports.createone = model =>
    catchasnc(async (req, res, next) => {
        const dt = await model.create(req.body);
        res.status(201).json({
            status: 'Succes',
            data: {
                data: dt
            }
        })
    });
exports.UpdateOne = model =>
    catchasnc(async (req, res, next) => {
        const update = await model.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!update) {
            return next(new Apperror('No document found with that ID', 404));
        }
        res.status(200).json({
            status: 'success',
            data: {
                data: update
            }
        });
    })
    exports.deleteone = model =>
    catchasnc(async (req, res, next) => {
        const data = await model.findByIdAndDelete(req.params.id);
        if (!data) {
            return next(new Apperror('No doc found with that ID', 404));
        }
        res.status(204).json({
            status: 'success',
            data
        });
        next();
    });

