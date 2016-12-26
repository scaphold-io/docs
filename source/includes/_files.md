# Files

> <aside class="notice">
  All Scaphold APIs come with blob storage by default and all paid apps will be served files through a globally distributed CDN.
</aside>

File support in Scaphold is cooked into your schema. That means that any type that implements the `Blob`
interface can be associated with a file stored in our distributed blob storage. When you create
an app, we start you off with both the `Blob` interface as well as a `File` type. The `File` type implements
`Blob` and `Node` and thus can both be connected to other types in your schema via Connection fields as well
as handle file uploads and downloads.

### Uploading Files

> Example file upload
Mark Zuckerberg's user ID: `VXNlcjoxMA==`

```shell
curl -v https://us-west-2.api.scaphold.io/graphql/scaphold-graphql \
  -H "Content-Type:multipart/form-data" \
  -F 'query=mutation CreateFile($input: CreateFileInput!) { createFile(input: $input) { changedFile { id name blobMimeType blobUrl user { id username } } } }' \
  -F 'variables={ "input": { "name": "Profile Picture", "userId": "VXNlcjoxMA==", "blobFieldName": "myBlobField" } };type=application/json' \
  -F myBlobField=@mark-zuckerberg.jpg
```

```javascript

// You must also install these npm modules:
// npm install --save form-data
// npm install --save node-fetch

var fetch = require('node-fetch');
var FormData = require('form-data');
var fs = require('fs');

var form = new FormData();
form.append("query", `
  mutation CreateFile($input: CreateFileInput!) {
    createFile(input: $input) {
      changedFile {
        id
        name
        blobMimeType
        blobUrl
        user {
          id
          username
        }
      }
    }
  }
`);
form.append("variables", JSON.stringify({
  "input": {
    "name": "Mark Zuck Profile Picture",
    "userId": "VXNlcjoxMA==",
    "blobFieldName": "myBlobField"
  }
}));
// The file's key matches the value of the field `blobFieldName` in the variables
form.append("myBlobField", fs.createReadStream('./mark-zuckerberg.jpg'));

fetch("https://us-west-2.api.scaphold.io/graphql/scaphold-graphql", {
  method: 'POST',
  body: form
}).then(function(res) {
  return res.text();
}).then(function(body) {
  console.log(body);
});
```

> The above command returns an object structured like this:

```json
{
  "data": {
    "createFile": {
      "changedFile": {
        "id": "RmlsZTo5",
        "name": "Mark Zuck's Profile Picture",
        "blobMimeType": "image/jpeg",
        "blobUrl": "https://s3-us-west-2.amazonaws.com/production.us-west-2.scaphold.v2.customer/44be086f-bf33-4997-8136-9c01d99a88c4/data/2fb4b11d-cef9-465d-9ad6-e3d8b693f121/2b86488a-7114-4071-9e30-157855475eb7?AWSAccessKeyId=AKIAJIC3JY2ICINJH2OQ&Expires=1481686711&Signature=pa4QbkPCk%2BXlgSrKBWcRKsEckSs%3D",
        "user": {
          "id": "VXNlcjoxMA==",
          "username": "Mark Zuckerberg"
        }
      }
    }
  }
}
```

Uploading files is simple. All you need to do is attach the file to a multipart/form-data request
and point to it using the `blobFieldName` attribute in the `Blob` implemented type's input object.

All types that implement `Blob` will receive an additional input field called `blobFieldName`.

### Querying Files

> Example of querying for a file
File ID: `RmlsZTo5`

```shell
curl -X POST https://us-west-2.api.scaphold.io/graphql/scaphold-graphql \
  -H "Content-Type: application/json" \
  -d '{ "query": "query GetFile { getFile(id: \"RmlsZTo5\") { id name blobMimeType blobUrl user { id username } } }",
    "variables": {} }'
```

```javascript
var request = require('request');

var data = {
  "query": `
    query GetFile {
      getFile(id: "RmlsZTo5") {
        id
        name
        blobMimeType
        blobUrl
        user {
          id
          username
        }
      }
    }
  `,
  "variables": {}
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
    "getFile": {
      "id": "RmlsZTo5",
      "name": "Mark Zuck's Profile Picture",
      "blobMimeType": "image/jpeg",
      "blobUrl": "https://s3-us-west-2.amazonaws.com/production.us-west-2.scaphold.v2.customer/44be086f-bf33-4997-8136-9c01d99a88c4/data/2fb4b11d-cef9-465d-9ad6-e3d8b693f121/2b86488a-7114-4071-9e30-157855475eb7?AWSAccessKeyId=AKIAJIC3JY2ICINJH2OQ&Expires=1481690209&Signature=icwTcNl%2B%2BTwQy8Ar6jLuquztwu0%3D",
      "user": {
        "id": "VXNlcjoxMA==",
        "username": "Mark Zuckerberg"
      }
    }
  }
}
```

Querying files acts the same as other types. All types that implement `Blob` have a field `blobUrl` and `blobMimeType`
that are automatically managed by Scaphold. The `blobUrl` is a pre-signed URL that points to your file in a private
blob store hosted on Amazon S3. If youre app is on a paid tier, all pre-signed URLs will be served by
a globally distributed CDN hosted by Amazon CloudFront.
