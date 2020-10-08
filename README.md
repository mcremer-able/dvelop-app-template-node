# d.velop app template for Node.js

This template contains everything you need to write an app for d.velop cloud.

To demonstrate all the aspects of app development a hypothetical but not trivial use case
of *an employee applying for vacation* is implemented.

| WARNING: This template is at a very early stage and I am by no means a node.js pro. Help is appreciated.|
| --- |

## Getting Started

Just clone this repo and follow the [build instructions](#build) to get the sample app up and running.
After this adjust the code to fit the purpose of your own business problem/app.

### Prerequisites

A linux docker container is used for the build and deployment process of the app.
So besides docker (use a recent version) the only thing you need on your local development system is a git client
and an editor or IDE for Node.js .
 
Usually the IDE requires an locally installed [Node.js](https://nodejs.org/en/). Please use at least version 12.14.

### Build

Execute the build with

```
docker-build build
```

This will build a deployment package for aws lambda `dist/lambda` which 
should be used for the production deployment of your app in d.velop cloud.

## Run and test your app locally

Just execute `set DEBUG=* & npm start` to run and test your app on a local dev environment.
Please keep in mind, that some functions like authentication
which require the presence of additional apps (e.g. IdentityProviderApp), 
won't work because these apps are not available on your local system.

## Rename the app

You should change the name of the app so that it reflects the business problem you would like
to solve.

Each appname in d.velop cloud must be unique. To facilitate this every provider/company chooses
a unique provider prefix which serves as a namespace for the apps of this provider.
The prefix can be selected during the registration process in d.velop cloud.
If you choose a provider prefix which corresponds to your company name or an abbreviation of the company name
it's very likely that it is available when you later register your app in d.velop cloud.

For example if your company is named *Super Duper Software Limited* and the domain of your app 
is *employees applying for vacation* your app should be named
something like `superduperltd-vacationprocess`App. Note that the `App` suffix isn't used in the configuration files. 

Apps belonging to the core d.velop cloud platform don't have a provider prefix. 

Use the `rename` target to rename your app:

```
docker-build rename NAME=NEW_APP_NAME
```

Furthermore you might want to adjust the following values manually:

1.  Change the `DOMAIN_SUFFIX` to a domain you own like `yourcompany.com`

**Please finish step 1 before you [deploy](#deployment) your app because the names of a lot of
AWS resources are derived from the `APP_NAME` and `DOMAIN_SUFFIX`. Changing them afterwards requires a
redeployment of the AWS resources which takes some time**

## Deployment

**Please read [Rename the app](#rename-the-app) before you proceed with the deployment.**

You need an AWS Account to deploy your app. At the time of writing some of the AWS services are
free to use for a limited amount of time and workload. 
Check the [Free Tier](https://aws.amazon.com/free/) offering from AWS for the current conditions. 

Manually create an IAM user with
the appropriate rights to create the AWS resources defined by your terraform configuration. 
You could start with a user who has the `arn:aws:iam::aws:policy/AdministratorAccess` policy to start quickly, 
but you **should definitely restrict the rights of that IAM user to a minimum as soon as you go into production**.

Configure the AWS credentials of the created IAM user by using one of the methods described in
[Configuring the AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html).
For example set the `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` environment variables.

**Windows**

```
SET AWS_ACCESS_KEY_ID=<YOUR-ACCESS-KEY-ID>
SET AWS_SECRET_ACCESS_KEY=<YOUR-SECRET-ACCESS-KEY>
```

**Linux**

```
export AWS_ACCESS_KEY_ID=<YOUR-ACCESS-KEY-ID>
export AWS_SECRET_ACCESS_KEY=<YOUR-SECRET-ACCESS-KEY>
```

Deploy the lambda function and all other AWS resources like AWS API Gateway.

```
docker-build deploy
```

The build container uses [Terraform](https://www.terraform.io/) to manage the AWS resources and to deploy
your lambda function. This tool implements a desired state mechanism which means the first execution will take some time
to provision all the required AWS resources. Consecutive executions will only deploy the difference between the desired state
(e.g. the new version of your lambda function) and the state which is already deployed (other AWS resources which won't change
between deployments) and will be much quicker.

### Test your endpoint

The endpoint URLs are logged at the end of the deployment. Just invoke them in a browser to test your app.  
 
```
Apply complete! Resources: 0 added, 0 changed, 0 destroyed.

Outputs:

endpoint = [
    https://xxxxxxxxxx.execute-api.eu-central-1.amazonaws.com/prod/vacationprocess/,
    https://xxxxxxxxxx.execute-api.eu-central-1.amazonaws.com/dev/vacationprocess/
]

```

To watch the current deployment state you can invoke

```
docker-build show 
```

at any time without changing your deployment.

### Deployment of a new app version

Just follow the [deployment](#deployment) steps. A new deployment package for the lambda function will be build automatically.

### Additional AWS resources

The terraform deployment configuration contains 2 additonal modules which are disabled by default.
Just uncomment the corresponding lines in `/terraform/main.tf` to use them but **ensure that the DNS resolution
for your hosted zone works before you use these modules**. Read the comments in the terraform file.

#### asset_cdn
This module uses *aws cloudfront* as a CDN for your static assets. Furthermore it allows you to define
a custom domain for your assets instead of the s3 URL. Your deployment should work perfectly without this module.

#### api_custom_domain 
This module allows you to define a custom domain for your app endpoints. A custom domain name is required
as soon as you register your app in the d.velop cloud center because the base path of your app must
begin with the name of your app. So instead of the default endpoints

```
    https://xxxxxxxxxx.execute-api.eu-central-1.amazonaws.com/prod/vacationprocess/
    https://xxxxxxxxxx.execute-api.eu-central-1.amazonaws.com/dev/vacationprocess/
```
which base paths begin with `/prod` or `/dev` you need endpoints like

```
    https://vacationprocess.xyzdomain./vactionprocess
    https://dev.vacationprocess.xyzdomain./vactionprocess
```
which are provided by this module.

## Build mechanism
A linux docker container is used to build and deploy the software. This has the advantage, that the build
doesn't rely on specific tools or tool versions that need to be installed on the local development machine or
build server.

During the build the whole application directory is mounted in the docker container. The build targets are
implemented in the `Makefile`.

Two wrappers (`docker-build.bat` and `docker-build.sh`) are provided so you don't have to remember the
rather long docker command.
Furthermore these wrappers provide a little utility function to passthrough all environment variables listed
in the `environment` file from the docker host (that is your development machine or buildserver)
to the build container.

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

## License

Please read [LICENSE](LICENSE) for licensing information.

## Improvements/Todos

Please read [TODOS.md](TODOS.md) for a list of possible improvements and todos

## Acknowledgments

Thanks to the following projects for inspiration

* [Starting an Open Source Project](https://opensource.guide/starting-a-project/)
* [README template](https://gist.github.com/PurpleBooth/109311bb0361f32d87a2)
* [CONTRIBUTING template](https://github.com/nayafia/contributing-template/blob/master/CONTRIBUTING-template.md)

