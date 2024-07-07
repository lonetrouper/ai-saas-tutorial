import {
  authMiddleware,
  clerkMiddleware,
  createRouteMatcher,
} from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher(["/"]);
const isProtectedRoute = createRouteMatcher(["/dashboard(.*)", "/forum(.*)"]);

// export default clerkMiddleware(
//   (auth, request) => {
//     // if (!isPublicRoute(request)) auth().protect();
//     auth().protect();
//     // if(!isPublicRoute(request)) {
//     //   auth().protect();
//     // }
//     // auth().protect();
//   },
//   { debug: true }
// );

export default authMiddleware({
  publicRoutes: ["/"]
})

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
