# Starter Kits

The simplest way to get up and running is to use one of our GraphQL ready [starter kits on GitHub](https://github.com/scaphold-io).

## React & Apollo

[Download for React/Apollo](https://github.com/scaphold-io/react-apollo-starter-kit)

### Quickstart

1) Go to [Scaphold.io](https://scaphold.io).

2) Create an account and dataset.

3) Change the URL in the API manager (`config.js`) in the boilerplate to point to your unique Scaphold.io API URL.

5) Install dependencies: `npm install`

4) Run with: `npm start`

### Deployment

Note: For development, you only need to run npm start

1) Run npm run build to transpile ES6 code from the `src/` directory to JavaScript in the `lib/` directory.

2) Set the environment variable `process.env.NODE_ENV = 'production'` to let `server.js` know to run the code in the `lib/` directory.

## React & Relay

> Snippet from our React-Relay boilerplate (JavaScript only)

```javascript
// js/routes/HomeRoute.js

query {
  viewer {
    ${Component.getFragment('allHackerNewsItems', {orderBy: variables.orderBy})}
  }
}

. . .

// js/components/HackerNewsClone/Home.js

fragment on Viewer {
  allHackerNewsItems (first: 10, orderBy: $orderBy) {
    edges {
      cursor
      node {
        id,
        createdAt,
        modifiedAt,
        title,
        score,
        url,
        author {
          id,
          username
        }
      }
    }
  }
}
```

