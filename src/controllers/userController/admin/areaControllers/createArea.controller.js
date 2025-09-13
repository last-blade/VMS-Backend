import { asyncHandler, apiError, apiResponse, Area, isObjectIdValid, Plant, Company } from "../../../allImports.js";

export const createArea = asyncHandler(async (request, response) => {
  const { areaName, plant } = request.body;

  if(!areaName || areaName.trim() === ""){
    throw new apiError(400, "Area name is required")
  }

  if(!isObjectIdValid(plant)){
    throw new apiError(400, "Plant ID is invalid")
  }

  try {
    const newArea = await Area.create({
      areaName,
      plant,
      company: request.user.company,
      areaCreator: request.user.id,
    });

    await Plant.findByIdAndUpdate(plant, {
      $inc: {
        usageCount: 1
      }
    }, {new: true});

    await Company.findByIdAndUpdate(request.user.company, {
      $inc: {
        usageCount: 1
      }
    }, {new: true});

    return response.status(201)
    .json(
        new apiResponse(201, newArea, "Area created successfully")
    );

  } catch (error) {
    // MongoDB duplicate key error code
    if (error.code === 11000) {
      throw new apiError(400, `Area name '${areaName}' already exists in this plant`);
    }

    throw new apiError(500, error.message || "Something went wrong");
  }
});
