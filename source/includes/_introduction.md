# Introduction

> **The code snippets in this sidebar are designed to work in your apps directly.** The requests are performed using the following resources.

> GraphQL API: <script>document.write(window.apiUrl)</script>

> Email address: <script>document.write(window.currentUserEmail)</script>

Welcome! Scaphold is a backend-as-a-service platform that bundles all the tools you need to quickly build production-grade applications.
In a matter of minutes, you can create your own **customizable GraphQL API** backed by our highly available cloud infrastructure hosted on AWS.

As soon as you [create an app on Scaphold](https://scaphold.io?signupModal=true), you'll instantly have a persistent data
store, data modeling tools, advanced access control management, and monitoring dashboards all at your fingertips. This will
get you most of the way to launching your app, but why stop there?

Scaphold also provides many powerful features that will **accelerate your team's app development like never before**:

1. [Easily model complex data](#core-data)

2. [Integrate popular services](#integrations)

3. [Real-time with 0 setup](#subscriptions)

4. [Teams work together](#teams)

5. [Unbeatably fast global network](#regions)

6. [Industry-standard GraphQL](#the-schema)

**New to GraphQL?** [Learn about it here!](#learn-graphql)

**Already an expert?** [Get started now!](https://scaphold.io?signupModal=true)

**Have any questions?** [Join our Slack!](https://scapholdslackin.herokuapp.com)

## Setup

> In Scaphold's documentation, we'll be using the most common base networking library for each language. There are no tricks up our sleeves, it just works!

```javascript
npm install --save request
```

GraphQL is a truly versatile query language for your API. This means that you can use any client networking library to make requests against
your GraphQL API. Whether you're building a Web, iOS, Android, or IOT app, GraphQL's got you covered.

In short,

* A `query` is a `string`
* The `variables` are in `json` format

<aside class="notice">
  Send the GraphQL query and variables together in one JSON payload in the content body of your request to your GraphQL API.
</aside>

## Why GraphQL?

> Describe your data

```graphql
type Mission {
  id: ID!
  codename: String
  astronauts: [User]
}
```

> Ask for what you want

```graphql
{
  getMission(id: "abc123") {
    codename
  }
}
```

> Get predictable results

```json
{
  "getMission": {
    "codename": "GraphQL Takes Over The World!"
  }
}
```

> <aside class="notice">
All responses from your API will be formatted as JSON.
</aside>

[GraphQL](http://graphql.org/) was developed by Facebook over the years to power and scale many of their mobile and web applications. A
great deal of care was taken to ensure that GraphQL works from any client platform which means you can use Scaphold to build an application
on virtually any platform. This means you can target your Scaphold API from iOS, Android, Web, and IOT applications using any framework
**without ever having to download an SDK**! GraphQL presents a better way to build applications. It's that simple. You focus on what makes
your app awesome and let us worry about the rest!

Plus GraphQL is a massive improvement on REST. Here is why!

1. A declarative type system helps create clean, structured, and safe APIs.
2. Write your queries once and run them anywhere! The intuitive GraphQL language is not only more powerful but also 100% cross-platform. No SDKs necessary!
3. Introspection lets you build documentation into the API itself. Your API easier to learn and eliminates the need to maintain external docs.
4. A GraphQL API has one endpoint. No more tricky RESTful urls.
5. Client driven. GraphQL empowers those who understand their requirements best. You!
6. It integrates seamlessly with the hottest frontend frameworks like React and Angular 2.0 using Relay and Apollo Client
7. And many many more!

## Learn GraphQL

### Resources

- Facebook's [GraphQL.org](http://graphql.org)

- Kadira's [LearnGraphQL.com](https://learngraphql.com/)

- Apollo's [GraphQL.com](http://www.graphql.com/)

- [The Fastest Way to Get Started](https://scaphold.io/blog/2016/06/14/fastest-way-to-get-started.html)

- [GraphQL vs. REST](https://medium.com/chute-engineering/graphql-in-the-age-of-rest-apis-b10f2bf09bba#.el99enbvh)

- [State of GraphQL](https://scaphold.io/blog/2016/10/31/state-of-graphql.html)

- Clay Allsopp's [GraphQLHub.com](https://www.graphqlhub.com/)

- [Official GraphQL Slack](https://graphql-slack.herokuapp.com/)

- [Scaphold Slack](https://scapholdslackin.herokuapp.com)

- [Other Community Sites](http://graphql.org/community/)

- [Unofficial List of Resources](https://github.com/chentsulin/awesome-graphql)

If you have other additions to this list that you'd like to add, feel free to contact us at our [Slack channel](https://scapholdslackin.herokuapp.com). Message either @vince or @michael.

### Look Out For...

- More public GraphQL APIs
- Relay 2.0!
- GraphQL Subscriptions updates
- Open source tooling released by companies that are using it internally
- More mobile support
