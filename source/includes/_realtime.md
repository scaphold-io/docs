# Real-Time

## Subscriptions With Apollo Client

> Condensed example from our Slackr app (JavaScript only)

```javascript
/* File: addGraphQLSubscriptions.js */

import { print } from 'graphql-tag/printer';

// quick way to add the subscribe and unsubscribe functions to the network interface
export default function addGraphQLSubscriptions(networkInterface, wsClient) {
  return Object.assign(networkInterface, {
    subscribe(request, handler) {
      return wsClient.subscribe({
        query: print(request.query),
        variables: request.variables,
      }, handler);
    },
    unsubscribe(id) {
      wsClient.unsubscribe(id);
    },
  });
}

/* End of file: addGraphQLSubscriptions.js */

------------------------------------------------------------------------

/* File: makeApolloClient.js */

import addGraphQLSubscriptions from './addGraphQLSubscriptions';
import ApolloClient, { createNetworkInterface } from 'apollo-client';
import { Client } from 'subscriptions-transport-ws';

// creates a subscription ready Apollo Client instance
export function makeApolloClient() {
  const scapholdUrl = 'us-west-2.api.scaphold.io/graphql/scaphold-graphql';
  const graphqlUrl = `https://${scapholdUrl}`;
  const websocketUrl = `wss://${scapholdUrl}`;
  const networkInterface = createNetworkInterface(graphqlUrl);
  networkInterface.use([{
    applyMiddleware(req, next) {
      // Easy way to add authorization headers for every request
      if (!req.options.headers) {
        req.options.headers = {};  // Create the header object if needed.
      }
      if (localStorage.getItem('scaphold_user_token')) {
        // This is how to authorize users using http auth headers
        req.options.headers.Authorization = `Bearer ${localStorage.getItem('scaphold_user_token')}`;
      }
      next();
    },
  }]);
  const wsClient = new Client(websocketUrl);
  const networkInterfaceWithSubscriptions = addGraphQLSubscriptions(networkInterface, wsClient);

  const clientGraphql = new ApolloClient({
    networkInterface: networkInterfaceWithSubscriptions,
    initialState: {},
  });
  return clientGraphql;
}

/* End of File: makeApolloClient.js */
```

Apollo Client is a (currently) JavaScript-only networking interface that provides a fully-featured
caching GraphQL client for any server or UI framework. It's an easy-to-use GraphQL networking client
that works with HTTP and web socket requests. We use it at Scaphold to power our web apps, and many
of the examples in [our GitHub](https://github.com/scaphold-io). But you can also use it for your
React Native apps as well to address mobile needs. They are coming out with support for native mobile
iOS and Android clients as well. You can read more about it [here](http://dev.apollodata.com/).

The Scaphold GraphiQL page has already implemented the subscription protocol for you. The good news is that it is really easy to set this up in your own application. Here is how.

1) **Download Apollo Client from npm!** (Apollo Client works pretty much the same whether you are building a React, AngularJS, or vanilla JavaScript applications)

- `npm install apollo-client graphql-tag --save`

- If using React also `npm install react-apollo --save`

- If using Angular2 also `npm install angular2-apollo --save`

2) **Configure the Apollo Client network layer to work with websockets.** To do this we can use the following two code snippets:

The `addGraphQLSubscriptions` function retrofits the Apollo Client network interface with the subscribe and unsubscribe methods that we can use from our application code.

The `makeApolloClient` function then creates a new Apollo Client instance, applies the subscription methods, and adds a peice of authentication middleware before returning the client for use in our application.

This is all we need to do to configure our Apollo Client instance for GraphQL Subscriptions.

## Subscriptions With React

> Condensed example from our Slackr app (JavaScript only)

```javascript
import React from 'react';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';

const ChannelMessagesQuery = gql`
query GetPublicChannels($channelId: ID!, $messageOrder: [MessageOrderByArgs]) {
  getChannel(id: $channelId) {
    id
    name
    messages(last: 50, orderBy: $messageOrder) {
      edges {
        node {
          id
          content
          createdAt
          author {
            id
            username
            nickname
            picture
          }
        }
      }
    }
  }
}
`;

class Messages extends React.Component {

    ...

