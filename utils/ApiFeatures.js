class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  // FILTERING
  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  // SORTING
  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  // LIMITING FIELDS
  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  // PAGINATION
  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }

  // SEARCH FUNCTIONALITY
  search() {
    if (this.queryString.search) {
      const searchFields = ['name', 'description', 'summary'];
      const regex = new RegExp(this.queryString.search, 'i');
      const searchQuery = {
        $or: searchFields.map((field) => ({ [field]: regex })),
      };
      this.query = this.query.find(searchQuery);
    }
    return this;
  }

  // SET DEFAULTS FOR MISSING PARAMETERS
  setDefaults(defaults) {
    this.queryString = { ...defaults, ...this.queryString };
    return this;
  }

  // DISTINCT QUERIES
  distinct(field) {
    if (this.queryString.distinct) {
      this.query = this.query.distinct(field || this.queryString.distinct);
    }
    return this;
  }

  // REGEX-BASED FILTERS
  regexFilter(fields = []) {
    fields.forEach((field) => {
      if (this.queryString[field]) {
        const regex = new RegExp(this.queryString[field], 'i');
        this.query = this.query.find({ [field]: regex });
      }
    });
    return this;
  }

  // AGGREGATION PIPELINE SUPPORT
  aggregate(pipeline) {
    if (this.queryString.aggregate) {
      this.query = this.query.aggregate(pipeline);
    }
    return this;
  }

  // CUSTOM QUERY VALIDATION
  validateQuery(validFields) {
    const invalidFields = Object.keys(this.queryString).filter(
      (field) => !validFields.includes(field)
    );
    if (invalidFields.length > 0) {
      throw new Error(`Invalid query fields: ${invalidFields.join(', ')}`);
    }
    return this;
  }

  // SOFT DELETE FILTERING
  filterDeleted() {
    this.query = this.query.find({ isDeleted: { $ne: true } });
    return this;
  }

  // CACHING INTEGRATION
  useCache(cache, key) {
    if (cache.has(key)) {
      this.query = cache.get(key);
    } else {
      cache.set(key, this.query);
    }
    return this;
  }

  // RELATIONSHIP POPULATION
  populate() {
    if (this.queryString.populate) {
      const fieldsToPopulate = this.queryString.populate.split(',').join(' ');
      this.query = this.query.populate(fieldsToPopulate);
    }
    return this;
  }

  // RANGE FILTERS FOR NUMERIC FIELDS
  rangeFilter(fields = []) {
    fields.forEach((field) => {
      if (
        this.queryString[`${field}_min`] ||
        this.queryString[`${field}_max`]
      ) {
        const filter = {};
        if (this.queryString[`${field}_min`])
          filter.$gte = this.queryString[`${field}_min`];
        if (this.queryString[`${field}_max`])
          filter.$lte = this.queryString[`${field}_max`];
        this.query = this.query.find({ [field]: filter });
      }
    });
    return this;
  }

  // GROUP BY
  groupBy(field) {
    if (field) {
      this.query = this.query.group({ _id: `$${field}`, count: { $sum: 1 } });
    }
    return this;
  }

  // CUSTOM ERROR HANDLING
  handleErrors(callback) {
    try {
      return this;
    } catch (err) {
      callback(err);
    }
  }
}

export default APIFeatures;
