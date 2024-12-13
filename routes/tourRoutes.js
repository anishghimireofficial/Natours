import express from 'express';
import {
  getAllTour,
  getTour,
  updateTour,
  createTour,
  deleteTour,
  aliasTopTours,
  getTourStats,
  getMonthlyPlans,
} from '../controllers/tourController.js';

const router = express.Router();

router.route('/tour-stats').get(getTourStats);

router.route('/monthly-plan/:year').get(getMonthlyPlans);

router.route('/top-5-cheap').get(aliasTopTours, getAllTour);

router.route('/').get(getAllTour).post(createTour);

router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

export default router;
