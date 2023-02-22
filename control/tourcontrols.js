const mytour = require('../models/model');
const catchasnc = require('../utils/catcherror');
const Apperror = require('../utils/apperror');
const handlefactory = require('./handlefactory');
exports.updattour = handlefactory.UpdateOne(mytour);
//  catchasnc(async (req, res,next) => {
//     const upd = await mytour.findByIdAndUpdate(req.params.id, req.body, {
//         new: true
//     })
//     if(!upd){
//         return next(new Apperror('no id is find',404));
//     }
//     res.status(200).json({
//         status: "Success",
//         data: {
//             mytour: upd
//         }
//     });
// });
exports.getstats = catchasnc(async (req, res, next) => {
    const stats = await mytour.aggregate([
        {
            $match: {
                price: {
                    $gte: 500
                }
            }
        }
        , {
            $group: {
                _id: '$difficulty',
                numtour: { $sum: 1 },
                avgrating: { $avg: '$ratingsAverage' },
                sumprice: { $sum: '$price' },
                maxprice: { $max: '$price' },
                minprice: { $min: '$price' }
            }
        }, {
            $sort: {
                avgrating: 1,

            }
        }
    ])
    res.status(200).json({

        status: "Success",
        data: {
            mytour: stats
        }
    });
})
exports.tourWithindis = catchasnc(async (req, res, next) => {
    const { distance, latlng, unit } = req.params;

    const [lat, lng] = latlng.split(',');
    const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;
    if (!lat || !lng) {
        return next(new Apperror('Please provide latitutr and longitude in the format lat,lng.', 400));
    }

    const ttt = await mytour.find({ startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } } });
    res.status(200).json({
        status: "Success",
        length: ttt.length,
        data: ttt
    })

})

exports.getdistances = catchasnc(async (req, res, next) => {

    const { latlan, unit } = req.params;
    const [lat, lan] = latlan.split(',');
    const multiplier = unit === 'mi' ? 0.000621371 : 0.001;

    if (!lat || !lan) {
        return next(new Apperror('Please provide latitutr and longitude in the format lat,lng.', 400));
    }
    const distance = await mytour.aggregate([
        {
            $geoNear: {
                near: {
                    type: 'Point',
                    coordinates: [lan * 1, lat * 1]
                },
                distanceField: 'distance',
                distanceMultiplier: multiplier
            }

        }, {
            $project: {
                distance: 1,
                name: 1
            }
        }
    ])
    res.status(200).json({
        status: "Success",
        len: distance.length,
        data: distance
    })

})
exports.getyear = catchasnc(async (req, res) => {
    const year = req.params.year;
    const years = await mytour.aggregate([{
        $unwind: "$startDates"//for deconstrct the array element into the one
    }, {
        $match: {
            startDates: {
                $gte: new Date(`${year}-01-01`),
                $lte: new Date(`${year}-12-31`)

            }
        }
    },
    {
        $group: {
            _id: { $month: "$startDates" },
            numoftour: { $sum: 1 },
            tours: { $push: "$name" }
        }
    }, {
        $addFields: { month: "$_id" }
    }, {
        $project: { _id: 0 }
    }, {
        $sort: {
            numoftour: 1
        }
    }
    ])
    if (!years) {
        return new Apperror("no year is find ", 404);
    }
    res.status(200).json({
        status: "Success",
        data: {
            mytour: years
        }
    });
});
exports.posttour = handlefactory.createone(mytour)
exports.deleteTour = handlefactory.deleteone(mytour);
exports.getonetour = handlefactory.getone(mytour, { path: 'review' })
exports.gettour = handlefactory.getall(mytour);
