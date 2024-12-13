import Tour from '../models/tourModel.js';
import APIFeatures from '../utils/ApiFeatures.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';

//AliasTopTours -top-5 -cheap
export const aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingAverage,price';
  req.query.fields = 'name,price,ratingAverage,summary,difficulty';
  next();
};

//CREATE TOUR
export const createTour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      tour: newTour,
    },
  });
});

//GET ALL TOUR
export const getAllTour = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate()
    .search()
    .filterDeleted()
    .regexFilter(['name', 'description'])
    .populate()
    .rangeFilter(['price', 'rating']);

  const tour = await features.query;

  //Send Response
  res.status(200).json({
    status: 'success',
    result: tour.length,
    data: {
      tour,
    },
  });
});

//GET SINGLE TOUR
export const getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);

  if (!tour) {
    return next(new AppError('No tour found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

//UPDATE TOUR
export const updateTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!tour) {
    return next(new AppError('No tour found with that ID', 404));
  }
  //Sending Response
  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

//DELETE TOUR
export const deleteTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndDelete(req.params.id);

  if (!tour) {
    return next(new AppError('No tour found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour: null,
    },
  });
});

//GET TOUR STATS
export const getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    // Match: Filter tours, e.g., only active tours or a specific condition
    {
      $match: {
        ratingAverage: { $gte: 4.5 },
      },
    },
    // Group: Group data to calculate stats
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingQuantity' },
        avgRating: { $avg: '$ratingAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    // Sort: Optional sorting of results
    {
      $sort: { avgPrice: 1 }, // Sort by average price in ascending order
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
});
//GET MONTLY TOUR START
export const getMonthlyPlans = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;
  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStarts: { $sum: 1 },
        tours: {
          $push: '$name',
        },
      },
    },
    {
      $addFields: {
        month: '$_id',
      },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: {
        numTourStarts: -1,
      },
    },
    // {
    //   $limit: 12,
    // },
  ]);

  res.status(201).json({
    status: 'success',
    data: {
      plan,
    },
  });
});
