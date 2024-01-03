const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const HousesController = require('../controllers/HouseController');
const RentalController = require('../controllers/RentalController');
const AvailableDayController = require('../controllers/AvailableDayController');
const HouseImageController = require('../controllers/HouseImageController');


/**
 * Configuração das rotas para o HouseImageController
 */

router.route('/house-image')
    .get(HouseImageController.index)
    .post(HouseImageController.store);

router.route('/house-image/:id')
    .get(HouseImageController.show)
    .put(HouseImageController.update)
    .patch(HouseImageController.update)
    .delete(HouseImageController.destroy);

/**
 * Configuração das rotas para o AvailableDayController
 */

router.route('/available-day')
    .get(AvailableDayController.index)
    .post(AvailableDayController.store);

router.route('/available-day/:id')
    .get(AvailableDayController.show)
    .put(AvailableDayController.update)
    .patch(AvailableDayController.update)
    .delete(AvailableDayController.destroy);

/**
 * Configuração das rotas para o RentalController
 */

router.route('/rental')
    .get(RentalController.index)
    .post(RentalController.store);

router.route('/rental/:id')
    .get(RentalController.show)
    .put(RentalController.update)
    .patch(RentalController.update)
    .delete(RentalController.destroy);

/**
 * Configuração das rotas para o HouseController
 */

router.route('/house')
    .get(HousesController.index)
    .post(HousesController.store);

router.route('/house/:id')
    .get(HousesController.show)
    .put(HousesController.update)
    .patch(HousesController.update)
    .delete(HousesController.destroy);

/**
 * Configuração das rotas para o UserController
 */

router.route('/user')
    .get(UserController.index)
    .post(UserController.store);

router.route('/user/:id')
    .get(UserController.show)
    .put(UserController.update)
    .patch(UserController.update)
    .delete(UserController.destroy);


module.exports = router;
