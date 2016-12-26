# App Management

## Aliases

Simplify your API URL with an alias!

Now when you create an app, you can choose to set an alias. An alias is a unique name for your application that can be used in the URL to access your API.
For example, if I set an alias for my app of `scaphold` then I could access my application at the url `https://us-west-2.api.scaphold.io/graphql/scaphold`.

<aside class="notice">
  Alias names must be 6 characters or greater in length, must contain only lowercase letters, numbers, and dashes, and must not end or begin in a dash.
</aside>

You can also change an alias at any time by clicking `My API` at the top of the page.

<img src="images/management/Set_Alias.png" alt="Copy and paste the code into your app." style="max-width: 75%" />

## Analytics

Scaphold comes full circle with a comprehensive analytics dashboard so you can always get the latest updates on the performance, growth, and usage of your app in production.

Name | Description
-------------- | --------------
Request Counts | Total number of requests broken down by hour
Average Response Time | Measures latency (in seconds) in your API broken down by hour
User Growth | Tracks the number of new users that are signing up for your app
Data Throughput | Amount of data (in MB) that's being transmitted over the wire to your client apps
Resolvers by Type | Sorts your GraphQL requests by the associated type to help break down which part of your API is being used the most
Error Counts | Total number of errors broken down by hour
Application Logs | Table of all the latest logs for your API

Our goal is to give you as much transparency as we can into your GraphQL API, so you can make the best app possible. Please email us at [support@scaphold.io](mailto:support@scaphold.io)
if you have any requests for metrics you would like to see that would help you better measure and analyze the success of your app.

## Export Schema

Exporting your schema can be useful if you want to see what the raw JSON version of your data model looks like.

Scaphold manages two versions of your schema:

1. **Standard GraphQL**: Download a standard version of your GraphQL schema that you can use with any GraphQL server.

2. **Scaphold Schema**: Save a copy of your up-to-date GraphQL schema that you can use to create an app on Scaphold.

## Fork App

Forking an app will make an exact copy of the app in a new environment. That means the new app will automatically configure itself to be identical to the
source but it will have its own data, schema, and API. This is useful for testing schema changes before making any migrations to your production applications.
Once you have tested your changes and manually merged them into your production app you can safely remove the fork.

You can fork an app in 2 ways:

1. **Apps Page > Underneath each API link** for each app panel (top-right)

2. **Settings Page > Advanced**

## Teams

App development is always more fun and faster in teams! Which is why we've provided you the ability to collaborate with others on apps.

There are two ways to add a teammate:

1. **Bottom left of the left side panel** in the app-view.

    <img src="images/management/Add_Teammate_Panel.png" alt="Add a teammate in side panel" style="max-width:50%" />

2. **Settings Page > Team**

    <img src="images/management/Add_Teammate_Settings.png" alt="Add a teammate in Settings" />

In addition to adding a teammate, you may also want to remove a teammate. To do so, navigate to the **Settings Page > Team**, click on the bubble under **Teammates**
that designates the user you wish to remove from this app, and a dropdown will appear that will allow you to remove that user.

<aside class="notice">
  Transferring ownership of an app is also possible. Keep in mind that this will also transfer the payment method associated with a particular app, since payment methods
  belong to an individual user account (i.e. The app owner's payment source will always be the one associated with an app's billing).
</aside>

## Regions

Scaphold is now deployed in multiple regions and counting! With growing demand for Scaphold's service by developers around the world, we're always open to setting up new infrastructure
so that your data lives closer to you.

Currently, we're deployed in...

1. US West (Oregon)

2. EU West (Ireland)

3. More to come. If you wish to have Scaphold deployed on a data center in your region, please contact us at [support@scaphold.io](mailto:support@scaphold.io).

To switch between regions, select the region you wish to use in the **header bar of the Scaphold dashboard**.

<img src="images/management/Multi_Region.png" alt="Multiple regions" style="max-width:75%" />

<aside class="notice">
  <b>Tip</b>: Your app's GraphQL API will be prefixed with the region that it belongs to (e.g. <code>https://us-west-2.api.scaphold.io/graphql/scaphold-graphql</code> is in the US West region).
</aside>

## Admin Tokens

With admin tokens, you have the ability to bypass any permissions that have been set in your API. By setting this as `Authorization: Bearer {ADMIN_TOKEN}` in your header
like any other auth token in Scaphold, you become an admin user. This is useful for importing or exporting data, any one-off data management tasks that need to be done, or scheduled jobs.

To create a admin token, navigate to **Settings Page > Admin Tokens > Create**

<aside class="notice">
  Note: Admin tokens never expire, unless you delete them.
</aside>

## Token Expiration

Scaphold gives you full control over how your tokens are managed for authentication. As such, we provide the ability to control the expiration of the JsonWebToken (JWT) measured in seconds
from when it was issued. This refers to the token issued during mutation calls such as `loginUser`, or any social auth flow.

To configure the token expiration time, please navigate to **Settings Page > Advanced**

<aside class="notice">
  The default value is 1,296,000 seconds (i.e. 15 days, or ~2 weeks).
</aside>
