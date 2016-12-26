# Core Data

Scaphold's core data platform allows you to easily define complex data models that are instantly deployed
to a production GraphQL API backed by a highly available SQL cluster. Core Data provides a great set of
tools for powering core application logic.

Every type in your schema that implements the `Node` interface is backed by core data. That means every
type that implements `Node` maps to a single table and can be related to any other core data types via
`Connection` fields. Each core data type `X` also receives a `createX`, `updateX`, and `deleteX` mutation as well
as various ways to read the data with `getX`, `allX`, and through connections.

Scaphold allows you to write GraphQL queries that are compiled down to SQL which means you get powerful
filtering abilities with `WhereArgs` as well as compound `orderBy` expressions. We even expose the ability
for you to index certain fields in your data so that you can optimize the queries that are important to your
application.

## The Schema

> Example schema

```graphql
type ScapholdSchema {
  id: ID!
  name: String!
  description: String
  types: [ScapholdType]
}

type ScapholdType {
  id: ID!
  name: String!
  description: String
  kind: "OBJECT" | "ENUM" | "INTERFACE"
  values: [String]                        # if ENUM
  fields: [ScapholdField]                 # if INTERFACE or OBJECT
  interfaces: [String]                    # if OBJECT
  permissions: [ScapholdPermission]
}

type ScapholdField {
  name: String!
  description: String
  type: String!
  ofType: String
  nonNull: Boolean
  unique: Boolean
  reverseName: String
}

interface Node {
  id: ID!
}
```

Every application you build on Scaphold will have a schema. A schema consists of a set of types and a set of
connections between those types. This connected web of types creates the 'graph' that will come to define your API.

One of GraphQL's biggest benefits is that it provides a mechanism to express types at the API level. Types have
existed in general purpose programming languages and other query languages like SQL for years so it's about
time we brought it to APIs.

There are **two main classes of types** that you need to be aware of on Scaphold.

1. Types that implement the `Node` interface.
These are first-class entities in your Scaphold API. We will generate queries and mutations for them, you may create
connections between them, and you may use them with event-based integrations.

2. Types that *don't* implement the `Node` interface.
These are auxiliary structures in your GraphQL API and these objects are stored inline within other `Node` types.
Scaphold will not create queries and mutations for non-node types nor can you use them to fire event-based integrations.
You can, however, still relate them to other objects via the `List` type or as an inline object.

