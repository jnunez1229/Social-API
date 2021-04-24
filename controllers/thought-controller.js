const {Thought, User} = require('../models');

const ThoughtController = {
    // get all Thoughts
    getAllThoughts(req, res) {
        Thought.find({})
        .then(thoughtDB => res.json(thoughtDB))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });     
    },

    getThoughtById({params}, res) {
        Thought.findOne({_id: params.id})
        .then(thoughtDB => {
            // 404 if no Thought found
            if(!thoughtDB){
                res.status(404).json({message: 'No Thought found with this ID'});
                return;
            }
            res.json(thoughtDB)
        })
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
    },

    // createThought
    createThought({params, body}, res) {
        console.log(params);
        Thought.create(body)
        .then(({_id}) => {
            return User.findOneAndUpdate(
                {_id: body.userId},
                {$push: {thoughts: _id}},
                {new: true}
            )
        })
        .then(userDB => {
            // 404 if no user found
            if(!userDB){
                res.status(404).json({message: 'No user found with this ID'});
                return;
            }
            res.json(userDB)
        })
        .catch(err => res.status(400).json(err));
    },

    // update Thought by id
    updateThought({params, body}, res) {
        Thought.findOneAndUpdate({ _id: params.id}, body, { new: true, runValidators: true})
            .then(thoughtDB => {
                if(!thoughtDB){
                    res.status(404).json({message: 'No Thought found with this id'})
                    return;
                }
                res.json(thoughtDB);
            })
            .catch(err => res.status(400).json(err));
    },

    // delete Thought
    deleteThought({ params }, res) {
        Thought.findOneAndDelete({_id: params.id})
            .then(thoughtDB => {
                if(!ThoughtDB){
                    res.status(404).json({ message: 'No Thought found with this id'});
                    return;
                }
                res.json(thoughtDB);
            })
            .catch(err => res.status(400).json(err));
    }    
}

module.exports = ThoughtController;