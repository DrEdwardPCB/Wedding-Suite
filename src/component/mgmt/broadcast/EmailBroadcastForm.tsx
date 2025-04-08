// We're using a client component to show a loading state
'use client';

import { LoadingButton } from '@mui/lab';
import {
  FormControl,
  FormHelperText,
  //   IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  //   Tooltip,
} from '@mui/material';
import { Formik } from 'formik';
// import ArrowBackIcon from '@mui/icons-material/ArrowBack';
// import Link from 'next/link';
import { TipTapField } from '../../common/TipTapField';
import { IBroadcastTemplateParams } from '@/app/api/broadcast/route';
export interface CommentBroadcastForm {
  submitFnc: (value: IBroadcastTemplateParams) => Promise<void>;
  title: string;
  description: string;
}
export function EmailBroadcastForm({ submitFnc, title, description }: CommentBroadcastForm) {
  return (
    <div className="shadow rounded-xl flex items-center justify-center bg-white  max-h-[450px] w-82 md:w-96 overflow-y-auto flex-col relative">
      <div className="w-full flex items-center mt-7 justify-between gap-4 md:px-2">
        {/* <Link href="/guest" className="">
          <Tooltip title="homepage">
            <IconButton className="">
              <ArrowBackIcon className="text-3xl" />
            </IconButton>
          </Tooltip>
        </Link> */}
        <div className="flex flex-col max-w-40 md:max-w-52">
          <p>{title}</p>
          <p className="text-xs text-slate-400">{description}</p>
        </div>
        <div className="flex-1"></div>
      </div>
      <Formik
        initialValues={{ message: '', title: '', type: 'All' }}
        onSubmit={async (values: IBroadcastTemplateParams) => {
          submitFnc(values);
        }}
      >
        {({ handleSubmit, isSubmitting, errors, touched, handleChange, handleBlur, values }) => (
          <form
            className="flex flex-col items-center justify-start gap-4 p-7"
            onSubmit={handleSubmit}
          >
            <TextField
              required
              name="title"
              aria-label="title"
              label="title "
              placeholder="Enter your title"
              helperText={
                errors.title && touched.title ? errors.title : 'Title on the Broadcast email'
              }
              sx={{
                '& .MuiFormHelperText-root': {
                  width: 250,
                },
              }}
              size="small"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.title}
              error={touched.title && !!errors.title}
            />
            <FormControl
              className="max-w-[278px] w-[278px] md:w-full min-w-[120px] md:max-w-full md:col-span-3 "
              error={touched.type && !!errors.type}
              required
              size="small"
            >
              <InputLabel>To which group</InputLabel>
              <Select
                labelId="SPersonalSide-label"
                id="SPersonaltype"
                name="type"
                value={values.type}
                label="Join Physical or type"
                onChange={e => {
                  handleChange(e);
                }}
              >
                <MenuItem value="Virtual">Virtual</MenuItem>
                <MenuItem value="Physical">Physical</MenuItem>
                <MenuItem value="All">All</MenuItem>
              </Select>
              <FormHelperText>
                {errors.type && touched.type ? errors.type : 'To Virtual ppl Physical ppl or all'}
              </FormHelperText>
            </FormControl>
            <TipTapField name="content" label="Rich Text Content" />
            <div className="flex justify-end items-center gap-2 w-full">
              <LoadingButton
                className="font-bevietnam text-white bg-themeDark shadow-black disabled:bg-slate-400 disabled:opacity-50"
                variant="contained"
                loading={isSubmitting}
                type="submit"
              >
                Submit
              </LoadingButton>
            </div>
          </form>
        )}
      </Formik>
    </div>
  );
}
