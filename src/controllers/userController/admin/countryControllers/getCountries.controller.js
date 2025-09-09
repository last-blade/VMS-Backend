import mongoose from "mongoose";
import { apiResponse, asyncHandler, Country } from "../../../allImports.js";

const getCountries = asyncHandler(async (request, response) => {
    const countries = await Country.aggregate([
        {
            $match: {
                company: new mongoose.Types.ObjectId(request.user.company)
            }
        },

        {
            $lookup: {
                from: "companies",
                localField: "company",
                foreignField: "_id",
                as: "companyDetails"
            }
        },
        
        {
            $unwind: "$companyDetails"
        },

        {
            $match: {
                "companyDetails.isCompanyActive": true
            }
        },

        {
            $project: {
                company: 0,
                countryCreator: 0,
                __v: 0,
            }
        },
    ]);

    return response.status(200)
    .json(
        new apiResponse(200, countries, "Countries fetched successfully")
    )
});

export {getCountries}