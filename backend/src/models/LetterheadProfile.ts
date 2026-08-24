import mongoose, { Document as MongoDoc, Schema } from 'mongoose';

export interface ILetterheadProfile extends MongoDoc {
  name: string;
  companyName: string;
  logo: string;
  phone: string;
  email: string;
  website: string;
  address: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const letterheadProfileSchema = new Schema<ILetterheadProfile>(
  {
    name: {
      type: String,
      required: [true, 'Profile name is required'],
      trim: true,
      default: 'Aesthetic Arc (Primary)',
    },
    companyName: {
      type: String,
      trim: true,
      default: 'Aesthetic Arc Studio',
    },
    logo: {
      type: String,
      default: '',
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    email: {
      type: String,
      trim: true,
      default: '',
    },
    website: {
      type: String,
      trim: true,
      default: '',
    },
    address: {
      type: String,
      trim: true,
      default: '',
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const LetterheadProfile = mongoose.model<ILetterheadProfile>(
  'LetterheadProfile',
  letterheadProfileSchema
);
