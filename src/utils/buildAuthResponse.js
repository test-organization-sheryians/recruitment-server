// utils/buildAuthResponse.js
export function buildAuthResponse(user, token, refreshToken) {
            return {
                        success: true,
                        data: {
                                    user: {
                                                _id: user._id,
                                                email: user.email,
                                                firstName: user.firstName || null,
                                                lastName: user.lastName || null,
                                                phoneNumber: user.phoneNumber || null,
                                                role: user.roleId || null
                                    },
                                    token,
                                    refreshToken
                        }
            };
}
