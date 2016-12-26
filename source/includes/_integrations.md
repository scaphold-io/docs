# Integrations

>
<aside class="notice">
  <b>Tip</b>: To understand how many of these integrations work in detail, and what new queries and mutations your API will have after enabling a particular integration, you can <b>click on an integration panel</b> in the Integrations Portal to find out.
</aside>

Use Scaphold's integration infrastructure to tie third-party services into your API. When you add an integration, we will automatically update your API with new functionality.
Integrations range in purpose. Want notifications? Add iOS Push. Want payments? Integrate Stripe. Need social auth? Add it with Auth0. Our collection of integrations is always expanding so please let us know if you have any specific requests.

Integrations come in many shapes and sizes. Some integrations like Slack and Webhooks are powered by events in your API while others like Mailgun will expose their functionality by adding queries and mutations to your GraphQL API.

We've got some exciting new integrations coming out soon! Please [let us know](mailto:support@scaphold.io) if you have any specific requests.

## Email

Use **Mailgun** to send and manage email from within your application. Bind emails to events to automate your workflow.

1. Create a free [Mailgun](https://mailgun.com/) account.
2. Add the Mailgun integration and enter your API key and domain name in Scaphold's Integrations Portal.
3. Start sending emails and managing mailing lists from your Scaphold API!

## Monitoring

Use **Apollo Optics** to add in-depth analytics for your API to understand how to optimize your queries.

1. Create an [Apollo Optics](http://www.apollostack.com/optics) account.
2. Add the Apollo Optics integration and enter your API key in Scaphold's Integration Portal.

Every request you make will send information about how your data is being fetche, so you can view the performance of your all your requests through the comprehensive Optics dashboard.

## Passwordless Auth

> We've built a little playground for you to test out passwordless auth using Twitter Digits in an iOS app.
[View on GitHub](https://github.com/scaphold-io/ios-twitter-digits-playground)

> Please reference this example if you're unfamiliar with how to obtain OAuth Echo Headers: [Sample Code](https://fabric.io/kits/ios/digits/features)

Use **Twitter Digits** to extend your app's authentication capabilities, and log in your users with passwordless authentication using their phone number.

1. Create a free Twitter Digits account online using [Fabric](https://docs.fabric.io/apple/digits/installation.html). This is the account management platform that Twitter uses to manage your Twitter integrations for your apps.

2. Once you've done so and installed Digits to your app, follow the steps on the [Digits Sandbox](https://docs.fabric.io/apple/digits/sandbox.html#) to configure your native app to test out the functionality in debug mode.

3. When you have this set up, you'll need to obtain [OAuth Echo Headers](https://docs.fabric.io/apple/digits/advanced-setup.html):

        <img src="images/integrations/Digits_Oauth_Echo_Headers.png" alt="Digits OAuth Echo Headers">

4. Now you can make a request with these header values with the **new mutation called** `loginUserWithDigits` that will allow you to log in a user with this integration.

        It will return a **JWT token that you need to include in your future requests** as the bearer token for your Authorization header so that we can authenticate this particular logged in user.

        This works across authentication mechanisms on Scaphold, so you can link any number of social or passwordless authentication flows.

        <img src="images/integrations/Login_User_With_Digits.png" alt="loginUserWithDigits mutation." />

## Payments

Hook into **Stripe** to instantly add advanced payment methods to your application.

The Stripe integration allows you to quickly and easily link your company's Stripe account with your Scaphold API.

1. Head to [Stripe](https://stripe.com/) and create a free account to get started.
2. Upload your secret key and publishable key via our [Integrations Portal](https://scaphold.io/apps).
3. Rejoice as we have just added tons of new payments functionality to your API.

## Push Notifications

Add **iOS** or **Android** push notifications in an instant.

1. Follow [this tutorial](https://www.raywenderlich.com/123862/push-notifications-tutorial) to create an SSL certificate and PEM file
2. Add the iOS integration and upload your SSL cert and PEM file through our [Integrations Portal](https://scaphold.io/apps).
3. Immediately get access to iOS or Android push notifications via your app's GraphQL API.

Once you've set up your keys, you can start managing device tokens across platforms and send push notification messages to valid device tokens and users.

## Search

> We've built a small boilerplate for you to get started quickly with <a href="https://github.com/scaphold-io/auth0-lock-playground" target="_blank">Auth0 Lock in React</a>.

Use <b>Algolia</b> to extend your app's search capabilities, and query your data seamlessly as your data changes.

1. Create a free [Algolia](https://www.algolia.com/) account. This will help you manage your search indices and monitor your usage. Once you've created your account, you'll receive an Application ID and an API Key.

        <aside class="notice">
          For different apps on Scaphold, you'll need to create a new Algolia account with different keys since new search indices will interfere with existing ones.
        </aside>

2. Configure **Algolia** in Scaphold from the [Integrations Portal](https://scaphold.io/apps) and select the checkboxes in the popup to index data of that particular type.

        <img class="news-how-to-img" src="images/integrations/Algolia_Index.png" alt="Configure your Algolia integration">

3. As soon as you enable search on a particular type, Scaphold will index each existing piece of data for that type into Algolia's system and future CREATE, UPDATE, and DELETE commands will be reflected in both Scaphold and Algolia for search. These commands will be the same as before; however you now have a **new query for each indexed type under Viewer** that will allow you to search for query terms along with optional parameters.

        <img class="news-how-to-img" src="images/integrations/Algolia_Viewer.png" alt="Search for a term">

## Social Auth

Use **Auth0** to extend your app's login and registration flow painlessly through your favorite social authentication services.

1. Create a free [Auth0](https://auth0.com/) account. This will help you manage your app credentials like client IDs and secrets for your OAuth providers. By connecting your apps on your social accounts like Facebook, Google, and Twitter, you'll then have the correct account credentials to utilize these services for your authentication flow.

        <img src="images/integrations/Configure_Auth0_Account.png" alt="Configure your Auth0 apps.">

2. Configure Auth0 in Scaphold from the [Integrations Portal](https://scaphold.io/apps) to include the OAuth providers that you plan to use for your app. This will enable a new mutation called `loginUserWithAuth0Social` which you can use to log in users with connected OAuth providers.

3. In your client app, you'll likely be using a client SDK to handle user login. For instance, you can use the [Facebook SDK for React Native](https://github.com/facebook/react-native-fbsdk) to ask your users to log in with their existing Facebook accounts. Once this succeeds, you'll receive an `access token` to send to Scaphold.

        <img src="images/integrations/Configure_Auth0.png" alt="Configure your Auth0 integration to include auth providers">

        <img src="images/integrations/Get_Access_Token.png" alt="Get access token">

        <aside class="notice">
          **UPDATE:** Mutation name is now called `loginUserWithAuthOSocial`
        </aside>

4. After Scaphold verifies the access token with the OAuth provider (i.e. Facebook), we'll pass back the **JSON Web Token (JWT)** that you'll need to add to your authorization header for future requests. That way, you will be authorized to make future requests through Scaphold and it will also provide us the capability to work on that user's behalf to access the OAuth provider's resources. For instance, we could authorize you to access your Facebook friends and their public profile information.

        <img src="images/integrations/Insert_Jwt_Header.png" alt="Set JWT token in header">

5. In addition, if you've logged in already and you make a request to `loginUserWithAuth0Social` again but with a new OAuth provider (i.e. Google), Scaphold will link your two accounts together, since we know the requests being made belong to one user. Now, you'll have access to both Facebook and Google information using Facebook's and Google's account credentials.

        <img src="images/integrations/Link_Google_User.png" alt="Link Google account">

        <aside class="notice">
          **UPDATE:** Mutation name is now called `loginUserWithAuthOSocial`
        </aside>

6. If you'd like to use Auth0 Lock as a client-side SDK to manage your authentication, you can do so with the `loginUserWithAuth0Lock` mutation. This accepts the identity parameter that the client receives from a successful Auth0 Lock login in the profile variable. These work in sync with all other Scaphold basic and social authentication flows so you can manage your users the way you want.

## Webhooks

Use the **Custom** integration to define webhooks, events, and custom logic in your API. Perhaps you would like to send an email to your users to welcome them after they've signed up. Webhooks are a powerful way to implement this workflow.

1. Host a microservice with an HTTP URL (you can use something like [AWS Lambda](https://aws.amazon.com/lambda/)) that defines the custom logic you need (perhaps to send a welcome email).

2. Configure the integration in Scaphold with the microservice URL that you want to send the request to, along with the fragment of the mutation that is associated with the data, in order to supply the microservice with the appropriate information.

3. Set when you want to the webhook to fire (e.g. `afterCreate` on the `User` type).
