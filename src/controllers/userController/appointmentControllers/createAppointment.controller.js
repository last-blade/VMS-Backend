import { sendWhatsAppTemplate } from "../../../services/whatsapp/whatsapp.service.js";
import { uploadOnCloudinary } from "../../../utils/cloudinary.js";
import { apiError, apiResponse, Appointment, asyncHandler, isObjectIdValid } from "../../allImports.js";

const createAppointment = asyncHandler(async (request, response) => {
    const {plant, department, personToVisit, areaToVisit, appointmentDate, appointmentValidTill, purposeOfVisit, visitors} = request.body;

    if([plant, department, personToVisit, areaToVisit].some(input => !isObjectIdValid(input))){
        throw new apiError(400, "One or more Object IDs are invalid");
    }

    if([appointmentDate, appointmentValidTill, purposeOfVisit].some(input => input === undefined || input.trim() === "")){
        throw new apiError(400, "Fill in required fields")
    }

    if (!Array.isArray(visitors) || visitors.length === 0) {
        throw new apiError(400, "At least one visitor is required");
    }

    visitors.forEach((v, index) => {
        if (!v.mobile || !v.fullname) {
            throw new apiError(400, `Visitor ${index + 1}: mobile and fullname are required`);
        }
    });

    const userImageLocalPath = request?.files?.userImage[0]?.path;

    if(userImageLocalPath){
        const userImage = await uploadOnCloudinary(userImageLocalPath);
        visitors = visitors.map(v => ({
            ...v,
            userImage: userImage?.url
        }))
    }

    const createdAppointment = await Appointment.create({
        plant,
        department,
        personToVisit,
        areaToVisit,
        appointmentDate,
        appointmentValidTill,
        purposeOfVisit,
        visitors,
        appointmentCreator: request.user.id,
        company: request.user.company,
    });

    const foundNewlyAppointent = await Appointment.findById(createdAppointment._id)
        .populate("personToVisit", "fullname mobile")
        .populate("areaToVisit", "areaName");
    
        const v0 = foundNewlyAppointent.visitors[0];
        const visitorName = v0?.fullname;
        const visitorMobile = v0?.mobile;
        const visitorsCompany = v0?.company;
    
        const visitArea = foundNewlyAppointent.areaToVisit.areaName;
        const personToVisitInCompany = foundNewlyAppointent.personToVisit.fullname;
    
        const whatsappResponse = await sendWhatsAppTemplate({
            to: foundNewlyAppointent.personToVisit.mobile,
            messages: [
            personToVisitInCompany || "Host",    
            visitorName || "Visitor",
            visitorMobile,
            visitorsCompany,
            visitArea,
            foundNewlyAppointent.purposeOfVisit,
            foundNewlyAppointent.appointmentDate,
            foundNewlyAppointent.appointmentValidTill,
            ],
            templateName: "vms_host_approval_request",
            languageCode: "en",
        });
    console.log("whatsapp response", whatsappResponse);
        const wamid = whatsappResponse?.messages?.[0]?.id;
        if (wamid) {
            await Appointment.findByIdAndUpdate(createdAppointment._id, {
                approvalRequestWamid: wamid,
                approvalRequestSentAt: new Date(),
                appointmentStatus: "Pending",
            });
        }

    return response.status(201)
    .json(
        new apiResponse(201, {}, "Appointment created successfully")
    )

});

export {createAppointment}