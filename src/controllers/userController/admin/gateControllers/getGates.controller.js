import moment from "moment";
import { apiResponse, asyncHandler, Gate } from "../../../allImports.js";

const getGates = asyncHandler(async (request, response) => {
    const gates = await Gate.find({
        company: request.user?.company,
    }).populate("gateInchargeName", "fullname")
    .populate("plant", "plantName")
    .populate("gateSecurity", "fullname")
    .populate("gateCreator", "fullname")

    const allGates = [];

    gates.forEach((gate) => {
        let gateCloseTime = moment(gate.gateCloseTime).format("hh:mm A");
        let gateOpenTime = moment(gate.gateOpenTime).format("hh:mm A");
        allGates.push({
            ...gate.toObject(),
            gateCloseTime,
            gateOpenTime
        });
    })

    return response.status(200)
    .json(
        new apiResponse(200, allGates, "Gates fetched successfully")
    )

});

export {getGates}