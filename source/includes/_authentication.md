# Authentication

Scaphold seemelessly handles user authentication for you. Each Scaphold application comes with a default User model which includes a `username` and `password` that are used to authenticate your users.
We securely encrypt and store each user's password as well as ensure that they are not readable.

## Token

> Example `loginUser` query

```shell
curl -X POST https://us-west-2.api.scaphold.io/graphql/scaphold-graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "mutation LoginUserQuery ($input: LoginUserInput!) { loginUser(input: $input) { token user { id username createdAt } } }",
    "variables": { "input": { "username": "elon@tesla.com", "password": "SuperSecretPassword" } } }'
```

```javascript
import request from 'request';

const data = {
  "query": `mutation LoginUserQuery ($input: LoginUserInput!) {
    loginUser(input: $input) {
      token
      user {
        id
        username
        createdAt
      }
    }
  }`,
  "variables": {
    "input": {
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
    "loginUser": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE0ODI4ODI0ODgsImlhdCI6MTQ4MTU4NjQ4OCwiYXVkIjoiNDRiZTA4NmYtYmYzMy00OTk3LTgxMzYtOWMwMWQ5OWE4OGM0IiwiaXNzIjoiaHR0cHM6Ly9zY2FwaG9sZC5pbyIsInN1YiI6IjcifQ.TDRtD5vD7MIVrViDgVMThhzOzE_teufTo51a4GZ3aGA",
      "user": {
        "id": "VXNlcjo3",
        "username": "elon@tesla.com",
        "createdAt": "2016-12-08T20:43:14.000Z"
      }
    }
  }
}
```

> <b>Important</b>: Use the `token` in the response in the header of future requests as:<br />
`Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE0ODI4ODI0ODgsImlhdCI6MTQ4MTU4NjQ4OCwiYXVkIjoiNDRiZTA4NmYtYmYzMy00OTk3LTgxMzYtOWMwMWQ5OWE4OGM0IiwiaXNzIjoiaHR0cHM6Ly9zY2FwaG9sZC5pbyIsInN1YiI6IjcifQ.TDRtD5vD7MIVrViDgVMThhzOzE_teufTo51a4GZ3aGA`

Logging in a user is simple. Use the `loginUser` mutation we provide you and we will return a JSON Web Token (JWT) if the credentials match. To authenticate a user, you simply set the `Authorization`
HTTP header of your request with the format `Bearer {TOKEN_FROM_LOGIN_USER}`.

This token informs your API what user is logged in at any given time and enables our permissions system to layer access control rules on your data.

<aside class="notice">
  There are two ways to change a user's password:
  <ul>
    <li>
      <b>Reset password</b>: Use the <code>updateUser</code> mutation to update a user's password given a user's <code>id</code>, and new <code>password</code>.
      Note here that no server-side validation for the old password.
    </li>
    <li>
      <b>Forgot password</b>: Use the <code>updateUserPassword</code> mutation to update a user's password given a user's <code>id</code>, <code>oldPassword</code>, and <code>newPassword</code>.
    </li>
  </ul>
</aside>

## Permissions (Authorization)

> <b>Important</b>: If a type has no permissions then anyone can perform any operations on it so make sure you add them before launching!

Scaphold implements a permissions system that allows you to define powerful access control rules by leveraging a combination of features from role-based access control systems (RBAC) as well as the connections in your API's graph to define what users can access what information.

Each type and field in your schema has an optional set of permissions applied to it. When a user tries to complete an operation, your API checks the type- and field-level permissions and validates that the user is authorized to complete that operation. When you login to the Scaphold portal, you are logged in as an admin user and will have complete access to your application.

To add a permission, click on the `+` sign in the top right for the panel of the type you wish to add a permission to. There you can add a permission for all of the fields of a particular type or only specific fields on that type.

<img src="images/authentication/Add_Permissions.png" alt="Add Permissions" />

The following sections delineate the various types of permissioning that you can apply to your data.

<aside class="notice">
  Keep in mind that if you layer permissions, the most lenient authorization rule wins.
</aside>

### Everyone

`Everyone` scoped permissions are the loosest available. Everyone can access the type. No login required.

### Authenticated

