// We're using a client component to show a loading state
'use client';

import { LoadingButton } from '@mui/lab';
// import { IconButton, Tooltip } from '@mui/material';
import { Formik } from 'formik';
// import ArrowBackIcon from '@mui/icons-material/ArrowBack';
// import Link from 'next/link';
import { TipTapField } from './TipTapField';
export interface CommentBroadcastForm {
  submitFnc: (value: { content: string }) => Promise<void>;
  title: string;
  description: string;
}
export function CommentBroadcastForm({ submitFnc, title, description }: CommentBroadcastForm) {
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
        initialValues={{ content: '' }}
        onSubmit={async values => {
          submitFnc(values);
        }}
      >
        {({ handleSubmit, isSubmitting }) => (
          <form
            className="flex flex-col items-center justify-start gap-4 p-7"
            onSubmit={handleSubmit}
          >
            {/* <TextField 
                    required
                    name="username" 
                    aria-label="E-mail" 
                    label="E-mail" 
                    placeholder="Enter your email address" 
                    helperText= {"This email address will be use as your identifier to login upon wedding days" }
                    sx={{
                        '& .MuiFormHelperText-root': {
                            width: 250,
                        },
                    }}
                    size="small"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.username}
                    error={touched.username && !!errors.username}
                    />
                    
                <TextField 
                    required
                    type="password"
                    name="password" 
                    aria-label="Password" 
                    label="Password " 
                    placeholder="Enter your password" 
                    helperText={errors.password&&touched.password?errors.password:"Password on the RSVP email" }
                    sx={{
                        '& .MuiFormHelperText-root': {
                            width: 250,
                        },
                    }}
                    size="small"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.password}
                    error={touched.password && !!errors.password}
                /> */}
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
