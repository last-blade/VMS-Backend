import { apiError, apiResponse, asyncHandler, City, Company, Country, isObjectIdValid, Plant, PlantType, State } from "../../../allImports.js";
import QRCode from "qrcode";

const createPlant = asyncHandler(async (request, response) => {
    const {plantName, plantType, plantCountry, plantState, plantCity} = request.body;

    if(!plantName || plantName.trim() === ""){
        throw new apiError(400, "Plant is required")
    }

    if(!isObjectIdValid(plantType) || !isObjectIdValid(plantCountry) || !isObjectIdValid(plantState) || !isObjectIdValid(plantCity)){
        throw new apiError(400, "Object IDs are invalid")
    }

    // const foundPlant = await Plant.findOne({
    //     plantName,
    //     plantCreator: request.user.id,
    //     company: request.user.company,
    // });

    //only one plant can exist in a company
    // const foundPlant = await Plant.findOne({
    //     company: request.user.company
    // })

    // if(foundPlant){
    //     throw new apiError(400, "There can only one plant exist in a company")
    // }

    const isPlantExist = await Plant.findOne({
        plantName,
        company: request.user?.company
    })

    if(isPlantExist){
        throw new apiError(400, "Plant name already exists in you company")
    }

    const newPlant = await Plant.create({
        plantName,
        plantCreator: request.user.id,
        company: request.user.company,
        plantType: plantType,
        plantCountry: plantCountry,
        plantState: plantState,
        plantCity: plantCity,
    });

    await City.findByIdAndUpdate(plantCity, { $inc: { usageCount: 1 } });
    await State.findByIdAndUpdate(plantState, { $inc: { usageCount: 1 } });
    await Country.findByIdAndUpdate(plantCountry, { $inc: { usageCount: 1 } });
    await PlantType.findByIdAndUpdate(plantType, { $inc: { usageCount: 1 } });
    await Company.findByIdAndUpdate(request.user.company, { $inc: { usageCount: 1 } });

    const createdPlant = await Plant.findById(newPlant._id);
    const baseUrl = "https://vms-frontend-pied.vercel.app/visitorform";
    const qrUrl = `${baseUrl}?plantId=${newPlant._id}&companyId=${newPlant.company}`;
    const qrData = JSON.stringify(qrUrl);

    const qrCodeDataUri = await QRCode.toDataURL(qrData);
    
    createdPlant.plantQr = qrCodeDataUri;
    await createdPlant.save({validateBeforeSave: false});

    return response.status(201)
    .json(
        new apiResponse(201, {}, "Plant created successfully")
    )

});

export {createPlant}