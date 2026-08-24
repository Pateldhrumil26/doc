"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProfile = exports.updateProfile = exports.createProfile = exports.getProfiles = void 0;
const LetterheadProfile_js_1 = require("../models/LetterheadProfile.js");
// Seed default profile if collection is empty
const ensureDefaultProfile = async () => {
    const count = await LetterheadProfile_js_1.LetterheadProfile.countDocuments();
    if (count === 0) {
        await LetterheadProfile_js_1.LetterheadProfile.create([
            {
                name: 'Aesthetic Arc (Primary)',
                companyName: 'Aesthetic Arc Studio',
                logo: '',
                phone: '+91 9825 0201 73',
                email: 'connect@aestheticarc.com',
                website: 'aestheticarc.com',
                address: '504, Venus Atlantis Corporate Park, 100ft Road, Prahlad Nagar, Satellite, Ahmedabad - 380015, India',
                isDefault: true,
            },
            {
                name: 'Apex Investment Corp',
                companyName: 'Apex Investment Corp',
                logo: '',
                phone: '+91 9904 1122 33',
                email: 'info@apexinvest.com',
                website: 'apexinvest.com',
                address: '802, Synergy Tower, Corporate Road, Prahlad Nagar, Ahmedabad - 380015, India',
                isDefault: false,
            },
        ]);
    }
};
const getProfiles = async (req, res, next) => {
    try {
        await ensureDefaultProfile();
        const profiles = await LetterheadProfile_js_1.LetterheadProfile.find().sort({ createdAt: 1 });
        res.status(200).json({
            success: true,
            data: { profiles },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getProfiles = getProfiles;
const createProfile = async (req, res, next) => {
    try {
        const { name, companyName, logo, phone, email, website, address, isDefault } = req.body;
        if (isDefault) {
            await LetterheadProfile_js_1.LetterheadProfile.updateMany({}, { isDefault: false });
        }
        const profile = await LetterheadProfile_js_1.LetterheadProfile.create({
            name: name || companyName || 'New Letterhead Preset',
            companyName: companyName || name || 'Company Name',
            logo: logo || '',
            phone: phone || '',
            email: email || '',
            website: website || '',
            address: address || '',
            isDefault: Boolean(isDefault),
        });
        res.status(201).json({
            success: true,
            message: 'Letterhead profile created successfully',
            data: { profile },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.createProfile = createProfile;
const updateProfile = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, companyName, logo, phone, email, website, address, isDefault } = req.body;
        if (isDefault) {
            await LetterheadProfile_js_1.LetterheadProfile.updateMany({ _id: { $ne: id } }, { isDefault: false });
        }
        const profile = await LetterheadProfile_js_1.LetterheadProfile.findByIdAndUpdate(id, {
            name,
            companyName,
            logo,
            phone,
            email,
            website,
            address,
            isDefault,
        }, { new: true, runValidators: true });
        if (!profile) {
            return res.status(404).json({
                success: false,
                message: 'Letterhead profile not found',
            });
        }
        res.status(200).json({
            success: true,
            message: 'Letterhead profile updated successfully',
            data: { profile },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.updateProfile = updateProfile;
const deleteProfile = async (req, res, next) => {
    try {
        const { id } = req.params;
        const count = await LetterheadProfile_js_1.LetterheadProfile.countDocuments();
        if (count <= 1) {
            return res.status(400).json({
                success: false,
                message: 'Cannot delete the only remaining profile.',
            });
        }
        const profile = await LetterheadProfile_js_1.LetterheadProfile.findByIdAndDelete(id);
        if (!profile) {
            return res.status(404).json({
                success: false,
                message: 'Letterhead profile not found',
            });
        }
        res.status(200).json({
            success: true,
            message: 'Letterhead profile deleted successfully',
        });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteProfile = deleteProfile;
