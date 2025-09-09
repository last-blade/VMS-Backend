import mongoose from "mongoose"

const isObjectIdValid = (objectId) => {
    return mongoose.Types.ObjectId.isValid(objectId);
}

export {isObjectIdValid}