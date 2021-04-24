const {User} = require('../models');

const userController = {
    // get all users
    getAllUsers(req, res) {
        User.find({})
        .populate({
            path: 'thoughts',
            select: '-__v'
        })
        .populate({
            path: 'thoughts',
            select: '-__v'
        })
        .then(userDB => res.json(userDB))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });     
    },

    getUserById({params}, res) {
        User.findOne({_id: params.id})
        .populate({
            path: 'thoughts',
            select: '-__v'
        })
        .populate({
            path: 'friends',
            select: '-__v'
        })
        .then(userDB => {
            // 404 if no user found
            if(!userDB){
                res.status(404).json({message: 'No user found with this ID'});
                return;
            }
            res.json(userDB)
        })
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
    },

    // createUser
    createUser({body}, res) {
        User.create(body)
        .then(userDB => res.json(userDB))
        .catch(err => res.status(400).json(err));
    },

    // update user by id
    updateUser({params, body}, res) {
        User.findOneAndUpdate({ _id: params.id}, body, { new: true, runValidators: true})
            .then(userDB => {
                if(!userDB){
                    res.status(404).json({message: 'No user found with this id'})
                    return;
                }
                res.json(userDB);
            })
            .catch(err => res.status(400).json(err));
    },

    addFriend({ params, body }, res) {
        console.log(params)
        console.log(body)
        User.findByIdAndUpdate(
          params.id,
          { $push: { friends: params.friendId } },
          { new: true }
        )
          .then(userData => {
            if (!userData) {
              res.status(404).json({ message: 'No user found with this id!' });
              return;
            }
            res.json(userData);
          })
          .catch(err => res.json(err));
    },

    // delete user
    deleteUser({ params }, res) {
        User.findOneAndDelete({_id: params.id})
            .then(userDB => {
                if(!userDB){
                    res.status(404).json({ message: 'No user found with this id'});
                    return;
                }
                res.json(userDB);
            })
            .catch(err => res.status(400).json(err));
    },

    removeFriend({ params }, res) {
        User.findByIdAndUpdate(
            params.id,
            { $pull: { friends: params.friendId } },
            { new: true }
          )
            .then(userData => {
              if (!userData) {
                res.status(404).json({ message: 'No user found with this id!' });
                return;
              }
              res.json(userData);
            })
            .catch(err => res.json(err));
    } 
}

module.exports = userController;