const handleApiCall = (req, res, fetch)=>{
    if(!req.body.input) {
        return res.status(400).json('input value is empty');
    }
    //url e.g. https://www.thestatesman.com/wp-content/uploads/2017/08/1493458748-beauty-face-517.jpg
    let raw = JSON.stringify({
    "user_app_id": {
      "user_id": "4vsdm83py3b7",
      "app_id": "2a7550083c5141eaa36482561950ce7e"
    },
    "inputs": [
      {
        "data": {
          "image": {
            "url": req.body.input
          }
        }
      }
    ]
  });

  const requestOptions = {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Authorization': 'Key 8ae6204c6131416792ddd091a84db80c'
    },
    body: raw
  };

  fetch("https://api.clarifai.com/v2/models/f76196b43bbd45c99b4f3cd8e8b40a8a/outputs", requestOptions)
    .then(response => response.text())
    .then(response => {
        res.json(response)
    })
    .catch(err => {
        res.status(400).json('error processing image');
    })
}

const handleImage = (req, res, db)=>{
    const { id } = req.body;
    db('users')
    .where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
        res.json(entries[0]);
    })
    .catch(err => {
        res.status(400).json('unable to get entries');
    })
}

module.exports = {
    handleImage: handleImage,
    handleApiCall: handleApiCall
}