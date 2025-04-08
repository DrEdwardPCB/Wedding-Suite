'use client';

import { commitUpdate } from '@/lib/mongo/actions/UserActions';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { LoadingButton } from '@mui/lab';

import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  FormLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Tooltip,
} from '@mui/material';
import { Field, Formik } from 'formik';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { TZodUserSchema, ZodUserSchema } from '../../../lib/mongo/schema/UserSchema';
import { withZodSchema } from 'formik-validator-zod';
import { EditLockDialog } from './EditLockDialog';
import { encryptData } from '@/lib/encryption';
import { showToast } from '@/lib/toastify/showToast';

export const EditInfo = ({ info }: { info: TZodUserSchema }) => {
  const [edit, setEdit] = useState(false);
  const router = useRouter();
  return (
    <div className="shadow rounded-xl flex items-center justify-center bg-white  max-h-[400px] md:max-h-[450px] w-80 md:w-2/3  flex-col">
      <div className="overflow-y-auto w-full">
        <div className="w-full flex items-center mt-7 justify-between gap-4 px-2">
          <Tooltip title="Back">
            <IconButton className="" onClick={() => router.back()}>
              <ArrowBackIcon className="text-3xl" />
            </IconButton>
          </Tooltip>
          <div className="flex flex-col max-w-40 md:max-w-full">
            <p>Update information</p>
            <p className="text-xs text-slate-400">
              You may update information below until 1st June, any update after 1st June, please
              message Edward/Kiki
            </p>
          </div>
          <div className="flex-1">
            <EditLockDialog edit={edit} setEdit={setEdit} password={info.password}></EditLockDialog>
          </div>
        </div>
        <Formik
          initialValues={structuredClone(info)}
          validate={withZodSchema(ZodUserSchema)}
          onSubmit={async values => {
            try {
              if (values.password?.length ?? 0 > 0) {
                const encryptedPassword = encryptData(values.password);
                if (encryptedPassword !== info.password) {
                  values.password = encryptedPassword;
                }
              }
              values.id = info.id;
              values.email = info.email;
              await commitUpdate(values);
              showToast('success', 'successfully updated profile');
            } catch (e) {
              console.error(e);
              showToast('error', 'An error has occurred please contact Edward');
            }
          }}
        >
          {({ values, errors, touched, resetForm, handleChange, handleBlur, handleSubmit }) => (
            <form
              className="flex flex-col items-center justify-start gap-4 p-7 md:grid md:grid-cols-6"
              onSubmit={handleSubmit}
            >
              <FormControl
                className="max-w-[278px] min-w-[120px] w-[278px] md:w-full md:max-w-full md:col-span-2"
                error={touched.prefix && !!errors.prefix}
                required
                size="small"
                disabled={!edit}
              >
                <InputLabel id="SPersonalPrefix-label">Prefix</InputLabel>
                <Select
                  labelId="SPersonalPrefix-label"
                  id="SPersonalPrefix"
                  name="prefix"
                  value={values.prefix}
                  label="Prefix"
                  onChange={handleChange}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value={'Mr.'}>Mr.</MenuItem>
                  <MenuItem value={'Miss.'}>Miss.</MenuItem>
                  <MenuItem value={'Mrs.'}>Mrs.</MenuItem>
                </Select>
                <FormHelperText>
                  {errors.prefix && touched.prefix ? errors.prefix : 'Your prefix'}
                </FormHelperText>
              </FormControl>

              <TextField
                className="md:col-span-2"
                required
                disabled={!edit}
                name="firstName"
                aria-label="First Name"
                label="First Name"
                placeholder="Enter your First Name"
                helperText={
                  errors.firstName && touched.firstName
                    ? errors.firstName
                    : 'Your first name (E.g. Tai Ming)'
                }
                size="small"
                sx={{
                  '& .MuiFormHelperText-root': {
                    width: 250,
                  },
                }}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.firstName}
                error={touched.firstName && !!errors.firstName}
              />
              <TextField
                className="md:col-span-2"
                required
                disabled={!edit}
                name="surname"
                aria-label="Surname"
                label="Surname"
                placeholder="Enter your Surname"
                helperText={
                  errors.surname && touched.surname ? errors.surname : 'Your surname (E.g. Chan)'
                }
                size="small"
                sx={{
                  '& .MuiFormHelperText-root': {
                    width: 250,
                  },
                }}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.surname}
                error={touched.surname && !!errors.surname}
              />
              <TextField
                className="md:col-span-3 md:self-start"
                required
                disabled={!edit}
                name="preferredName"
                aria-label="Preferred Name"
                label="Preferred Name"
                placeholder="Enter your Preferred Name"
                helperText={
                  errors.preferredName && touched.preferredName
                    ? errors.preferredName
                    : 'Your preferred name or nickname (E.g. Thomas)'
                }
                size="small"
                // sx={{
                //     '& .MuiFormHelperText-root': {
                //         width: 250,
                //     },
                // }}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.preferredName}
                error={touched.preferredName && !!errors.preferredName}
              />

              <TextField
                className="md:col-span-3 md:self-start"
                name="fullChineseName"
                disabled={!edit}
                aria-label="Full Chinese Name"
                label="Full Chinese Name"
                placeholder="Enter your Full Chinese Name"
                helperText={
                  errors.fullChineseName && touched.fullChineseName
                    ? errors.fullChineseName
                    : 'Your full chinese name (E.g. 陳大明)'
                }
                size="small"
                sx={{
                  '& .MuiFormHelperText-root': {
                    width: 250,
                  },
                }}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.fullChineseName}
                error={touched.fullChineseName && !!errors.fullChineseName}
              />
              <TextField
                className="md:col-span-3 md:self-start"
                name="password"
                disabled={!edit}
                aria-label="Updated Password"
                label="Updated Password"
                placeholder="Enter your Updated Password"
                type="password"
                helperText={
                  errors.password && touched.password
                    ? errors.password
                    : 'ONLY Change if you want to update password'
                }
                size="small"
                sx={{
                  '& .MuiFormHelperText-root': {
                    width: 250,
                  },
                }}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.password}
                error={touched.password && !!errors.password}
              />
              <FormControl
                className="max-w-[278px] w-[278px] md:w-full min-w-[120px] md:max-w-full md:col-span-3 "
                error={touched.phonePrefix && !!errors.phonePrefix}
                required
                disabled={!edit}
                size="small"
              >
                <InputLabel id="SPersonalPhonePrefix-label">Phone Prefix</InputLabel>
                <Select
                  labelId="SPersonalPhonePrefix-label"
                  id="SPersonalPhonePrefix"
                  value={values.phonePrefix}
                  name="phonePrefix"
                  label="Phone Prefix"
                  onChange={handleChange}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value={'+852'}>Hong Kong (+852)</MenuItem>
                  <MenuItem value={'+1'}>Canada/US (+1)</MenuItem>
                  <MenuItem value={'+86'}>China (+86)</MenuItem>
                  <MenuItem value={'+44'}>United Kingdom (+44)</MenuItem>
                  <MenuItem value={'+61'}>Austrialia (+61)</MenuItem>
                </Select>
                <FormHelperText>
                  {errors.phonePrefix && touched.phonePrefix
                    ? errors.phonePrefix
                    : 'Area code of your phone'}
                </FormHelperText>
              </FormControl>
              <TextField
                className="md:col-span-3"
                disabled={!edit}
                name="phoneNumber"
                aria-label="Phone #"
                label="Phone #"
                placeholder="Enter your Phone #"
                helperText={
                  errors.phoneNumber && touched.phoneNumber ? errors.phoneNumber : 'Your phone #'
                }
                size="small"
                sx={{
                  '& .MuiFormHelperText-root': {
                    width: 250,
                  },
                }}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.phoneNumber}
                error={touched.phoneNumber && !!errors.phoneNumber}
              />

              <FormControl
                className="max-w-[278px] w-[278px] md:w-full min-w-[120px] md:max-w-full md:col-span-3 md:self-start"
                disabled={!edit}
                error={touched.side && !!errors.side}
                required
                size="small"
              >
                <InputLabel id="SPersonalSide-label">Side</InputLabel>
                <Select
                  labelId="SPersonalSide-label"
                  id="SPersonalSide"
                  name="side"
                  value={values.side}
                  label="Prefix"
                  onChange={handleChange}
                >
                  <MenuItem value={'BOTH'}>BOTH</MenuItem>
                  <MenuItem value={'GROOM'}>GROOM (Male)</MenuItem>
                  <MenuItem value={'BRIDE'}>BRIDE (Female)</MenuItem>
                </Select>
                <FormHelperText>
                  {errors.side && touched.side
                    ? errors.side
                    : 'Which side of the family do you belong to'}
                </FormHelperText>
              </FormControl>
              <TextField
                className="md:col-span-3 md:self-start w-[278px] md:w-full"
                disabled={!edit}
                name="relationship"
                aria-label="Relationship"
                label="Relationship"
                placeholder="Friends from University"
                helperText={
                  errors.relationship && touched.relationship
                    ? errors.relationship
                    : 'Your relationship with Edward and/ or Kiki (E.g. Classmate, Colleagues, Aunt)'
                }
                size="small"
                // sx={{
                //     '& .MuiFormHelperText-root': {
                //         width: 250,
                //     },
                // }}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.relationship}
                error={touched.relationship && !!errors.relationship}
              />
              <FormControl
                className="max-w-[278px] w-[278px] md:w-full min-w-[120px] md:max-w-full md:col-span-3 "
                error={touched.online && !!errors.online}
                disabled={!edit}
                required
                size="small"
              >
                <InputLabel>Join Physical or online</InputLabel>
                <Select
                  labelId="SPersonalSide-label"
                  id="SPersonalOnline"
                  name="online"
                  value={values.online}
                  label="Join Physical or online"
                  onChange={e => {
                    console.log(e);
                    handleChange(e);
                  }}
                >
                  <MenuItem value={true}>Virtual</MenuItem>
                  <MenuItem value={false}>Physical</MenuItem>
                </Select>
                <FormHelperText>
                  {errors.online && touched.online
                    ? errors.online
                    : 'Are you joining Physically or Virtually'}
                </FormHelperText>
              </FormControl>
              <FormControl
                disabled={!edit}
                error={touched.banquet && !!errors.banquet}
                component="fieldset"
                variant="standard"
              >
                <FormLabel component="legend">Event session selection</FormLabel>
                <FormGroup>
                  <FormControlLabel
                    label="Ceremony (16:00-16:30 EST)"
                    name="ceremony"
                    onChange={handleChange}
                    control={
                      <Checkbox
                        checked={values.ceremony}
                        inputProps={{ 'aria-label': 'controlled' }}
                      />
                    }
                  />
                  <FormControlLabel
                    label="Cocktail (16:30-18:00 EST)"
                    name="cocktail"
                    onChange={handleChange}
                    control={
                      <Checkbox
                        checked={values.cocktail}
                        inputProps={{ 'aria-label': 'controlled' }}
                      />
                    }
                  />
                  <FormControlLabel
                    label="Banquet (18:00 onward EST)"
                    name="banquet"
                    onChange={handleChange}
                    control={
                      <Checkbox
                        checked={values.banquet}
                        inputProps={{ 'aria-label': 'controlled' }}
                      />
                    }
                  />
                </FormGroup>
                <FormHelperText>
                  {errors.banquet && touched.banquet
                    ? errors.banquet
                    : 'Select the event session you are able to join'}
                </FormHelperText>
              </FormControl>
              <FormControl
                className="max-w-[278px] min-w-[120px] w-full"
                disabled={!edit}
                error={touched.foodChoice && !!errors.foodChoice}
                size="small"
              >
                <InputLabel id="SBanquetFoodChoice-label">Main Course Selection</InputLabel>
                <Select
                  labelId="SBanquetFoodChoice-label"
                  id="SBanquetFoodChoice"
                  name="foodChoice"
                  value={values.foodChoice}
                  label="Main Course Selection"
                  onChange={handleChange}
                >
                  <MenuItem value="">
                    <em>No Preference</em>
                  </MenuItem>
                  <MenuItem value={'beef'}>
                    Short Rib (Slow-Braised Beef Short Rib in a Red Wine Sauce)
                  </MenuItem>
                  <MenuItem value={'fish&shrimp'}>
                    Surf & Turf (Panko Crusted Cod Loin With Grilled Shrimp and Lobster Sauce)
                  </MenuItem>
                  <MenuItem value={'vegetarian'}>
                    Parmigiana (Breaded Eggplant Layered With Tomato Sauce And Mozzarella Nestled On
                    Soft Polenta)
                  </MenuItem>
                </Select>
                <FormHelperText>
                  {errors.foodChoice && touched.foodChoice
                    ? errors.foodChoice
                    : 'Please select a main course'}
                </FormHelperText>
              </FormControl>
              <TextField
                size="small"
                disabled={!edit}
                name="foodAllergies"
                aria-label="Food Allergies"
                label="Food Allergies "
                placeholder="Shrimp..."
                helperText={
                  errors.foodAllergies && touched.foodAllergies
                    ? errors.foodAllergies
                    : 'Enter any food allergies'
                }
                onPaste={e => e.preventDefault()}
                sx={{
                  '& .MuiFormHelperText-root': {
                    width: 250,
                  },
                }}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.foodAllergies}
                error={touched.foodAllergies && !!errors.foodAllergies}
              />
              <TextField
                size="small"
                disabled={!edit}
                name="remarks"
                aria-label="Remarks"
                label="Remarks"
                placeholder="Enter your remarks "
                helperText={
                  errors.remarks && touched.remarks ? errors.remarks : 'Any remarks for the day'
                }
                onCopy={e => e.preventDefault()}
                onCut={e => e.preventDefault()}
                sx={{
                  '& .MuiFormHelperText-root': {
                    width: 250,
                  },
                }}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.remarks}
                error={touched.remarks && !!errors.remarks}
              />
              <div className="flex justify-center items-center gap-2 w-full md:col-span-6">
                <LoadingButton
                  className="font-bevietnam text-white bg-themeDark shadow-black disabled:bg-slate-400 disabled:opacity-50 px-2 text-sm md:text-base md:px-4"
                  type="submit"
                  onClick={() => {
                    setTimeout(() => {
                      resetForm();
                      router.back();
                    }, 1000);
                  }}
                  variant="contained"
                >
                  Cancel
                </LoadingButton>
                <LoadingButton
                  className="font-bevietnam text-white bg-themeDark shadow-black disabled:bg-slate-400 disabled:opacity-50 px-1 text-sm md:text-base md:px-4"
                  type="submit"
                  onClick={() => {
                    setTimeout(() => {
                      //send({type:"EGotoPhysical"})
                    }, 1000);
                  }}
                  variant="contained"
                >
                  Update
                </LoadingButton>
              </div>
            </form>
          )}
        </Formik>
      </div>
    </div>
  );
};
