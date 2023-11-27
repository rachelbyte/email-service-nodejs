"use strict";
// top of file
const AWS = require("aws-sdk");
const ses = new AWS.SES({ region: "us-east-1" });

module.exports.sendEmail = async (event) => {
  // inside the `exports.handler.sendHello` function, before the `return` statement
  // select from the query parameters
  const queryParams = event.queryStringParameters || {};
  let { email, message, subject } = queryParams;

  message =
    message ||
    "This is a message generated automatically from a Lambda function.";
  subject = subject || "Hello from Lambda";

  if (!email) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "Email is required",
      }),
    };
  }
  const params = {
    Destination: {
      ToAddresses: [email], // This should be your email address
    },
    Message: {
      Body: {
        Text: {
          Data: message,
        },
      },
      Subject: {
        Data: subject,
      },
    },
    Source: email, // This is the email listed in sender. Set it to your email for this practice
  };
  await ses.sendEmail(params).promise();
  // in the object that is `return`ed, replace the `body.message` property with `Email sent to ${queryParams.email}`
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: `Email sent to ${email} with subject ${subject} and message ${message}`,
        input: event,
      },
      null,
      2
    ),
  };

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
