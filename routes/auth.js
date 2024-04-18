var express = require('express');
var router = express.Router();
const User = require('../Schemas/User');
const { check, query, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const validation = require('../validator/userValidator');
var jwt = require('jsonwebtoken');


router.get('/me', (req, res, next) => {
  const token = req.headers.authorization;
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded)=> {
    if(err){
      res.status(401).json({message: 'Unauthorized'});
    }
    else{
      res.status(200).json(decoded);
    }
  }) 

})

/* GET users listing. */
router.get('/', function(req, res, next) {
  User.find({})
    .then((users) => res.status(200).json({ users }))
    .catch(err => res.status(400).json('Error:'+ err));
});

//get user by id
router.get('/:id', async (req, res, next) => {
  await User.findOne({ _id: req.params.id })
          .then( user => res.status(200).json(user))
          .catch(err => res.status(400).json('Error:'+ err));
})


//create/register new user
router.post('/register', [validation[0], validation[1], validation[2]], 
async (req, res, next) => {
  try {
    const validationRes = await validationResult(req);
    const userData = req.body;
    const newUser = new User(userData);
      if (!validationRes.isEmpty()){
          return res.status(400).json(validationRes.array());
      }else{
        return newUser.save().then(res.status(200).json('User created successfully' ));
      }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }  
})


//login admin
router.post('/login/admin', async (req, res, next) => {
  const dataBody = req.body;
  const user = await User.findOne({ username: dataBody.username })
  if(!user){
    res.status(404).json({message: 'User not found'});
  }else{
    const check = await bcrypt.compare(dataBody.password, user.password);
    if(check && user.role === 'ADMIN'){
      const payload = {
        userId: user._id,
        username: user.username,
        role: 'ADMIN'
      };

      const jwtOptions = {
        expiresIn: '1d', //thoi gian het han token
        algorithm: 'HS256', //su dung thuat toan ma hoa manh
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET, jwtOptions);
      res.status(200).json({token});
    }
    else{
      res.status(400).json({ message: 'Wrong password or you don\'t have permission to log in'});
    }
  }
})

//login user
router.post('/login/user', async (req, res, next) => {
  const dataBody = req.body;
  const user = await User.findOne({ username: dataBody.username })
  if(!user){
    res.status(404).json({message: 'User not found'});
  }else{
    const check = await bcrypt.compare(dataBody.password, user.password);
    if(check && user.role === 'USER'){

      const payload = {
        userId: user._id,
        username: user.username,
        role: 'USER'
      };

      const jwtOptions = {
        expiresIn: '1d', //thoi gian het han token
        algorithm: 'HS256', 
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET, jwtOptions);
      res.status(200).json({token});
    }
    else{
      res.status(400).json({ message: 'Username or password incorrect!'});
    }
  }
})


//update user
router.put('/:id', async (req, res, next) => {
  const data = req.body;
  data.password = await bcrypt.hash(data.password, 10);
  await User.findByIdAndUpdate(req.params.id, data, {
    new: true,
    runValidators: true,
  })
    .then(() => res.status(200).json('user updated successfully'))
    .catch(err => res.status(400).json('Error:'+ err));
})

//delete user (soft deletion)
router.delete('/:id', async (req, res, next) => {
  const id = req.params.id;
  await User.delete({_id: id})
    .then(() => res.status(200).json({ message: 'user deleted successfully (soft deletion)'}))
    .catch(() => res.status(404).json({ message: 'an error occured while deleting the user' }))
})

//force deletion
router.delete('/:id/delete', async (req, res, next) => {
  const id = req.params.id;
  await User.deleteOne({_id: id})
    .then(() => res.status(200).json({ message: 'deleted successfully (force deletion)'}))
    .catch(() => res.status(404).json({ message: 'an error occured while deleting the user' }))
})

module.exports = router;
