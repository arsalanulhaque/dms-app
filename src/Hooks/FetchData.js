import axios from 'axios';

const FetchData = async (endpoint, method, body, callback) => {
  try {
    let response = null
    endpoint = process.env.REACT_APP_API_URL + '/'+endpoint
    switch (method) {
      case 'get':
        response = await axios.get(endpoint);
        callback(response.data)
        break;
      case 'delete':
        response = await axios.delete(endpoint, { data: body })
        callback(response?.data?.message)
        break;
      case 'put':
        response = await axios.put(endpoint, body)
        callback(response)
        break;
      case 'post':
        response = await axios.post(endpoint, body)
        if (endpoint.indexOf('login') === -1 || endpoint.indexOf('search') === -1) {
          callback(response)
        } break;
      default:
        break;
    }

  } catch (error) {
    callback(error)

    console.error(error)
  }
};

export default FetchData