Scaphold's [Schema Designer](https://scaphold.io/apps) allows you to define complex schemas in a fraction of the
time while also offering you a convenient place to setup access control rules ([permissions](#permissions)) for your
data. As you define the structure of your schema we'll generate the backend that will host your custom GraphQL API. By
default we generate a `get`, `create`, `update`, and `delete` operation for each type in your schema. And to give you that
extra boost, we also create mutations to handle user authentication, schema migration, and integration management.

### Scalars

Name | Description
-------------- | --------------
ID | The ID scalar type represents a unique identifier, often used to refetch an object or as the key for a cache. The ID type is serialized in the same way as a String; however, defining it as an `ID` signifies that it is not intended to be human‐readable.
String | A UTF‐8 character sequence
Text | Character sequence with unlimited length (cannot be indexed or have a default value)
Int | A signed 32-bit integer
Float | A signed double-precision floating-point value
Boolean | `true` or `false`
DateTime | Valid timestamp that can be converted to standard ISO 8601 date time format.

### Types

> <aside class="notice">
  Scaphold provides 3 objects types to start off with: <a href="#token-auth">User</a>, <a href="#roles">Role</a>, and <a href="#files">File</a>.
</aside>

```graphql
type Computer {
  id: ID!
  name: String!
  brand: String
  memory: Float
  diskSpace: Float
  numCores: Int
  price: Float
  isNew: Boolean
}
```

> <aside class="notice">
  Scaphold provides 3 interfaces to start off with: <a href="#the-schema">Node</a>, <a href="#the-schema">Timestamped</a>, and <a href="#files">Blob</a>.
</aside>

```graphql
interface Animal {
  name: String
  height: Float
  weight: Float
}
```

> <aside class="notice">
  Scaphold provides 2 enums to start off with: <a href="#authentication">CredentialType</a> and <a href="#permissions-authorization">AccessLevel</a>.
</aside>

```graphql
enum HouseTypeEnum {
  condominium
  apartment
  house
  duplex
}
```

Name | Description
-------------- | --------------
Object | These are the bread and butter of the GraphQL type system and schema. They are the model definitions of your data, telling the GraphQL server what types exist, the fields that belong to a type, and the complex relations between your data. GraphQL queries are validated against this type system. Scaphold allows you to easily define your types without having to write any server-side code, so you can leverage the benefits of GraphQL from your client side, without having to write this all yourself.
Interface | An interface is an abstract type that must be implemented by a type. The fields belonging to an interface must also exist on the type that implements it.
Enum | Enumerations are special scalar types that restrict values to a finite set of data.

**Adding a Type**

In the Schema Designer tab once you've created your app, click the dropdown on the top right to add a type.

<img src="images/coredata/Add_Type.png" alt="add-type" />

### Type Modifiers

Name | Description
-------------- | --------------
List | A List indicates that this field will return an array of a particular type. This is denoted in GraphQL as `[ ... ]` surrounding the name of a type or scalar.
Non-Null | The Non-Null type modifier can also be used when defining arguments for a field, which will cause the GraphQL server to return a validation error if a null value is passed as that argument, whether in the GraphQL string or in the variables. This is denoted in GraphQL as a `!` following the name of a type or scalar.

### Fields

In GraphQL, like many other type systems, each type will have a set of fields associated with it. Fields are used to describe a particular type, and types in Scaphold will come by default
with an `id`, `createdAt`, and `modifiedAt` fields as part of implementing the `Node` and `Timestamped` interfaces. These can be removed when creating a new type; however, a type must have at least one field.

**Adding a Field**

In the Schema Designer tab once you've created your type, click the dropdown on the top right of a Type panel.

<img src="images/coredata/Add_Field.png" alt="add-field" />

## Queries

> Example `getX` query

```shell
curl -X POST https://us-west-2.api.scaphold.io/graphql/scaphold-graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "query GetUser ($input: ID!) { getUser (id: $input) { id, username, createdAt, modifiedAt, lastLogin } }",
    "variables": {"input": "VXNlcjoxMQ=="}}'
```

```javascript
import request from 'request';

const data = {
  "query": `query GetUser ($input: ID!) {
    getUser (id: $input) {
      id
      username
      createdAt
      modifiedAt
      lastLogin
    }
  }`,
  "variables": {
    "input": "VXNlcjoxMQ=="
  }
};

request({
  url: "https://us-west-2.api.scaphold.io/graphql/scaphold-graphql",
  method: "POST",
  json: true,
  headers: {
    "content-type": "application/json",
  },
  body: data
}, (error, response, body) => {
  if (!error && response.statusCode == 200) {
    console.log(JSON.stringify(body, null, 2));
  } else {
    console.log(error);
    console.log(response.statusCode);
  }
});
```

> The above command returns an object structured like this:

```json
{
  "data": {
    "getUser": {
      "id": "VXNlcjoxMQ==",
      "username": "Elon Musk",
      "createdAt": "2016-12-08T12:33:56.000Z",
      "modifiedAt": "2016-12-08T12:33:56.000Z",
      "lastLogin": "2016-12-08T12:33:56.000Z"
    }
  }
}
```

> <aside class="notice">
You can see every custom query available in the doc explorer in the GraphiQL tab.
See how GraphQL results directly mirror the query? It's awesome!
</aside>

Queries allow you to read data from your GraphQL API!

Each core data type `X` gets its own queries `getX` and `viewer.allXs`. Since core data types can be involved in
connections, you can also read related objects through any connection fields in your schema. All core data connections
take the `XWhereArgs` and `XOrderByArgs` inputs that allow you to do complex filtering and compound ordering.

### Viewer

> Example `viewer` query

```shell
curl -X POST https://us-west-2.api.scaphold.io/graphql/scaphold-graphql \
  -H "Content-Type: application/json" \
  -d '{ "query": "query GetAllUsers($first: Int, $after: String, $orderBy: [UserOrderByArgs]) { viewer { allUsers(first: $first, after: $after, orderBy: $orderBy) { edges { cursor node { username createdAt } } } } }",
    "variables": { "first": 3, "after": "Yzp7ImNyZWF0ZWRBdCI6IjIwMTYtMTItMDhUMTU6MDI6MzguMDAwWiIsImlkIjo2fQ==", "orderBy": { "field": "createdAt", "direction": "DESC" } } }'
```

```javascript
import request from 'request';

const data = {
  "query": `query GetAllUsers($first: Int, $after: String, $orderBy: [UserOrderByArgs]) {
    viewer {
        allUsers(first: $first, after: $after, orderBy: $orderBy) {
          edges {
            cursor
            node {
              username
              createdAt
            }
          }
        }
      }
    }
  `,
  "variables": {
    "first": 3,
    "after": "Yzp7ImNyZWF0ZWRBdCI6IjIwMTYtMTItMDhUMTU6MDI6MzguMDAwWiIsImlkIjo2fQ==",
    "orderBy": {
        "field": "createdAt",
        "direction": "DESC"
    }
  }
};

request({
  url: "https://us-west-2.api.scaphold.io/graphql/scaphold-graphql",
  method: "POST",
  json: true,
  headers: {
    "content-type": "application/json",
  },
  body: data
}, (error, response, body) => {
  if (!error && response.statusCode == 200) {
    console.log(JSON.stringify(body, null, 2));
  } else {
    console.log(error);
    console.log(response.statusCode);
  }
});
```

> The above command returns an object structured like this:

```
{
  "data": {
    "viewer": {
      "allUsers": {
        "edges": [
          {
            "cursor": "Yzp7ImNyZWF0ZWRBdCI6IjIwMTYtMTItMDhUMTU6MDI6MjMuMDAwWiIsImlkIjo1fQ==",
            "node": {
              "username": "Steve Jobs",
              "createdAt": "2016-12-08T15:02:23.000Z"
            }
          },
          {
            "cursor": "Yzp7ImNyZWF0ZWRBdCI6IjIwMTYtMTItMDhUMTU6MDI6MTcuMDAwWiIsImlkIjo0fQ==",
            "node": {
              "username": "Bill Gates",
              "createdAt": "2016-12-08T15:02:17.000Z"
            }
          },
          {
            "cursor": "Yzp7ImNyZWF0ZWRBdCI6IjIwMTYtMTItMDhUMTU6MDI6MDYuMDAwWiIsImlkIjozfQ==",
            "node": {
              "username": "Larry Page",
              "createdAt": "2016-12-08T15:02:06.000Z"
            }
          }
        ]
      }
    }
  }
}
```

> <aside class="notice">
The <code>RELATION</code> permission restricts access to queries through <code>viewer.user</code>.  This is how we are able
to efficiently enable you to provide full user field paths in your <code>RELATION</code> permission.
</aside>

The viewer is a convention from [`Relay`](https://facebook.github.io/relay/) that allows you to both easily paginate
through all objects in your app as well as get a view for the currently logged in user. We generate a viewer field
`allX` for each type `X` in your schema. Queries that go through the viewer are subject to your set permissions so
users can only access the data you allow.

The viewer also contains a `user` field that will always return information on the currently logged in user.

It's powerful since it uses connections and cursors to enable pagination out of the box! Cursors are essentially
a mechanism that uniquely identifies a single piece of data in a paginated list. With this unique ID, you can
apply it to the `after` or `before` parameters in your query to retrieve data past or prior to a particular piece
of data, respectively.

## Mutations

A GraphQL mutation is a write followed by a fetch in one operation.

Mutations are your means of modifying data in your API. Each core data type `X`, gets a `createX`, `updateX`, and `deleteX`
mutation. Input arguments are automatically created to fit your schema and can be inspected from GraphiQL's Doc Explorer.

Here's an example of each type of mutation:

### Create

```shell
curl -X POST https://us-west-2.api.scaphold.io/graphql/scaphold-graphql \
  -H "Content-Type: application/json" \
  -d '{ "query": "mutation CreateUser($user: CreateUserInput!) { createUser(input: $user) { changedUser { id username } } }",
    "variables": { "user": { "username": "elon@tesla.com", "password": "SuperSecretPassword" } } }'
```

```javascript
import request from 'request';

const data = {
  "query": `
    mutation CreateUser($user: CreateUserInput!) {
      createUser(input: $user) {
        changedUser {
          id
          username
        }
      }
    }
  `,
  "variables": {
    "user": {
      "username": "elon@tesla.com",
      "password": "SuperSecretPassword"
    }
  }
};

request({
  url: "https://us-west-2.api.scaphold.io/graphql/scaphold-graphql",
  method: "POST",
  json: true,
  headers: {
    "content-type": "application/json",
  },
  body: data
}, (error, response, body) => {
  if (!error && response.statusCode == 200) {
    console.log(JSON.stringify(body, null, 2));
  } else {
    console.log(error);
    console.log(response.statusCode);
  }
});
```

> The above command returns an object structured like this:

```json
{
  "data": {
    "createUser": {
      "changedUser": {
        "id": "VXNlcjo3",
        "username": "elon@tesla.com"
      }
    }
  }
}
```

> <aside class="notice">
  The request above may throw an error since there's a <b>uniqueness constrainst set automatically</b> on the User model's <code>username</code> field.
</aside>

In this request, JSON-formatted variables are used to send an object as part of the payload for the mutation request.
The dollar sign ($) specifies a GraphQL variable, and the variable definition can be found in the variables section
of the request. Another thing to note here is that when introducing variables in the mutation string,
`$user: CreateUserInput!` means that that variable is of type `CreateUserInput!` and is required (!).

### Update

```shell
curl -X POST https://us-west-2.api.scaphold.io/graphql/scaphold-graphql \
  -H "Content-Type: application/json" \
  -d '{ "query": "mutation UpdateUser($user: UpdateUserInput!) { updateUser(input: $user) { changedUser { id username biography } } }",
    "variables": { "user": { "id": "VXNlcjox", "biography": "Spends his days saving the world with renewable energy." } } }'
```

```javascript
import request from 'request';

const data = {
  "query": `
    mutation UpdateUser($user: UpdateUserInput!) {
      updateUser(input: $user) {
        changedUser {
          id
          username
          biography
        }
      }
    }
  `,
  "variables": {
    "user": {
      "id": "VXNlcjox",
      "biography": "Spends his days saving the world with renewable energy."
    }
  }
};

request({
  url: "https://us-west-2.api.scaphold.io/graphql/scaphold-graphql",
  method: "POST",
  json: true,
  headers: {
    "content-type": "application/json",
  },
  body: data
}, (error, response, body) => {
  if (!error && response.statusCode == 200) {
    console.log(JSON.stringify(body, null, 2));
  } else {
    console.log(error);
    console.log(response.statusCode);
  }
});
```

> The above command returns an object structured like this:

```json
{
  "data": {
    "updateUser": {
      "changedUser": {
        "id": "VXNlcjox",
        "username": "Elon Musk",
        "biography": "Spends his days saving the world with renewable energy."
      }
    }
  }
}
```

You can also make a mutation to update data. The update operation performs a non-destructive update
to an object in your dataset. I.E. Update only updates the fields that you include as part of the
input. The object's `id` is required in every update mutation so that we can uniquely identify the
object you would like to update. If you don't know it, you should perform a query operation to fetch
the data first, or save it in your application's state after creating the object.

### Delete

```shell
curl -X POST https://us-west-2.api.scaphold.io/graphql/scaphold-graphql \
  -H "Content-Type: application/json" \
  -d '{ "query": "mutation DeleteUser($user: DeleteUserInput!) { deleteUser(input: $user) { changedUser { id username } } }",
    "variables": { "user": { "id": "VXNlcjo4" } } }'
```

```javascript
import request from 'request';

const data = {
  "query": `
    mutation DeleteUser($user: DeleteUserInput!) {
      deleteUser(input: $user) {
        changedUser {
          id
          username
        }
      }
    }
  `,
  "variables": {
    "user": {
      "id": "VXNlcjo4"
    }
  }
};

request({
  url: "https://us-west-2.api.scaphold.io/graphql/scaphold-graphql",
  method: "POST",
  json: true,
  headers: {
    "content-type": "application/json",
  },
  body: data
}, (error, response, body) => {
  if (!error && response.statusCode == 200) {
    console.log(JSON.stringify(body, null, 2));
  } else {
    console.log(error);
    console.log(response.statusCode);
  }
});
```

> The above command returns an object structured like this:

```json
{
  "data": {
    "deleteUser": {
      "changedUser": {
        "id": "VXNlcjo4",
        "username": "elon@spacex.com"
      }
    }
  }
}
```

> <aside class="notice">
  The request above may return `null`. This is an indication that you tried to delete a piece of data
  that doesn't exist.
</aside>

Use delete operations to delete data from your API. Delete requires the unique global identifier `id`
of the piece of data that you wish to delete. Upon deleting data, you will receive the data back one
last time in case you need it again, and to serve as confirmation that that particular object was removed.

## Subscriptions

> Example: Subscribe and get a real-time feed of when any user logs in or is created.

> Query

```graphql
subscription SubscribeToUser($user: [UserMutationEvent]!) {
  subscribeToUser(mutations: $user) {
    mutation
    value {
      id
      username
    }
  }
}
```

> Variables

```json
{
  "user": [
    "loginUser",
    "createUser"
  ]
}
```

When Facebook open-sourced GraphQL, they described how applications can perform reads
with queries, and writes with mutations. However, oftentimes clients want to get pushed
updates from the server when data they care about changes. Enter Subscriptions. **Subscriptions
make real-time functionality a first class citizen in GraphQL!**

Subscriptions offer a clean and efficient way to get pushed updates in real-time. They act
in parallel to mutations. Just like how mutations describe the set of actions you can
take to change your data, subscriptions define the set of events that you can subscribe
to when data changes. In fact, you can think of subscriptions as a way to react to
mutations made elsewhere.

For example, think about a chat application like **Slack**. To create a good user experience,
our application needs to stay up to date at all times. I.E. when a co-worker sends me a message,
I shouldn't have to refresh the page to see the message. A much better solution is to have the
server push my chat client the message as soon as it is created. This is how subscriptions work.
When someone creates a message (or in other words issues a mutation), the server immediately
pushes the data to every client that is both subscribed to that event.

<aside class="notice">
    <b>GraphQL Subscriptions require a web socket connection.</b> This is client-specific. We use Apollo Client
    for our web apps as they have functionality to add a web socket handler to their base network interface.
</aside>

### Subscriptions in GraphiQL

> Query

```graphql
subscription SubscribeToNewMessages($messageFilter:MessageSubscriptionFilter) {
  subscribeToMessage(mutations:[createMessage], filter:$messageFilter) {
    mutation
    value {
      id
      content
      channel {
        id
        name
      }
      createdAt
    }
  }
}
```

> Variables

```graphql
{
  messageFilter: {
    content: {
      matches: ".\*GraphQL.\*"
    },
    channelId: {
      eq: "SavedChannelId"
    }
  }
}
```

You can play around with Subscriptions in our GraphiQL page! It's hooked up to handle web socket connections, so Subscription
requests will work immediately. Normal HTTP clients won't work with Subscriptions since it requires a web socket connection.

<img src="images/subscriptions/subs2.gif" alt="Subscriptions in GraphiQL" />

This is what I'm doing:

1) I create a `Channel` object with name `GraphQL News!` and save its id.

2) By issuing the query to the right, I subscribe to all new messages that are created in the `GraphQL News!` channel
and that have content matching the regex `.*GraphQL.*`

3) I send a `Message` with content `GraphQL is future!` to channel `GraphQLNews!` and see a message pushed into the Subscription stream.