`Authenticated` scoped permissions required a valid auth token to be present in the request headers (See [authentication](#token-auth) for more details). Scaphold provides a number of authentication mechanisms that all work seamlessly with your permissions.

### Roles

> GraphQL types used in role-based permissioning to manage roles, members, and access levels.

```graphql
type User {
  id: ID!
  username: String
  password: Secret
  credentials: CredentialConnection
  lastLogin: DateTime
  roles: RoleConnection
  createdAt: DateTime
  modifiedAt: DateTime
}

type Role {
  id: ID
  name: String
  members: UserConnection
  createdAt: DateTime
  modifiedAt: DateTime
}

type UserRoles {
  accessLevel: AccessLevel
  createdAt: DateTime
  modifiedAt: DateTime
}

enum AccessLevel {
  admin
  readwrite
  readonly
}
```

`Role` permissions allow you to layer more generic role-based authentication methods on top of the connection and user-based permissions you already have. We have added a few queries and mutations that make it easy to manage your new roles and permissions.

In particular, you role-based permissioning is concerned with 3 object types: `User`, `Role`, and a through type called `UserRoles`. In addition, we use the enum `AcessLevel` to manage how much access we should provide a particular instance of a `UserRole`.

Name | Inputs | Description
-------------- | -------------- | --------------
getRole | `id: ID!` | Get objects of type Role by id.
createRole | `name: String!` | Creates a new role and enrolls the creator as a role admin.
updateRole | `id: ID!`, `name: String` | Update an existing role.
deleteRole | `id: ID!` | Delete an existing role. Only role admins can delete roles.
addToUserRolesConnection | `userId: ID!`, `roleID: ID!`, `accessLevel: AccessLevel` | Enrolls a user as a member of a role. Only admins can create other admins and you must be an admin to enroll another user.
updateUserRolesConnection | `userId: ID!`, `roleID: ID!`, `accessLevel: AccessLevel` | Updates a connection between an object of type `User` and an object of type `Role`.
removeFromUserRolesConnection | `userId: ID!`, `roleId: ID!` | Removes a user from a role. Anyone can disenroll themself and admins can disenroll anyone.

By default, we create a special `admin` role for each of your apps. Users that are enrolled into the `admin` role are given full access to your GraphQL API without having to specify any custom permissions.

> `Role` scoped permissions can be used alongside existing `Relation` scoped permissions to easily create complex access control rules. Let's take an example where we would like to have a <b>set of notes</b> that <b>only executives of my company can see</b>.
Part of our schema might look something like this:

```graphql
// Schema
type User {
  id: ID!
  username: String!
  authoredExecNotes: ExecutiveNoteConnection
}

type ExecutiveNote {
  id: ID!
  author: User
  content: String
}

// Permissions
[{
  scope: "ROLE",
  roles: ["Executives"],
  read: true,
  create: true
}
{
  scope: "RELATION",
  userFields: ["author"],
  update: true,
  delete: true
}]
```

### Relation

> Example of `Relation` permission

> A `Post` model might have an `author`. You could specify that only the author of the post can update it by adding the following permission to the `Post` type:

```graphql
{
  scope: "RELATION",
  userFields: ["author"],
  update: true
}
```

`Relation` scoped permissions use the connections in your data's graph to authorize behaviors. When you add a `Relation` permission you tell Scaphold what `User Fields` to inspect to check for the logged in user.

There is a special `Relation` scope permission that gives a user sole access to their own user object. To enable this behavior create a `Relation` scope permission with the desired operation and the user field `me`.
A common use case for the `me` user field is to give a user sole access to update their own user object.

## Social

For social authentication, Scaphold has a solution for that as well! Integrating with OAuth providers like Facebook, Google, and Twtiter has never been easier with Scaphold's Auth0 integration.

Find out how to [integrate social authentication](#social-auth) or [integrate passwordless authentication](#passwordless-auth).

## Super Users

Scaphold provides the ability for you to generate an admin token that gives you super user access that supercedes all permission rules and access controls.
This is a great tool for importing or exporting data, any one-off data management tasks that need to be done, or scheduled jobs.

Please refer to the [Admin Token section](#admin-tokens) under App Management for more details.
