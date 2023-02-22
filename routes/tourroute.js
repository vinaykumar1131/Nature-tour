const express = require('express');
const tourcontrol = require('../control/tourcontrols.js');
const AuthControl = require('../control/Authcontrol');
const reviewcontroll = require('./reviewRoutes')
const routes = express.Router();
routes.use("/:tourid/review", reviewcontroll)
routes.route('/').get(tourcontrol.gettour).post(AuthControl.restictto('admin', 'lead-guide'), tourcontrol.posttour);
routes.route("/tourstats").get(tourcontrol.getstats);
routes.route("/touryear/:year").get(tourcontrol.getyear);
routes.route('/:id').get(tourcontrol.getonetour).patch(AuthControl.protect, AuthControl.restictto('admin', 'lead-roles'), tourcontrol.updattour).delete(
    AuthControl.protect, AuthControl.restictto('admin', 'lead-roles'),
    tourcontrol.deleteTour);
routes.route('/tour-within/:distance/center/:latlng/unit/:unit').get(tourcontrol.tourWithindis);
routes.route('/tour-distance/:latlan/unit/:unit').get(tourcontrol.getdistances);
module.exports = routes;

