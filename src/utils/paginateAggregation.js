/**
 * Universal Aggregation Pagination Utility
 * Works with any MongoDB model & aggregation pipeline
 */

export const  paginateAggregation = async ({
  model,
  pipeline = [],
  page = 1,
  limit = 10
}) => {

  page = parseInt(page);
  limit = parseInt(limit);

  if (page < 1) page = 1;
  if (limit < 1) limit = 10;

  const skip = (page - 1) * limit;

  const finalPipeline = [
    ...pipeline,
    {
      $facet: {
        data: [
          { $skip: skip },
          { $limit: limit }
        ],
        totalCount: [
          { $count: "count" }
        ]
      }
    }
  ];

  const result = await model.aggregate(finalPipeline);

  const data = result[0]?.data || [];
  const totalRecords = result[0]?.totalCount[0]?.count || 0;

  return {
    data,
    pagination: {
      totalRecords,
      currentPage: page,
      totalPages: Math.ceil(totalRecords / limit),
      limit
    }
  };
};
