import { Schema, model, models } from 'mongoose';
import { z } from 'zod';

const UserSchema = new Schema({
  id: { type: String, required: true },
  email: { type: String, required: true },
  preferredName: { type: String, required: true },
  surname: { type: String, required: true },
  firstName: { type: String, required: true },
  fullChineseName: { type: String },
  prefix: { type: String },
  phonePrefix: { type: String },
  phoneNumber: { type: String },
  relationship: { type: String }, // describe briefly on relations
  side: { type: String, required: true },
  online: { type: Boolean, required: true },
  ceremony: { type: Boolean, required: true },
  cocktail: { type: Boolean, required: true },
  banquet: { type: Boolean, required: true },
  remarks: { type: String },
  foodAllergies: { type: String },
  foodChoice: { type: String },
  dinnerDeskNumber: { type: Number },
  ceremonySeatNumber: { type: Number },
  password: { type: String, required: true },
  checkedIn: { type: Boolean, required: true }, // only apply to ceremony==true||dinner==true
});

export default models?.User || model('User', UserSchema);

export const ZodUserSchema = z.object({
  id: z.string().trim().min(1),
  email: z.string(),
  preferredName: z.string().trim().min(1),
  surname: z.string().trim().min(1),
  firstName: z.string().trim().min(1),
  fullChineseName: z.string().optional().nullable(),
  prefix: z.string().optional().nullable(),
  phonePrefix: z.enum(['+852', '+1', '+86', '+44', '+61', '']),
  phoneNumber: z.string().optional().nullable(),
  relationship: z.string().optional().nullable(),
  side: z.enum(['GROOM', 'BRIDE', 'BOTH']),
  online: z.boolean(),
  ceremony: z.boolean(),
  cocktail: z.boolean(),
  banquet: z.boolean(),
  remarks: z.string().optional().nullable(),
  foodAllergies: z.string().optional().nullable(),
  foodChoice: z.enum(['beef', 'fish&shrimp', 'vegetarian', '']).nullable().optional(),
  password: z.string().min(8),
  dinnerDeskNumber: z.number().optional().nullable(),
  ceremonySeatNumber: z.number().optional().nullable(),
  checkedIn: z.boolean(), // only apply to ceremony==true||dinner==true
});
export type TZodUserSchema = z.infer<typeof ZodUserSchema>;

export const getDefault = (): Omit<TZodUserSchema, 'id'> => ({
  email: '',
  preferredName: '',
  surname: '',
  firstName: '',
  fullChineseName: '',
  phonePrefix: '',
  phoneNumber: '',
  relationship: '',
  side: 'BOTH',
  online: false,
  ceremony: false,
  cocktail: false,
  banquet: false,
  remarks: '',
  foodAllergies: '',
  foodChoice: '',
  password: '',
  dinnerDeskNumber: 0,
  ceremonySeatNumber: 0,
  checkedIn: false,
});
