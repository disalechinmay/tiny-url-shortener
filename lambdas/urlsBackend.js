const AWS = require('aws-sdk');

const dynamo = new AWS.DynamoDB.DocumentClient();

/**
 * Demonstrates a simple HTTP endpoint using API Gateway. You have full
 * access to the request and response payload, including headers and
 * status code.
 *
 * To scan a DynamoDB table, make a GET request with the TableName as a
 * query string parameter. To put, update, or delete an item, make a POST,
 * PUT, or DELETE request respectively, passing in the payload to the
 * DynamoDB API as a JSON body.
 */
exports.handler = async (event, context) => {
	// console.log('Received event:', JSON.stringify(event, null, 2));

	let body;
	let statusCode = '200';
	const headers = {
		'Content-Type': 'application/json'
	};

	try {
		switch (event.requestContext.http.method) {
			case 'GET':
				body = await dynamo
					.scan({
						TableName: 'urls-core',
						FilterExpression: 'prettyName = :val',
						ExpressionAttributeValues: { ':val': event.queryStringParameters.prettyName }
					})
					.promise();
				break;
			case 'POST':
				let parsedBody = JSON.parse(event.body);
				body = await dynamo
					.put({
						TableName: 'urls-core',
						Item: {
							prettyName: parsedBody.prettyName,
							targetUrl: parsedBody.targetUrl,
							expirationTimestamp: parsedBody.expirationTimestamp
						}
					})
					.promise();
				break;
			default:
				throw new Error(`Unsupported method "${event.requestContext.http.method}"`);
		}
	} catch (err) {
		statusCode = '400';
		body = err.message;
	} finally {
		body = JSON.stringify(body);
	}

	return {
		statusCode,
		body,
		headers
	};
};
