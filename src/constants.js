export const DB_NAME = "VMS-SRPK"
export const accessTokenOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 *1000,
}
export const refreshTokenOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 28 * 24 * 60 * 60 *1000,
}