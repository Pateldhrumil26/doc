"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfile = exports.getMe = void 0;
const User_js_1 = require("../models/User.js");
const getMe = async (req, res, next) => {
    try {
        const user = req.user;
        if (!user) {
            // Fallback guest profile
            res.status(200).json({
                success: true,
                data: {
                    user: {
                        id: 'local_user',
                        name: 'Local Workspace User',
                        email: 'user@local.workspace',
                        avatar: '',
                        companyName: 'Aesthetic Arc Studio',
                        companyLogo: '',
                        companyAddress: '',
                        companyPhone: '',
                        companyEmail: '',
                        companyWebsite: '',
                        companyGst: '',
                        createdAt: new Date(),
                    },
                },
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    avatar: user.avatar,
                    companyName: user.companyName,
                    companyLogo: user.companyLogo,
                    companyAddress: user.companyAddress,
                    companyPhone: user.companyPhone,
                    companyEmail: user.companyEmail,
                    companyWebsite: user.companyWebsite,
                    companyGst: user.companyGst,
                    createdAt: user.createdAt,
                },
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getMe = getMe;
const updateProfile = async (req, res, next) => {
    try {
        const userId = req.userId || 'local_user';
        const { name, avatar, companyName, companyLogo, companyAddress, companyPhone, companyEmail, companyWebsite, companyGst, } = req.body;
        const user = await User_js_1.User.findByIdAndUpdate(userId, {
            ...(name && { name }),
            ...(avatar !== undefined && { avatar }),
            ...(companyName !== undefined && { companyName }),
            ...(companyLogo !== undefined && { companyLogo }),
            ...(companyAddress !== undefined && { companyAddress }),
            ...(companyPhone !== undefined && { companyPhone }),
            ...(companyEmail !== undefined && { companyEmail }),
            ...(companyWebsite !== undefined && { companyWebsite }),
            ...(companyGst !== undefined && { companyGst }),
        }, { new: true, runValidators: true });
        if (!user) {
            res.status(200).json({
                success: true,
                message: 'Profile updated',
                data: {
                    user: {
                        id: 'local_user',
                        name,
                        avatar,
                        companyName,
                        companyLogo,
                        companyAddress,
                        companyPhone,
                        companyEmail,
                        companyWebsite,
                        companyGst,
                    },
                },
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    avatar: user.avatar,
                    companyName: user.companyName,
                    companyLogo: user.companyLogo,
                    companyAddress: user.companyAddress,
                    companyPhone: user.companyPhone,
                    companyEmail: user.companyEmail,
                    companyWebsite: user.companyWebsite,
                    companyGst: user.companyGst,
                    createdAt: user.createdAt,
                },
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.updateProfile = updateProfile;
