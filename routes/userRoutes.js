import express from 'express';

const router = express.Router();

router.route('/').get(getAllTour);

export default router;