[Download for React/Relay](https://github.com/scaphold-io/react-relay-starter-kit)

Run this code by running `npm start` in the base directory of the application. Once the application has built, go to <code>localhost:3001</code> in your browser to access your new website.

Congratulations! you've successfully launched your first website with Scaphold. How is this all working? When the website runs, the starter kit points to a Scaphold endpoint that we've created with some basic data. Your website leverages the GraphQL server that we've already set up for you, so you can start creating users and logging in. After you've successfully logged in, you'll be able to see a HackerNews clone with several articles listed. Getting this list of items is another request that is being made via a GraphQL query.

To demonstrate, upon logging in, here is the query that is being made to fetch the HackerNews data:

<pre class="left">

</pre>

These two pieces of code go together to form one query that grabs the first 10 HackerNewsItems from the app's dataset with the corresponding return fields like title, score, url, and author. To see what other queries you can make, feel free to navigate to the GraphiQL page from the header of the website and open up the document explorer on the top right. From here, you'll find a reference for query and mutation templates that are allowed for this particular app, and a sandbox to execute these particular requests.

If you would like to have a more involved or custom dataset to play around with, the beauty of Scaphold is that you can create your own in a matter of minutes! Jump right into the [tutorial](https://scaphold.io/docs#Tutorial) to start building your first app.

This starter kit is yours to keep, and if you have any questions, don't hesitate to reach out to us through our chat support or email us at support@scaphold.io.

But wait, there's more! Here's the list of boilerplates that we provide that works right out of the box with Scaphold:

* [React & Relay](https://github.com/scaphold-io/react-relay-starter-kit)
* [React Native & Relay](https://github.com/scaphold-io/react-native-starter-kit)
* More to come... On the docket: iOS & Android

## Angular2 & Apollo Client

[Download angular2-apollo-client-webpack-starter](https://github.com/scaphold-io/angular2-apollo-client-webpack-starter)

[Live Demo](https://scaphold-io.github.io/)

A GraphQL-ready starter kit for [Angular2](https://angular.io/) using [Apollo Client](https://github.com/apollostack/apollo-client) and Webpack. This starter kit is built to seamlessly
integrate with the [scaphold.io](https://scaphold.io)'s powerful GraphQL-as-a-Service platform.

Out of the box, the application handles authentication and exhibits pagination using GraphQL connections. The
template also comes packed with a few other goodies.

### Table of contents

* [Quick start](#quick-start)
* [What's included](#whats-included)
* [Project structure](#project-structure)
* [Documentation](#documentation)
  * [Apollo Client](#apollo-client)
  * [Scaphold](#scaphold)
* [Developing](#developing)
  * [Installing](#installing)
  * [Running the app](#running-the-app)
  * [Building](#building)
  * [Generating Documentation](#generating-documentation)
  * [Testing](#testing)

```bash
# clone our repo
# Take the master repo if you want to plug your own styling framework
$ git clone https://github.com/scaphold-io/angular2-apollo-client-webpack-starter.git my-app

# The AngularMaterial branch comes preloaded with the popular angular2-material library
$ git clone -b AngularMaterial https://github.com/scaphold-io/angular2-apollo-client-webpack-starter.git my-app

# update /my-app/src/config.ts with your scaphold api url
$ cd my-app
$ vi src/config.ts

# install the dependencies with npm
$ npm install
# Your scaphold url will look something like https://api.scaphold.io/graphql/my-awesome-app-alias

# start the server
$ npm start
```

### Quick start

- Go to [scaphold.io](https://scaphold.io) and create an account.
- Create an application and get your GraphQL API's url from the dropdown in the nav bar.
	- A Scaphold app comes with a customizeable GraphQL API that you can immediately use to start building your Angular2 application.
  - Each API contains a default `User` type that handles authentication necessities like password encryption out of the box. This template is built to seamlessly work with a fresh [scaphold.io](https://scaphold.io) app.
- Setup this starter kit

Your application is now hooked up to a production GraphQL API and is ready for you
to build an awesome app.

Go to [http://localhost:8080](http://localhost:8080) to start using your API.

### What's included?

* Apollo Client - A powerful, easy to use GraphQL client.
* Webpack - A popular, well designed module bundler for JavaScript projects.
* ES6, and ES7 support with babel.
* Source maps for debugging.
* Development server with live reload via webpack-dev-server.
* Production builds with cache busting.
* Unit testing via karma and jasmine.
* Integration testing via protractor.
* Code coverage when tests are run.

### Project Structure

<pre class="left">
angular2-apollo-webpack-starter/
├── src/                # Project Root
│   ├── app/            # Angular2 Application
│   │   ├── about/      # about, home, login, register all contain Angular components
│   │   ├── home/
│   │   ├── login/
│   │   ├── register/
│   │   ├── shared/              # shared contains Angular services. e.g. auth.service.ts
│   │   ├── app.component.html   # Each component has a X.component.html template file
│   │   ├── app.component.scss   # Component specific sass styling
│   │   ├── app.component.ts     # The component controller
│   │   ├── app.component.e2e-spec.js   # Protractor integration tests
│   │   ├── app.component.spec.ts       # Karma unit tests
│   │   ├── app.routes.ts        # Angular application router
│   │   └── client.ts/           # Apollo client initialization
│   ├── public/          # Public static assets
│   │   ├── img/
│   │   └── index.html
│   ├── style/           # Application wide sass styling
│   │   └── app.scss
│   ├── config.ts        # Contains your API's url.
│   ├── main.ts          # Application entry point
│   ├── polyfills.ts
│   └── vendor.ts        # Update application dependencies here
├── typings/             # Contains TypeScript definitions
│   ├── globals/
│   ├── modules/
│   └── index.d.ts
├── package.json
├── karma-shim.js
├── karma-conf.js
├── protractor.conf.js
├── tsconfig.json
├── tslint.json
├── typedoc.json
├── typings.json
├── webpack.config.js
├── LICENSE
└── README.md
```
</pre>

### Documentation

```typescript
@Apollo({
  client,
  queries(context) {
    return {
      data: {
        query: gql`
          query AllUsers($first: Int, $after: String, $last: Int, $before: String) {
            viewer {
              allUsers(first: $first, after: $after, last: $last, before: $before) {
                edges {
                  node {
                    id
                    username
                    lastLogin
                    createdAt
                    modifiedAt
                  }
                  cursor
                }
                pageInfo {
                  hasNextPage
                  hasPreviousPage
                }
              }
            }
          }
        `,
        variables: {
          first: context.first,
          after: context.after,
          last: context.last,
          before: context.before
        },
        forceFetch: false,
        returnPartialData: true,
        pollInterval: 10000
      }
    };
  }
})
```

#### Apollo Client

Apollo Client is an easy to use, framework agnostic GraphQL client library that makes it easy to integrate GraphQL with your app. In our experience it can be a little easier to work with than Relay and allows you to use non-React frameworks like Angular 2! Under the hood, Apollo Client uses the Redux state container for caching so that your queries run quickly and your data is always in sync.

##### The Apollo Decorator

Angular2 uses decorator functions to attach metadata to classes. Components use @Component, services use @Injectable, and classes that need GraphQL functionality use @Apollo. Take a look at the HomeComponent in `src/home/home.component.ts`.

The Apollo decorator allows you to define queries and mutations and make them reactive so that your data stays up to date as properties in your component class change. @Apollo takes a single object with the keys `client`, `queries`, `mutations` as a parameter and returns an object that maps to properties in the decorated class.

For the example above note how we have property `data: any` in our HomeCompnoent class. We can access the data returned by the query defined in the @Apollo decorator via the `data` property. Also note how the queries function in the parameter exposes a single `context` argument. This `context` points to the scope of the decorated class so that you can directly reference your component's state properties. This is extra awesome because Apollo Client automatically makes the queries defined in the @Apollo decorator reactive. This means that when properties in your class change so will your data. Apollo implements a bunch of cool tricks to make this efficient such that it only issues new API requests when needed and uses cached data in Redux for the rest.

You can find more documentation here for [Apollo Client](http://docs.apollostack.com/apollo-client/index.html) and [Angular2Apollo](http://docs.apollostack.com/apollo-client/angular2.html) (a native wrapper for Angular2)

### [Scaphold](https://scaphold.io)

Scaphold is a GraphQL-as-a-Service platform that makes it really easy to create production backends using GraphQL. Their web interface greatly simplifies the process of defining a GraphQL schema, integrations make adding other services like social authentication, stripe payments, email support, and push notifications a breeze, and the data exploration tools let you comb through your data without having to write GraphQL.

This template was created to work seamlessly with a fresh [scaphold.io](https://scaphold.io) application and already has user registration and authentication configured for you. The HomeComponent `src/home/home.component.ts` also includes and example of how you can easily implement pagination using Connections on Scaphold.

#### Pagination

> Note: We advise you only use (`first` and `after`) OR (`last` and `before`) at any given time. Although you technically can use both at the same time it can lead to unexpected results. See the [Cursor Connections Spec](https://facebook.github.io/relay/graphql/connections.htm) for more details.

```
query AllUsers($first: Int, $after: String, $last: Int, $before: String) {
    viewer {
        allUsers(first: $first, after: $after, last: $last, before: $before) {
            edges {
                node {
                    id
                    username
                    lastLogin
                    createdAt
                    modifiedAt
                }
                cursor
            }
            pageInfo {
                hasNextPage
                hasPreviousPage
            }
        }
    }
}
```

> It also binds the connection arguments to 4 properties in the HomeComponent class.

```
variables: {
  first: context.first,
  after: context.after,
  last: context.last,
  before: context.before
}
```

A necessary part of any application is the ability to paginate through data in arbitrarily sized *pages*. To do this in GraphQL, we use *Connections*. A *Connection* is a standards based approach to pagination that offers a efficient and straigh-forward pagination mechanism.

A GraphQL connection field takes 4 arguments

- `first`: An integer specifying the count of objects following the `after` cursor in a sequence that should be included in the response.
- `after`: A string 'cursor'. This is an opaque identifier that points to an object in a sequence. It specifies where our page slice should start in a sequence and is used with `first`. Results are bounds-exclusive and will start strictly after this cursor.
- `last`: An integer specifying the count of objects precursing the `before` cursor in a sequence that should be included in the response.
- `before`: A string 'cursor'. This is an opaque identifier that points to an object in a sequence. It specifies where our page slice should end in a sequence and is used with `last`. Results are bounds-exclusive and will start strictly before this cursor.

The HomeComponent defines the following GraphQL query in the @Apollo decorator function.

With this setup, we are able to immediately start paginating through our User data by changing the `first`, `after`, `last`, and `before` properties in the HomeComponent class. Apollo Client automatically handles making our query reactive and will make sure the presented data stays in sync with our class properties.

```javascript
const edgeCount = this.data.viewer.allUsers.edges.length;
const afterCursor = (edgeCount > 0) ? this.data.viewer.allUsers.edges[edgeCount - 1]['cursor'] : null;
this.after = afterCursor;
this.first = this.defaultPageSize;
this.before = null;
this.last = null;
```

Try out different values to experiment with Cursor Connection pagination.

### Installing

<pre class="left">
# For or clone this repo
# Take the master repo if you want to plug your own styling framework
$ git clone https://github.com/scaphold-io/angular2-apollo-client-webpack-starter.git my-app

# The AngularMaterial branch comes preloaded with the popular angular2-material library
$ git clone -b AngularMaterial https://github.com/scaphold-io/angular2-apollo-client-webpack-starter.git my-app

# update /my-app/src/config.ts with your scaphold api url
$ cd my-app
$ vi src/config.ts

# install the dependencies with npm
$ npm install
# Your scaphold url will look something like https://api.scaphold.io/graphql/my-awesome-app-alias

# start the server
$ npm start
</pre>

What you need to run this app:
* `node` and `npm`
* We tested this template with Node (`v4.x`+) and NPM (`3.x`+) but others will most likely work as well

### Running the app

After you have installed all dependencies you can now run the app with: `npm start`

It will start a local server using `webpack-dev-server` which will watch, build (in-memory), and reload for you. The port will be displayed to you as `http://localhost:8080`.

### Developing

#### Building

* single run: `npm run build`
* build files and watch for changes: `npm run watch`

#### Generating Documentation

* `npm run docs`
* This uses [TypeDoc](http://typedoc.io/) and understand JavaDoc style tags

### Testing

#### 1. Unit Tests

* single run: `npm test`
* live mode: `npm run test-watch`

#### 2. Integration Tests

* single run: `npm e2e`
* live mode: `npm e2e-live`

### Contributing

Please feel free to fork this project and contribute. Send us a pull request and we'd be happy to merge :)