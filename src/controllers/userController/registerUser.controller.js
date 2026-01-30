import { apiError, apiResponse, User, asyncHandler } from "../allImports.js";

const registerUser = asyncHandler(async (req, res) => {
  const {
    fullname,
    email,
    password,
    department,
    mobile,
    company,
    plant,
    address,
    role,
  } = req.body;

  if (!fullname || !password || !department || !mobile || !company || !plant || !role) {
    throw new apiError(400, "All required fields must be provided");
  }

  const conditions = [{ mobile }];

  if (email && email.trim() !== "") {
    conditions.push({ email: email.toLowerCase() });
  }

  const isUserExists = await User.findOne({ $or: conditions });

  if (isUserExists) {
    throw new apiError(409, "User with this mobile or email already exists");
  }

  await User.create({
    fullname,
    email: email || null,
    password,
    department,
    mobile,
    company,
    plant,
    address,
    role,
  });

  return res.status(201).json(
    new apiResponse(201, {}, "User registered successfully")
  );
});

export {registerUser}