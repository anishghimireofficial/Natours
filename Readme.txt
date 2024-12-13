API Documentation: Get All Tours
This API endpoint allows clients to fetch tour data with powerful querying, filtering, sorting, field selection, and pagination capabilities.

Endpoint
GET /api/v1/tours

Features

1. Filtering
   Allows users to filter tours based on specific query parameters.

Example:
GET /api/v1/tours?duration=5&difficulty=easy
Filters tours with a duration of 5 and difficulty "easy."
Advanced Filtering
Supports operators for more complex queries:

gte → greater than or equal
gt → greater than
lte → less than or equal
lt → less than
Example:
GET /api/v1/tours?price[gte]=500&ratingsAverage[gte]=4.5
Filters tours with a price of at least 500 and an average rating of 4.5 or higher. 2. Sorting
Sorts the data by one or multiple fields in ascending or descending order.

Query Parameter: sort
Example:
GET /api/v1/tours?sort=price
Sorts tours by price in ascending order.
GET /api/v1/tours?sort=-price
Sorts tours by price in descending order.
GET /api/v1/tours?sort=price,-ratingsAverage
Sorts tours by price (ascending) and then by average rating (descending). 3. Field Limiting
Allows the client to retrieve only specific fields of the tours, improving performance and reducing payload size.

Query Parameter: fields
Example:
GET /api/v1/tours?fields=name,price,duration
Returns only the name, price, and duration fields for each tour.
By default, the \_\_v field is excluded from the response unless explicitly requested.

4. Pagination
   Fetches tours in chunks, enabling large datasets to be delivered page by page.

Query Parameters:

page → The page number (default: 1).
limit → The number of items per page (default: 100).
Example:
GET /api/v1/tours?page=2&limit=10
Fetches the second page of results, with 10 tours per page.
Pagination skips records using the formula:
skip = (page - 1) \* limit

If the requested page exceeds the number of available documents, the API returns an error:
"This page does not exist"

<!-- Response Format -->

Success Response
Status Code: 201
Body:
json

{
"status": "success",
"result": 3,
"data": {
"tour": [
{
"id": 1,
"name": "Mountain Explorer",
"price": 499,
"duration": 7
},
{
"id": 2,
"name": "Desert Wanderer",
"price": 299,
"duration": 4
},
{
"id": 3,
"name": "Ocean Dive",
"price": 399,
"duration": 5
}
]
}
}

<!-- Error Response -->

Status Code: 404
Body:
json{
"status": "fail",
"message": "This page does not exist"
}

Examples

1. Filter, Sort, and Paginate
   GET /api/v1/tours?duration[gte]=5&sort=price&fields=name,price,duration&page=2&limit=5

Filters tours with a duration of at least 5.
Sorts by price in ascending order.
Returns only the name, price, and duration fields.
Displays the second page with 5 tours per page.
Notes
Default sorting is by creation date (-createdAt).
The API dynamically builds queries, allowing for flexible and efficient data fetching.
Handle errors gracefully when pages exceed the dataset size or invalid queries are made.
