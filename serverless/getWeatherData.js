const axios = require('axios');

exports.handler = async (event) => {
    const {location} = event.queryStringParameters;
    const apiKey = process.env.REACT_APP_API_KEY;
    const apiCall = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&days=3&aqi=no&alerts=no`
    
    try {
        const {data} = await axios(apiCall);

        return {
            statusCode: 200,
            body: JSON.stringify(data)
        }
    } catch (err) {
        return {
            statusCode: 422,
            body: err.stack
         }
    }
}