import axios from 'axios';

// Function to fetch data from the API
async function fetchApi() {
    try {
        const url = 'https://api.rtgreh5erh4.com/api/webapi/GetNoaverageEmerdList';

        const headers = {
            'Accept': 'application/json, text/plain, */*',
            'Authorization': 'Bearer YOUR_BEARER_TOKEN',
            'Content-Type': 'application/json;charset=UTF-8',
            'Origin': 'https://sikkim8.com',
            'Referer': 'https://sikkim8.com/',
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'cross-site',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36'
        };

        // Generate a new timestamp for each request if needed
        const timestamp = Math.floor(Date.now() / 1000); // Current time in seconds

        const data = {
            pageSize: 10,
            pageNo: 1,
            typeId: 1,
            language: 0,
            random: '480878438e8140c6859fb598c67812bc',
            signature: 'AEBA6A51F0A72530E49FDDFEADBC93D6',
            timestamp: timestamp
        };

        const response = await axios.post(url, data, { headers });
        const responseData = response.data;
        const list = responseData.data.list;

        return list.map(item => ({
            issueNumber: item.issueNumber,
            number: item.number,
            colour: item.colour
        }));
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

export async function getPrediction() {
    try {
        const apiRes = await fetchApi();
        if (apiRes.length === 0) {
            throw new Error('No data available from API.');
        }

        const firstIssueNumber = apiRes[0].issueNumber;
        const firstResultNumber = parseInt(apiRes[0].number, 10); // Ensure number is an integer
        const newPeriodNumber = (parseInt(firstIssueNumber, 10) + 1).toString(); // Increment issueNumber

        let newSize;
        if ([0, 1, 2, 3, 4].includes(firstResultNumber)) {
            newSize = 'Small';
        } else {
            newSize = 'Big';
        }

        const prediction = {
            period: newPeriodNumber,
            result: newSize
        };
        return prediction;
    } catch (error) {
        console.error('Error in getPrediction function:', error);
        throw error;
    }
}
export async function getResult() {
    try {
        const apiRes = await fetchApi();
        if (apiRes.length === 0) {
            throw new Error('No data available from API.');
        }

        // Get the first 5 items from the API response
        const firstFiveItems = apiRes.slice(0, 5);

        // Process the first 5 items
        const results = firstFiveItems.map(item => {
            const resultNumber = parseInt(item.number, 10); // Convert to integer
            const resultSize = (resultNumber <= 4) ? 'Small' : 'Big'; // Determine size based on resultNumber

            return {
                periodNumber: item.issueNumber,
                resultNumber: resultNumber,
                resultSize: resultSize
            };
        });

        return results;
    } catch (error) {
        console.error('Error in getResult function:', error);
        throw error;
    }
}