    componentWillReceiveProps(newProps) {
        if (
            !newProps.data.loading &&
            newProps.data.getChannel
        ) {
            if (
                !this.props.data.getChannel ||
                newProps.data.getChannel.id !== this.props.data.getChannel.id
            ) {
                // If we change channels, subscribe to the new channel
                this.subscribeToNewMessages();
            }
        }
    }

    /*
    *   Initiates the subscription and specifies how new data should be merged
    *   into the cache using the updateQuery method.
    */
    subscribeToNewMessages() {
        this.subscription = this.props.data.subscribeToMore({
            document: gql`
                subscription newMessages($subscriptionFilter:MessageSubscriptionFilter) {
                    subscribeToMessage(mutations:[createMessage], filter: $subscriptionFilter) {
                        value {
                            id
                            content
                            createdAt
                            author {
                                id
                                username
                                nickname
                                picture
                            }
                        }
                    }
                }
            `,
            variables: {
                subscriptionFilter: {
                    channelId: {
                        // We're using react-router and grabbing the channelId from the url
                        // to designate which channel to subscribe to
                        eq: this.props.params ? this.props.params.channelId : null
                    }
                }
            },

            /*
            *    Update query specifies how the new data should be merged
            *    with our previous results. Note how the structure of the
            *    object we return here directly matches the structure of
            *    the GetPublicChannels query.
            */
            updateQuery: (prev, { subscriptionData }) => {
                const newEdges = [
                    ...prev.getChannel.messages.edges,
                    {
                        node: {
                            ...subscriptionData.data.subscribeToMessage.value,
                        }
                    }
                ];
                return {
                    getChannel: {
                        messages: {
                            edges: newEdges,
                        }
                    }
                };
            },
        });
    }

    ...
}

const MessagesWithData = compose(
  graphql(ChannelMessagesQuery, {
    options: (props) => {
      const channelId = props.params ? props.params.channelId : null;
      return {
        returnPartialData: true,
        variables: {
          channelId,
          messageOrder: [
            {
              field: 'createdAt',
              direction: 'ASC'
            }
          ],
        },
      };
    },
  }),
  ... // We compose a few more queries in the actual app.
)(Messages);

export default MessagesWithData;
```


Let's look at a more real world example using React. Apollo comes packed with really nice React bindings
that we can use to simplify the process of subscribing to data and merging new data into the client-side cache.

Take a minute to look over this file. Apollo does a great job allowing us to use real-time subscriptions alongside traditional queries and mutations. The combination of `subscribeToMore` and `updateQuery` offer a powerful set of tools to keep our UI up to date when dealing with real-time data!

[See the complete code on GitHub](https://github.com/scaphold-io/slackr-graphql-subscriptions-starter-kit/blob/master/src/components/messages.jsx)

The `returnPartialData: true` option is important. When you want to use `subscribeToMore` to merge results into the result of a normal query it is necessary to specify this.

A few things are going on here. To make sense of what is happening, lets start from the logical beginning which actually occurs at the end of the file. See this line `const MessagesWithData = compose(graphql(ChannelMessagesQuery, ...));`. This is the standard way to use Apollo to connect a react component with data from a GraphQL query. The `graphql` function will wrap our component in a higher-order component that grabs our data and makes it available to our component via its `props`. In this example, we will be able to access our `Channel` data from our component with `this.props.data.getChannel` as soon as it is fetched.

Okay so we have connected our component with a regular old GraphQL query, but how do we make it real-time? The key is the method `subscribeToMore`.  Look at our `subscribeToNewMessages` method. Apollo's `graphql` function fits our component with the data prop that exposes the `subscribeToMore` method. We use this method to attach a subscription query which then calls the `updateQuery` method we pass in every time a new peice of data is pushed from the server. The object we return from `updateQuery` is then merged with our previous results and persisted in the client side cache. This way, `this.props.data.getChannel...` is always kept up to date and we can use it like normal to render our UI.

## The Full Slackr Tutorial

Follow along as we build a real-time chat application called Slackr. We will cover subscriptions in depth
and show you how to quickly make real-time apps with Apollo Client It covers a lot of material
and has a full example app to boot!

[How to Build real-time Apps with GraphQL Subscriptions](https://scaphold.io/blog/2016/11/09/build-real-time-apps-with-subs.html)

**Slackr Starter Kit**

Check out the [Slackr Starter Kit on Github](https://github.com/scaphold-io/slackr-graphql-subscriptions-starter-kit).
Use it to jump start your next real-time application!