4) I send a `Message` with content `REST is dead!` to channel `GraphQLNews!` and no message appears in the Subscription stream.

5) I send a `Message` with content `GraphQL Subscriptions are Awesome!` to channel `GraphQLNews!` and another message appears in the Subscription stream.

6) I close the Subscription by double-tapping the pulse icon in the subscription stream.

Subscribing to changes to data in your API is that easy! There are a number of subscription filters you can use to
fine tune your subscriptions and you can even filter on One-To-Many and One-to-One connections using the associated
id filters.

Our Subscription implementation works (*almost*) out of the box with Apollo Client. Follow these
steps to make your app real-time!

### Resources

- [Subscriptions with Apollo Client](#subscriptions-with-apollo-client)
- [Subscriptions with React](#subscriptions-with-react)
- [The full Slackr tutorial](the-full-slackr-tutorial)

## Connections & Pagination

> Each type will have associated `Connection` types like so:

```graphql
type XConnection {
  edges: [XEdge]
  pageInfo: PageInfo
}

type XEdge {
  cursor: String
  node: X
}

type PageInfo {
  hasNextPage: Boolean!
  hasPreviousPage: Boolean!
}
```

> All connection fields will take the form:

```graphql
query {
  connectionFieldOfTypeX (
    first: Int,
    after: String!,
    last: Int,
    before: String,
    orderBy: String
  ) {
    edges {
      cursor
      node {
        ...fields in type X
      }
    }
    pageInfo {
      hasNextPage
      hasPreviousPage
    }
  }
}
```

We use the concept of `Connections` to provide a standardized way of paginating through large sets of objects.
You can use the `Connection` type when defining your schema whenever you need to model relations on potentially
large sets of data.

Connections expose the following arguments:

Name | Type | Description
-------------- | -------------- | --------------
where | `Object` | Object that represents SQL-like terms used for [filtering](#filtering-whereargs) on a per-field basis
orderBy | `List` | Fields that you wish to order by, and the order in which your app needs the data (`ASC` or `DESC`)
first | `Int` | Acts as a limiting number of records to return and counts forward (i.e. from 0 to n)
after | `String` | Pass in the cursor of an object, and you will retrieve the data **after** that particular record in a paginated list
last | `Int` | Acts as a limiting number of records to return and counts backward (i.e. from n to 0)
before | `String` | Pass in the cursor of an object, and you will retrieve the data **before** that particular record in a paginated list

<aside class="notice">
  Although connections expose <code>first</code>, <code>after</code>, <code>last</code>, and <code>before</code> we strongly recommend that you only ever use either
  (<code>first</code> and <code>after</code>) or (<code>last</code> and <code>before</code>) together at once as unexpected behavior can occur if you use both at the same time.
  The <code>orderBy</code> paramater allows you to order your data with respect to a field in the connected type and we will maintain the order throughout the pagination.
</aside>

### One-to-One

```shell
curl -X POST https://us-west-2.api.scaphold.io/graphql/scaphold-graphql \
  -H "Content-Type: application/json" \
  -d '{ "query": "mutation UpdateCountry($input: UpdateCountryInput!) { updateCountry(input: $input) { changedCountry { id name capitalCity { id name } } } }",
    "variables": { "input": { "id": "Q291bnRyeTox", "capitalCityId": "Q2FwaXRhbENpdHk6MQ==" } } }'
```

```javascript
var request = require('request');

var data = {
  "query": `
    mutation UpdateCountry($input: UpdateCountryInput!) {
      updateCountry(input: $input) {
        changedCountry {
          id
          name
          capitalCity {
            id
            name
          }
        }
      }
    }
  `,
  "variables": {
    "input": {
      "id": "Q291bnRyeTox",                         // Country ID
      "capitalCityId": "Q2FwaXRhbENpdHk6MQ=="       // Capital City ID
    }
  }
}

request({
  url: "https://us-west-2.api.scaphold.io/graphql/scaphold-graphql",
  method: "POST",
  json: true,
  headers: {
    "content-type": "application/json",
  },
  body: data
}, function(error, response, body) {
  if (!error && response.statusCode == 200) {
    console.log(JSON.stringify(body, null, 2));
  } else {
    console.log(error);
    console.log(response.statusCode);
  }
});
```

> The above command returns an object structured like this:

```json
{
  "data": {
    "updateCountry": {
      "changedCountry": {
        "id": "Q291bnRyeTox",
        "name": "United States",
        "capitalCity": {
          "id": "Q2FwaXRhbENpdHk6MQ==",
          "name": "Washington, D.C."
        }
      }
    }
  }
}
```

Given two types, `Country` and `CapitalCity`, you can designate a one-to-one relationship between them since one country can only have one capital city. In a one-to-one connection
between two types, there will be a field on each of the connected types that refers back to the other (i.e. reverse name). With that, you can associate an instance of `Country`
with another instance of `CapitalCity`.

**Steps:**

1. Provided the two types have been created already, add a field called `country` to `CapitalCity` with this configuration.

<img src="images/coredata/One_To_One.png" alt="1-to-1 Connection" style="max-width: 50%" />

2. Create an instance of `Country`.

3. Create an instance of `CapitalCity`.

4. Update the country instance with the id of the newly created capital city on the `capitalCityId` field.

### One-to-Many

```shell
curl -X POST https://us-west-2.api.scaphold.io/graphql/scaphold-graphql \
  -H "Content-Type: application/json" \
  -d '{ "query": "mutation UpdateFile($input: UpdateFileInput!) { updateFile(input: $input) { changedFile { id name owner { id username } } } }",
    "variables": { "input": { "id": "RmlsZTox", "ownerId": "VXNlcjox" } } }'
```

```javascript
var request = require('request');

var data = {
  "query": `
    mutation UpdateFile($input: UpdateFileInput!) {
      updateFile(input: $input) {
        changedFile {
          id
          name
          owner {
            id
            username
          }
        }
      }
    }
  `,
  "variables": {
    "input": {
      "id": "RmlsZTox",                 // File ID
      "capitalCityId": "VXNlcjox"       // User ID
    }
  }
}

request({
  url: "https://us-west-2.api.scaphold.io/graphql/scaphold-graphql",
  method: "POST",
  json: true,
  headers: {
    "content-type": "application/json",
  },
  body: data
}, function(error, response, body) {
  if (!error && response.statusCode == 200) {
    console.log(JSON.stringify(body, null, 2));
  } else {
    console.log(error);
    console.log(response.statusCode);
  }
});
```

> The above command returns an object structured like this:

```json
{
  "data": {
    "updateFile": {
      "changedFile": {
        "id": "RmlsZTox",
        "name": "profilePicture",
        "owner": {
          "id": "VXNlcjox",
          "username": "Elon Musk"
        }
      }
    }
  }
}
```

One-to-many relationships work very similarly to one-to-one relationships. The difference is that after you connect two types, you *must* update the instance on the "many side" of the
connection. Only the "many side" instance will have a field that associates it to an instance of the "one side" of the relationship.

Given two types, `User` and `File`, you can designate a one-to-many relationship between them since one user can have multiple files, while a file can only have one owner (user). In a
one-to-many connection between two types, there will be a field injected on the file type called ownerId (id of the user). With that, you can associate an instance of `User` with another instance of `File`.

**Steps:**

1. Provided the two types have been created already, add a field called `files` to `User` with this configuration.

<img src="images/coredata/One_To_Many.png" alt="1-to-Many Connection" style="max-width: 50%" />

2. Create an instance of `User`.

3. Create an instance of `File`.

4. Update the file instance with the id of the newly created user on the `ownerId` field.

### Many-to-Many

> For example, suppose we have the following schema:

```graphql
type User {
  id: ID!
  username: String!
  posts: [Post]
  edits: [Post]
}

type Post {
  id: ID!
  title: String!
  content: String
  author: User
  editors: [User]
}
```

Many-to-many connections are defined by having two types with Connection fields pointing to one another via their `reverseName` and have a special workflow for managing edges between their objects.

Given the example on the right, Scaphold will generate 3 special mutations for dealing with the many-to-many relations between **User** and **Post** via the edits & editors fields. These mutations will be:

1. `addToUserEditsConnection`
2. `updateUserEditsConnection`
2. `removeFromUserEditsConnection`

These mutations can be used to add edges between objects in the many-to-many connection.

<aside class="notice">
  Connections are bi-directional and thus if you use addToUserEditsConnection(...) to add a post to a users set of edited posts, then it will also add that user to the posts set of editors.
</aside>

**Special Case**

> Special Case Example

```shell
curl -X POST https://us-west-2.api.scaphold.io/graphql/scaphold-graphql \
  -H "Content-Type: application/json" \
  -d '{ "query": "mutation AddFriendship($input: AddToFriendshipConnectionInput!) { addToFriendshipConnection(input: $input) { changedFriendship { status user1 { id username } user2 { id username } } } }",
    "variables": { "input": { "user1Id": "VXNlcjo0", "user2Id": "VXNlcjoz", "status": "Accepted" } } }'
```

```javascript
var request = require('request');

var data = {
  "query": `
    mutation AddFriendship($input: AddToFriendshipConnectionInput!) {
      addToFriendshipConnection(input: $input) {
        changedFriendship {
          status
          user1 {
            id
            username
          }
          user2 {
            id
            username
          }
        }
      }
    }
  `,
  "variables": {
    "input": {
      "user1Id": "VXNlcjo0",
      "user2Id": "VXNlcjoz",
      "status": "Accepted"
    }
  }
}

request({
  url: "https://us-west-2.api.scaphold.io/graphql/scaphold-graphql",
  method: "POST",
  json: true,
  headers: {
    "content-type": "application/json",
  },
  body: data
}, function(error, response, body) {
  if (!error && response.statusCode == 200) {
    console.log(JSON.stringify(body, null, 2));
  } else {
    console.log(error);
    console.log(response.statusCode);
  }
});
```

> The above command returns an object structured like this:

```json
{
  "data": {
    "addToFriendshipConnection": {
      "changedFriendship": {
        "status": "Accepted",
        "user1": {
          "id": "VXNlcjo0",
          "username": "Steve Jobs"
        },
        "user2": {
          "id": "VXNlcjoz",
          "username": "Bill Gates"
        }
      }
    }
  }
}
```

If you wanted to create a many-to-many relationship between a type and itself, Scaphold makes it easy to do so! Perhaps you wanted to create a relation between a User type and itself, thereby defining a friendship.

The steps to do so are:

1. Add a field to User called `friends`.

2. It is a `Connection` of type `User` with a many-to-many relationship and a **reverse name that is the same as the field name**. Upon selecting the many-to-many relationship, a new field will appear called `Connection Name`.
This will be the name of the "join table" (in the SQL sense) that will be automatically generated for you after creating the new connection.

    <img src="images/coredata/Many_To_Many.png" alt="Many-to-Many Connection" style="max-width: 50%" />

3. The resulting "join table" will be a new type in your schema. This creates a new table in Scaphold that will hold all your data that pertains to the
edges of the connection for friends on the User type and you can add additional fields to this type as well.

<img src="images/coredata/Join_Table.png" alt="Join Table" />

## Filtering (WhereArgs)

```shell
curl -X POST https://us-west-2.api.scaphold.io/graphql/scaphold-graphql \
  -H "Content-Type: application/json" \
  -d '{ "query": "query ($where: UserWhereArgs) { viewer { allUsers(where: $where) { edges { node { id username } } } } }",
    "variables": { "where": { "username": { "like": "%elon%" } } } }'
```

```javascript
var request = require('request');

var data = {
  "query": `
    query ($where: UserWhereArgs) {
      viewer {
        allUsers(where: $where) {
          edges {
            node {
              id
              username
            }
          }
        }
      }
    }
  `,
  "variables": {
    "where": {
      "username": {
        "like": "%elon%"
      }
    }
  }
}

request({
  url: "https://us-west-2.api.scaphold.io/graphql/scaphold-graphql",
  method: "POST",
  json: true,
  headers: {
    "content-type": "application/json",
  },
  body: data
}, function(error, response, body) {
  if (!error && response.statusCode == 200) {
    console.log(JSON.stringify(body, null, 2));
  } else {
    console.log(error);
    console.log(response.statusCode);
  }
});
```

> The above command returns an object structured like this:

```json
{
  "data": {
    "viewer": {
      "allUsers": {
        "edges": [
          {
            "node": {
              "id": "VXNlcjo3",
              "username": "elon@tesla.com"
            }
          },
          {
            "node": {
              "id": "VXNlcjox",
              "username": "Elon Musk"
            }
          }
        ]
      }
    }
  }
}
```

Scaphold allows you to write GraphQL queries that are compiled down to SQL which means you get powerful filtering abilities with `WhereArgs` as well as compound `orderBy` expressions. We even expose the ability for you to
index certain fields in your data so that you can optimize the queries that are important to your application.

For each Node-implemented type, we provide a way to query using SQL-like syntax through GraphQL! For each field on a particular type, you are able to query by SQL operators and you will be returned a list of instances
that satisfy those filter arguments. The allowable operators include the following:

Name | Description
-------------- | --------------
eq | Equal to. This takes a higher precedence than the other operators.
gt | Greater than.
gte | Greater than or equal to.
lt | Less than.
lte | Less than or equal to.
ne | Not equal to.
between | A two element tuple describing a range of values.
notBetween | A two element tuple describing an excluded range of values.
in | A list of values to include.
notIn | A list of values to exclude.
like | A pattern to match for likeness.
notLike | A pattern to match for likeness and exclude.
isNull | Filters for null values. This takes precedence after `eq` but before all other fields.
