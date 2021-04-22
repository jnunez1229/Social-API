const {User} = require('../models');

const userController = {
    // get all users
    getAllUsers(req, res) {
        User.find({})
        .then(userDB => res.json(userDB))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });     
    },

    getUserById({params}, res) {
        User.findOne({_id: params.id})
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
    }    


}