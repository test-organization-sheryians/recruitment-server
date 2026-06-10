
export const paginateAggregation = async (model, pipeline = [], { page = 1, limit = 10 } = {}) => {
    if (!model || typeof model.aggregate !== "function") {
        throw new Error("A valid Mongoose model with an aggregate function is required");
    }

    if (!Array.isArray(pipeline)) {
        throw new Error("Pipeline must be an array");
    }

    let currentPage = parseInt(page, 10);
    let pageLimit = parseInt(limit, 10);

    if (Number.isNaN(currentPage) || currentPage < 1) currentPage = 1;
    if (Number.isNaN(pageLimit) || pageLimit < 1) pageLimit = 10;

    const skip = (currentPage - 1) * pageLimit;

    const finalPipeline = [
        ...pipeline,
        {
            $facet: {
                data: [{ $skip: skip }, { $limit: pageLimit }],
                totalCount: [{ $count: "count" }],
            },
        },
    ];

    const result = await model.aggregate(finalPipeline);
    const data = result?.[0]?.data || [];
    const totalRecords = result?.[0]?.totalCount?.[0]?.count || 0;

    return {
        data,
        pagination: {
            totalRecords,
            totalPages: Math.ceil(totalRecords / pageLimit),
            currentPage,
            limit: pageLimit,
        },
    };
};
