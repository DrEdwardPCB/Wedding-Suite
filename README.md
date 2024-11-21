# introduction

this repo demonstrate how to use RTK in nextjs 14+ app router in a SPA mannar yet can harness the power of SSR
## motivation
there is no official documentation on how to use redux in next framework app router in a normal SPA faction. Although there are some guideline on how to use it in a SPA like format on the guide https://redux-toolkit.js.org/usage/nextjs, this guide does not covers the example

# structure
## page structure
- http://localhost:3000 -> next home page
- http://localhost:3000/first -> first page with client component 1
- http://localhost:3000/second -> first page with client component 2
- http://localhost:3000/third -> second page with client component 1

except for the home page, all are having a counter builtin on one of the client component which is a counter

## folder structure
- component: store all client side component that will interact with redux store
- app: store storeProvider and the pages
- lib: store all non react libs code including but not limited to redux

# design
## lib used
- RTK: to handle redux state
- Redux-persist: to sync state across multiple providers

# testing
1. goto http://localhost:3000/first, change state -> goto the other page

2. repeat

## rationale
page.tsx by default is server side rendering but redux only works on client side, there is no global provider for next like in SPA (`app.tsx` or`_app.tsx` or `index.tsx`)style to configure all provider. There are multiple entry point by page. Thus setting Provider inside `page.tsx`. putting multiple provider in individual page would essentially work, but across page, state won't sync since react context (used by `react-redux`) would only update its descendent. This is where redux-persist comes into play. It introduce rehydrate process, which triggers update when serverside page is sent to client and initiate client-side rendering and save all the state change in a browser store in client. This could help synchronize state across multiple provider


# limitation
- Redux Thunk state is not serializable, with the power of SSR, for global state that require synchronize from webrequest, try to do so by using Fetch in react async component and pass to redux store.
    - if state are local to a page route, use useEffect or useState
    - if state are local to a route tree, ensure id is passable alone route and do a prefetch the backend using react async component to try to render the page 
    - if request requires any client side credential, you need to use useEffect to inject the token into the request from clientSide component

<details>
<summary>next doc</summary>
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
</details>