const express = require('express');
const router = express.Router();
const mongoFunc = require('../services');

router.get('/api/exercise/log', async (req, res) => {
  let userId = req.query.userId; 
  let from = req.query.from;
  let to = req.query.to;
  let limit = req.query.limit;
  
  if(userId === undefined) {
    res.send("User Id is required");
  } else {  
    let userLog = await mongoFunc.findAndFilter(userId);
    if(userLog === null) {
      res.send("User Id does not Exist");
    } else {   
      let resObj = await mongoFunc.displayLog(userLog, from, to);
      if(limit === undefined) {
        resObj.log = mongoFunc.convertDate(resObj);        
        res.json(resObj);
      } else {
        let arr = resObj.log.splice(0, limit);
        resObj.log = arr;
        resObj.log = mongoFunc.convertDate(resObj);  
        res.json(resObj);
      }     
    }  
  }
})

module.exports = router;