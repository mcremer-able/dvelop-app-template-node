# Todos and improvements

-   Evaluate [Parcel](https://parceljs.org/cli.html) to bundle the lambda package in order to get small package sizes and
possibly lower cold startup times `parcel build ./src/lambda.ts --target node --bundle-node-modules`