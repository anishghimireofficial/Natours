import mongoose from 'mongoose';
import slugify from 'slugify';
import validator from 'validator';

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Tour must have a name'],
      unique: true,
      trim: true,
      maxLength: [40, "Tour Name can't be more than 40 character."],
      minLength: [10, "Tour Name can't be less than 10 character."],
      validate: [validator.isAlpha, 'Tour name must only contain charcaters. '],
    },
    slug: String,
    ratingAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
    },
    ratingQuantity: {
      type: Number,
      default: 0,
    },
    duration: {
      type: Number,
      required: [true, 'Tour must have a duration.'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'moderate', 'medium', 'hard', 'difficult'],
        message:
          'Difficulty is either: easy , medium , hard, moderate, difficult',
      },
    },
    price: {
      type: Number,
      required: [true, 'Tour must have a price.'],
      // max: 5000,
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          // this only point to current doc NEW document creation.
          return val < this.price;
        },
        message: `Discount price ({VALUE}) must be below regular price.`,
      },
    },
    summary: {
      type: String,
      trim: true, //schema types to trim string
      required: [true, 'A tour must have a description'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: false },
  }
);

//Setting Virtual properties
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

//Document middleware : runs before save() and create() only

tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// tourSchema.post('save', function (doc, next) {
//   console.log(doc);
//   next();
// });

//QUERY MIDDLEWARE

tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });

  this.start = Date.now();
  next();
});

// tourSchema.post(/^find/, function (docs, next) {
//   console.log(`Query took ${Date.now() - this.start} milliseconds!`);
//   console.log(docs);

//   next();
// });

//AGGERATE MIDDLEWARE ==>
tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({
    $match: { secretTour: { $ne: true } },
  });
  console.log(this.pipeline());
  next();
});

const Tour = mongoose.model('Tour', tourSchema);

export default Tour;
